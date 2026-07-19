import { createRouter, authedQuery, adminQuery } from "../middleware.js";
import { getDashboardStats } from "../queries/users-ext.js";
import { getUpgradeStats } from "../queries/upgrades.js";
import { getWithdrawalStats } from "../queries/withdrawals.js";
import { getMiningStats } from "../queries/mining.js";
import { sql } from "drizzle-orm";
import { referralEarnings } from "../../db/schema.js";
import { getDb } from "../queries/connection.js";

export const dashboardRouter = createRouter({
  overview: adminQuery.query(async () => {
    const userStats = await getDashboardStats();
    const upgradeStats = await getUpgradeStats();
    const withdrawalStats = await getWithdrawalStats();
    const miningStats = await getMiningStats();

    const refResult = await getDb()
      .select({
        totalPayouts: sql<string>`coalesce(sum(${referralEarnings.amount}), 0)`,
        totalCount: sql<number>`count(*)`,
      })
      .from(referralEarnings);

    return {
      users: userStats,
      upgrades: upgradeStats,
      withdrawals: withdrawalStats,
      mining: miningStats,
      referrals: {
        totalReferralPayouts: refResult[0].totalPayouts,
        totalReferralCount: refResult[0].totalCount,
      },
    };
  }),

  mine: authedQuery.mutation(async ({ ctx }) => {
    const user = ctx.user;
    if (!user.currentTierId) {
      throw new Error("No active tier. Please upgrade first.");
    }

    const { getTierById } = await import("../queries/tiers.js");
    const tier = await getTierById(user.currentTierId);
    if (!tier) {
      throw new Error("Tier not found");
    }

    // Check daily mine limit
    if (user.minesToday >= tier.minesPerDay) {
      throw new Error("Daily mining limit reached for your tier.");
    }

    const { createMiningRecord } = await import("../queries/mining.js");
    const { updateUser } = await import("../queries/users-ext.js");

    await createMiningRecord({
      userId: user.id,
      tierId: tier.id,
      amount: tier.earnPerDay,
    });

    const newBalance = (parseFloat(user.balance as unknown as string) + parseFloat(tier.earnPerDay as unknown as string)).toFixed(8);
    const newTotalMined = (parseFloat(user.totalMined as unknown as string) + parseFloat(tier.earnPerDay as unknown as string)).toFixed(8);

    await updateUser(user.id, {
      balance: newBalance,
      totalMined: newTotalMined,
      minesToday: (user.minesToday || 0) + 1,
      lastMineAt: new Date(),
    });

    return { success: true, amount: tier.earnPerDay, newBalance };
  }),

  resetDailyMines: authedQuery.mutation(async ({ ctx }) => {
    const { updateUser } = await import("../queries/users-ext.js");
    await updateUser(ctx.user.id, { minesToday: 0 });
    return { success: true };
  }),
});
