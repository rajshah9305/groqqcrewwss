import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;
import { 
  InsertUser, 
  users, 
  nlpTasks, 
  InsertNlpTask, 
  NlpTask,
  agentConfigs,
  InsertAgentConfig,
  AgentConfig,
  taskLogs,
  InsertTaskLog,
  TaskLog,
  userPreferences,
  InsertUserPreference,
  UserPreference,
  savedResults,
  InsertSavedResult,
  SavedResult
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// NLP Task operations
export async function createNlpTask(task: InsertNlpTask): Promise<NlpTask> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(nlpTasks).values(task).returning();
  if (!result[0]) throw new Error("Failed to create task");
  
  return result[0];
}

export async function updateNlpTask(id: number, updates: Partial<InsertNlpTask>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(nlpTasks).set(updates).where(eq(nlpTasks.id, id));
}

export async function getNlpTaskById(id: number): Promise<NlpTask | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(nlpTasks).where(eq(nlpTasks.id, id)).limit(1);
  return result[0];
}

export async function getUserNlpTasks(userId: number, limit: number = 50): Promise<NlpTask[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(nlpTasks)
    .where(eq(nlpTasks.userId, userId))
    .orderBy(desc(nlpTasks.createdAt))
    .limit(limit);
}

export async function deleteNlpTask(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(nlpTasks).where(
    and(eq(nlpTasks.id, id), eq(nlpTasks.userId, userId))
  );
}

// Agent Config operations
export async function createAgentConfig(config: InsertAgentConfig): Promise<AgentConfig> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(agentConfigs).values(config).returning();
  if (!result[0]) throw new Error("Failed to create agent config");
  
  return result[0];
}

export async function getUserAgentConfigs(userId: number): Promise<AgentConfig[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(agentConfigs)
    .where(eq(agentConfigs.userId, userId))
    .orderBy(desc(agentConfigs.createdAt));
}

export async function getPublicAgentConfigs(): Promise<AgentConfig[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(agentConfigs)
    .where(eq(agentConfigs.isPublic, true))
    .orderBy(desc(agentConfigs.usageCount));
}

export async function incrementAgentConfigUsage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const config = await db.select().from(agentConfigs).where(eq(agentConfigs.id, id)).limit(1);
  if (config[0]) {
    await db.update(agentConfigs)
      .set({ usageCount: (config[0].usageCount || 0) + 1 })
      .where(eq(agentConfigs.id, id));
  }
}

// Task Log operations
export async function createTaskLog(log: InsertTaskLog): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(taskLogs).values(log);
}

export async function getTaskLogs(taskId: number): Promise<TaskLog[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(taskLogs)
    .where(eq(taskLogs.taskId, taskId))
    .orderBy(desc(taskLogs.createdAt));
}

// User Preferences operations
export async function getUserPreferences(userId: number): Promise<UserPreference | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
  return result[0];
}

export async function upsertUserPreferences(prefs: InsertUserPreference): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userPreferences).values(prefs).onConflictDoUpdate({
    target: userPreferences.userId,
    set: prefs,
  });
}

// Saved Results operations
export async function createSavedResult(result: InsertSavedResult): Promise<SavedResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const insertResult = await db.insert(savedResults).values(result).returning();
  if (!insertResult[0]) throw new Error("Failed to create saved result");
  
  return insertResult[0];
}

export async function getUserSavedResults(userId: number): Promise<SavedResult[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(savedResults)
    .where(eq(savedResults.userId, userId))
    .orderBy(desc(savedResults.createdAt));
}
