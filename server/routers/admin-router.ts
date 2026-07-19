import { z } from "zod";
import { createRouter, adminQuery } from "../middleware.js";
import { getAdminLogs, createAdminLog } from "../queries/admin-logs.js";

export const adminRouter = createRouter({
  logs: adminQuery.query(async () => {
    return getAdminLogs();
  }),

  createLog: adminQuery
    .input(z.object({
      action: z.string(),
      targetType: z.string(),
      targetId: z.number().optional(),
      details: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await createAdminLog({
        adminId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),
});
