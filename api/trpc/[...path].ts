import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";

// Vercel serverless function wrapper for tRPC
export default async function handler(req: Request): Promise<Response> {
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
      console.error(`tRPC error on '${path}':`, error);
    },
  });
}

