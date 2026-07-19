import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "../middleware.js";
import { createWithdrawal, getUserWithdrawals, getAllWithdrawals, approveWithdrawal, markWithdrawalPaid, rejectWithdrawal, getWithdrawalStats } from "../queries/withdrawals.js";
import { createAdminLog } from "../queries/admin-logs.js";

export const withdrawalRouter = createRouter({
  create: authedQuery
    .input(z.object({
      amount: z.string(),
      address: z.string().min(10),
      network: z.string().default("TRC20"),
    }))
    .mutation(async ({ ctx, input }) => {
      const balance = parseFloat(ctx.user.balance as unknown as string);
      const amount = parseFloat(input.amount);
      if (amount > balance) {
        throw new Error("Insufficient balance");
      }

      await createWithdrawal({
        userId: ctx.user.id,
        ...input,
      });

      return { success: true };
    }),

  myWithdrawals: authedQuery.query(async ({ ctx }) => {
    return getUserWithdrawals(ctx.user.id);
  }),

  // Admin routes
  list: adminQuery
    .input(z.object({
      status: z.enum(["pending", "approved", "paid", "rejected"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      return getAllWithdrawals(input || {});
    }),

  approve: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await approveWithdrawal(input.id, ctx.user.id);

      await createAdminLog({
        adminId: ctx.user.id,
        action: "approve_withdrawal",
        targetType: "withdrawal",
        targetId: input.id,
        details: `Approved withdrawal request #${input.id}`,
      });

      return { success: true };
    }),

  markPaid: adminQuery
    .input(z.object({
      id: z.number(),
      txHash: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await markWithdrawalPaid(input.id, ctx.user.id, input.txHash);

      await createAdminLog({
        adminId: ctx.user.id,
        action: "mark_withdrawal_paid",
        targetType: "withdrawal",
        targetId: input.id,
        details: `Marked withdrawal #${input.id} as paid. TX: ${input.txHash || "N/A"}`,
      });

      return { success: true };
    }),

  reject: adminQuery
    .input(z.object({
      id: z.number(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await rejectWithdrawal(input.id, ctx.user.id, input.reason);

      await createAdminLog({
        adminId: ctx.user.id,
        action: "reject_withdrawal",
        targetType: "withdrawal",
        targetId: input.id,
        details: `Rejected withdrawal #${input.id}. Reason: ${input.reason || "N/A"}`,
      });

      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    return getWithdrawalStats();
  }),
});
