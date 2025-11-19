import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";
import { ensureDefaultUser } from "../../server/db";

// Ensure default user exists (only runs once per serverless function instance)
let defaultUserEnsured = false;

// Vercel serverless function wrapper for tRPC
export default async function handler(req: Request): Promise<Response> {
  // Ensure default user exists on first request
  if (!defaultUserEnsured) {
    try {
      await ensureDefaultUser();
      defaultUserEnsured = true;
    } catch (error) {
      console.error("[Serverless] Failed to ensure default user:", error);
      // Continue anyway - the user might already exist
    }
  }

  return fetchRequestHandler({
    router: appRouter,
    req,
    endpoint: "/api/trpc",
    createContext: async () => {
      // Create a minimal context for Vercel serverless
      return {
        req: req as any,
        res: {} as any,
      };
    },
    onError: ({ error, path }) => {
      console.error(`[tRPC] Error on '${path}':`, error);
      console.error(`[tRPC] Error message:`, error.message);
      console.error(`[tRPC] Error stack:`, error.stack);
    },
  });
}

