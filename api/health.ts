import { getDb } from "../server/db.js";
import { sql } from "drizzle-orm";

/**
 * Health check endpoint to verify database connection
 * Access at: /api/health
 */
export default async function handler(req: Request): Promise<Response> {
  const startTime = Date.now();

  try {
    // Test database connection
    const db = await getDb();

    if (!db) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Database connection failed - DATABASE_URL not configured",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Try a simple query
    await db.execute(sql`SELECT 1`);

    const responseTime = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        status: "healthy",
        database: "connected",
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        status: "error",
        message: `Database connection failed: ${errorMessage}`,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
