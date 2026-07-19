import { authRouter } from "./auth-router.js";
import { localAuthRouter } from "./routers/local-auth-router.js";
import { tierRouter } from "./routers/tier-router.js";
import { settingsRouter } from "./routers/settings-router.js";
import { userRouter } from "./routers/user-router.js";
import { upgradeRouter } from "./routers/upgrade-router.js";
import { withdrawalRouter } from "./routers/withdrawal-router.js";
import { referralRouter } from "./routers/referral-router.js";
import { dashboardRouter } from "./routers/dashboard-router.js";
import { adminRouter } from "./routers/admin-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  localAuth: localAuthRouter,
  tier: tierRouter,
  settings: settingsRouter,
  user: userRouter,
  upgrade: upgradeRouter,
  withdrawal: withdrawalRouter,
  referral: referralRouter,
  dashboard: dashboardRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
