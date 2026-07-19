import { eq, desc } from "drizzle-orm";
import { adminLogs, users } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function createAdminLog(data: typeof adminLogs.$inferInsert) {
  await getDb().insert(adminLogs).values(data);
}

export async function getAdminLogs() {
  return getDb()
    .select({ id: adminLogs.id, adminName: users.name, action: adminLogs.action, targetType: adminLogs.targetType, targetId: adminLogs.targetId, details: adminLogs.details, createdAt: adminLogs.createdAt })
    .from(adminLogs).leftJoin(users, eq(adminLogs.adminId, users.id))
    .orderBy(desc(adminLogs.createdAt)).limit(200);
}
