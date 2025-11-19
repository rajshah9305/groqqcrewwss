#!/usr/bin/env tsx
/**
 * Database schema verification script
 * Verifies that all required enum types and tables exist in the database
 */

import { getDb } from "../server/db";
import { sql } from "drizzle-orm";

async function verifySchema() {
  console.log("[DB Verify] Starting database schema verification...");
  
  try {
    const db = await getDb();
    if (!db) {
      console.error("[DB Verify] ❌ Database connection failed");
      process.exit(1);
    }

    console.log("[DB Verify] ✓ Database connected");

    // Check if enum types exist
    const enumTypes = [
      "taskType",
      "status", 
      "priority",
      "role",
      "agentType",
      "format",
      "logLevel",
      "theme"
    ];

    console.log("[DB Verify] Checking enum types...");
    for (const enumType of enumTypes) {
      try {
        const result = await db.execute(
          sql`SELECT typname FROM pg_type WHERE typname = ${enumType}`
        );
        if (result.rows.length === 0) {
          console.error(`[DB Verify] ❌ Enum type '${enumType}' not found in database`);
          console.error(`[DB Verify] Please run: pnpm db:push`);
          process.exit(1);
        } else {
          console.log(`[DB Verify] ✓ Enum type '${enumType}' exists`);
        }
      } catch (error) {
        console.error(`[DB Verify] ❌ Error checking enum '${enumType}':`, error);
        process.exit(1);
      }
    }

    // Check if tables exist
    const tables = [
      "users",
      "nlp_tasks",
      "agent_configs",
      "task_logs",
      "user_preferences",
      "saved_results"
    ];

    console.log("[DB Verify] Checking tables...");
    for (const table of tables) {
      try {
        const result = await db.execute(
          sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = ${table}`
        );
        if (result.rows.length === 0) {
          console.error(`[DB Verify] ❌ Table '${table}' not found in database`);
          console.error(`[DB Verify] Please run: pnpm db:push`);
          process.exit(1);
        } else {
          console.log(`[DB Verify] ✓ Table '${table}' exists`);
        }
      } catch (error) {
        console.error(`[DB Verify] ❌ Error checking table '${table}':`, error);
        process.exit(1);
      }
    }

    // Check enum values for taskType
    console.log("[DB Verify] Verifying taskType enum values...");
    try {
      const result = await db.execute(
        sql`SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'taskType') ORDER BY enumsortorder`
      );
      const enumValues = result.rows.map((row: any) => row.enumlabel);
      const expectedValues = ["summarization", "analysis", "research", "content_generation", "code_generation", "translation", "custom"];
      
      console.log(`[DB Verify] Found enum values: ${enumValues.join(", ")}`);
      console.log(`[DB Verify] Expected enum values: ${expectedValues.join(", ")}`);
      
      const missing = expectedValues.filter(v => !enumValues.includes(v));
      const extra = enumValues.filter(v => !expectedValues.includes(v));
      
      if (missing.length > 0) {
        console.error(`[DB Verify] ❌ Missing enum values: ${missing.join(", ")}`);
        console.error(`[DB Verify] Please run: pnpm db:push`);
        process.exit(1);
      }
      if (extra.length > 0) {
        console.warn(`[DB Verify] ⚠️  Extra enum values found: ${extra.join(", ")}`);
      }
      console.log(`[DB Verify] ✓ All required enum values exist`);
    } catch (error) {
      console.error(`[DB Verify] ❌ Error verifying enum values:`, error);
      process.exit(1);
    }

    console.log("[DB Verify] ✅ Database schema verification complete");
    process.exit(0);
  } catch (error) {
    console.error("[DB Verify] ❌ Schema verification failed:", error);
    if (error instanceof Error) {
      console.error("[DB Verify] Error message:", error.message);
      console.error("[DB Verify] Error stack:", error.stack);
    }
    process.exit(1);
  }
}

verifySchema();

