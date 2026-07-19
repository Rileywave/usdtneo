import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware.js";
import { getAllSettings, updateSettingsBatch } from "../queries/settings.js";

export const settingsRouter = createRouter({
  getAll: publicQuery.query(async () => {
    return getAllSettings();
  }),

  update: adminQuery
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      await updateSettingsBatch(input);
      return { success: true };
    }),
});
