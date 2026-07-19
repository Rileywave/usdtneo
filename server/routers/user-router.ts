import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "../middleware.js";
import { getUserWithTier, updateUser, getAllUsers, suspendUser, activateUser, getReferrerByCode } from "../queries/users-ext.js";

export const userRouter = createRouter({
  me: authedQuery.query(async ({ ctx }) => {
    return getUserWithTier(ctx.user.id);
  }),

  updateProfile: authedQuery
    .input(z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      referralCode: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: Record<string, unknown> = {};
      if (input.name) updates.name = input.name;
      if (input.email) updates.email = input.email;

      if (input.referralCode) {
        const referrer = await getReferrerByCode(input.referralCode);
        if (referrer && referrer.id !== ctx.user.id) {
          updates.referredBy = referrer.id;
        }
      }

      await updateUser(ctx.user.id, updates);
      return { success: true };
    }),

  bindWallet: authedQuery
    .input(z.object({
      address: z.string().min(10),
      network: z.string().default("TRC20"),
    }))
    .mutation(async ({ ctx, input }) => {
      const { createOrUpdateWallet } = await import("../queries/wallets.js");
      await createOrUpdateWallet(ctx.user.id, input.address, input.network);
      return { success: true };
    }),

  getWallet: authedQuery.query(async ({ ctx }) => {
    const { getUserWallet } = await import("../queries/wallets.js");
    return getUserWallet(ctx.user.id);
  }),

  // Admin routes
  list: adminQuery
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return getAllUsers(input?.search);
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum(["user", "admin"]).optional(),
      status: z.enum(["active", "suspended"]).optional(),
      balance: z.string().optional(),
      currentTierId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateUser(id, data);
      return { success: true };
    }),

  suspend: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await suspendUser(input.id);
      return { success: true };
    }),

  activate: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await activateUser(input.id);
      return { success: true };
    }),
});
