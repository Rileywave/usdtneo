import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "../db/schema.js";
import { authenticateRequest } from "./kimi/auth.js";
import { verifyLocalToken } from "./routers/local-auth-router.js";
import { getUserById } from "./queries/users-ext.js";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth first
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // OAuth not available
  }

  // Try local auth token if no OAuth user
  if (!ctx.user) {
    try {
      const localToken = opts.req.headers.get("x-local-auth-token");
      if (localToken) {
        const claim = await verifyLocalToken(localToken);
        if (claim) {
          const user = await getUserById(claim.userId);
          if (user) {
            ctx.user = user;
          }
        }
      }
    } catch {
      // Local auth not available
    }
  }

  return ctx;
}
