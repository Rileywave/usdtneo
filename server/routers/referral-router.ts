import { createRouter, authedQuery, adminQuery } from "../middleware.js";
import { getReferralEarnings, getReferralStats, getTopReferrairs, getAllReferralEarnings } from "../queries/referrals.js";

export const referralRouter = createRouter({
  myEarnings: authedQuery.query(async ({ ctx }) => {
    const earnings = await getReferralEarnings(ctx.user.id);
    const stats = await getReferralStats(ctx.user.id);
    return { earnings, stats };
  }),

  myStats: authedQuery.query(async ({ ctx }) => {
    return getReferralStats(ctx.user.id);
  }),

  // Admin routes
  topReferrers: adminQuery.query(async () => {
    return getTopReferrairs(20);
  }),

  allEarnings: adminQuery.query(async () => {
    return getAllReferralEarnings();
  }),
});
