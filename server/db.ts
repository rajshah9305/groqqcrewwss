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
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error("[Database] ❌ DATABASE_URL environment variable is not set");
      console.error("[Database] Please set DATABASE_URL in your Vercel environment variables");
      return null;
    }
    
    try {
      // Handle both connection string formats (with and without psql prefix)
      let connectionString = databaseUrl;
      if (connectionString.startsWith("psql ")) {
        // Remove 'psql ' prefix if present
        connectionString = connectionString.substring(5).trim();
        // Remove quotes if present
        connectionString = connectionString.replace(/^['"]|['"]$/g, '');
      }
      
      // Determine SSL requirement
      const requiresSSL = connectionString.includes('sslmode=require') || 
                         connectionString.includes('neon.tech') ||
                         connectionString.includes('supabase.co');
      
      const pool = new Pool({
        connectionString: connectionString,
        ssl: requiresSSL ? { rejectUnauthorized: false } : undefined,
        max: 10, // Limit connections for serverless
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      
      // Test the connection
      try {
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
      } catch (testError) {
        console.error("[Database] ❌ Connection test failed:", testError);
        pool.end();
        throw testError;
      }
      
      _db = drizzle(pool);
      console.log("[Database] ✓ Connected successfully to database");
    } catch (error) {
      console.error("[Database] ❌ Failed to connect to database:", error);
      if (error instanceof Error) {
        console.error("[Database] Error message:", error.message);
        console.error("[Database] Error code:", (error as any).code);
      }
      _db = null;
      // Don't throw - return null to allow graceful degradation
      return null;
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

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function ensureDefaultUser(): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot ensure default user: database not available");
    return;
  }

  try {
    const existingUser = await getUserById(1);
    if (!existingUser) {
      await upsertUser({
        openId: "default-user-no-auth",
        name: "Default User",
        email: "default@example.com",
        role: "user",
      });
      console.log("[Database] Created default user");
    }
  } catch (error) {
    console.error("[Database] Failed to ensure default user:", error);
  }
}

// NLP Task operations
export async function createNlpTask(task: InsertNlpTask): Promise<NlpTask> {
  const db = await getDb();
  if (!db) {
    const error = new Error("Database not available. Please check DATABASE_URL environment variable.");
    console.error("[Database] Cannot create task:", error);
    throw error;
  }

  try {
    // Ensure default user exists before creating task
    await ensureDefaultUser();
    
    const result = await db.insert(nlpTasks).values(task).returning();
    if (!result[0]) {
      const error = new Error("Failed to create task: No result returned from database");
      console.error("[Database] Task creation failed:", error);
      throw error;
    }
    
    return result[0];
  } catch (error) {
    console.error("[Database] Error creating task:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to create task: ${String(error)}`);
  }
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
