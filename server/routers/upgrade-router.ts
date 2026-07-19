import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "../middleware.js";
import { createUpgradeRequest, getUserUpgrades, getAllUpgrades, approveUpgrade, rejectUpgrade, getUpgradeById, getUpgradeStats } from "../queries/upgrades.js";
import { setUserTier } from "../queries/users-ext.js";
import { createAdminLog } from "../queries/admin-logs.js";

export const upgradeRouter = createRouter({
  create: authedQuery
    .input(z.object({
      tierId: z.number(),
      amountUsd: z.string(),
      amountLocal: z.string(),
      currency: z.enum(["NGN", "USDT"]),
      paymentMethod: z.enum(["bank_transfer", "usdt"]),
      proofImage: z.string().optional(),
      txHash: z.string().optional(),
      payerName: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await createUpgradeRequest({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  myUpgrades: authedQuery.query(async ({ ctx }) => {
    return getUserUpgrades(ctx.user.id);
  }),

  // Admin routes
  list: adminQuery
    .input(z.object({
      status: z.enum(["pending", "approved", "rejected"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      return getAllUpgrades(input || {});
    }),

  approve: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const upgrade = await getUpgradeById(input.id);
      if (!upgrade) throw new Error("Upgrade request not found");

      await approveUpgrade(input.id, ctx.user.id);
      await setUserTier(upgrade.userId, upgrade.tierId);

      await createAdminLog({
        adminId: ctx.user.id,
        action: "approve_upgrade",
        targetType: "upgrade",
        targetId: input.id,
        details: `Approved upgrade request #${input.id} for user ${upgrade.userId}`,
      });

      return { success: true };
    }),

  reject: adminQuery
    .input(z.object({
      id: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await rejectUpgrade(input.id, ctx.user.id, input.reason);

      await createAdminLog({
        adminId: ctx.user.id,
        action: "reject_upgrade",
        targetType: "upgrade",
        targetId: input.id,
        details: `Rejected upgrade request #${input.id}. Reason: ${input.reason || "N/A"}`,
      });

      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    return getUpgradeStats();
  }),
});
