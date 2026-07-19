import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware.js";
import { getActiveTiers, getTierById, updateTier } from "../queries/tiers.js";

export const tierRouter = createRouter({
  list: publicQuery.query(async () => {
    return getActiveTiers();
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getTierById(input.id);
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      period: z.number().optional(),
      earnPerDay: z.string().optional(),
      priceUsd: z.string().optional(),
      priceNgn: z.string().optional(),
      priceGhs: z.string().optional(),
      minesPerDay: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateTier(id, data);
      return { success: true };
    }),
});
