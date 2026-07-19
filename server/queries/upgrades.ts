import { eq, desc, and, sql } from "drizzle-orm";
import { upgradeRequests, tiers, users } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function createUpgradeRequest(data: typeof upgradeRequests.$inferInsert) {
  await getDb().insert(upgradeRequests).values(data);
}

export async function getUserUpgrades(userId: number) {
  return getDb()
    .select({ id: upgradeRequests.id, tierId: upgradeRequests.tierId, tierName: tiers.name, amountUsd: upgradeRequests.amountUsd, amountLocal: upgradeRequests.amountLocal, currency: upgradeRequests.currency, paymentMethod: upgradeRequests.paymentMethod, status: upgradeRequests.status, createdAt: upgradeRequests.createdAt, reviewedAt: upgradeRequests.reviewedAt, rejectionReason: upgradeRequests.rejectionReason })
    .from(upgradeRequests).leftJoin(tiers, eq(upgradeRequests.tierId, tiers.id))
    .where(eq(upgradeRequests.userId, userId)).orderBy(desc(upgradeRequests.createdAt));
}

export async function getAllUpgrades(filters?: { status?: string; userId?: number }) {
  let query = getDb()
    .select({ id: upgradeRequests.id, userId: upgradeRequests.userId, userName: users.name, userEmail: users.email, tierId: upgradeRequests.tierId, tierName: tiers.name, amountUsd: upgradeRequests.amountUsd, amountLocal: upgradeRequests.amountLocal, currency: upgradeRequests.currency, paymentMethod: upgradeRequests.paymentMethod, status: upgradeRequests.status, proofImage: upgradeRequests.proofImage, txHash: upgradeRequests.txHash, payerName: upgradeRequests.payerName, createdAt: upgradeRequests.createdAt, reviewedAt: upgradeRequests.reviewedAt, rejectionReason: upgradeRequests.rejectionReason })
    .from(upgradeRequests).leftJoin(tiers, eq(upgradeRequests.tierId, tiers.id)).leftJoin(users, eq(upgradeRequests.userId, users.id))
    .orderBy(desc(upgradeRequests.createdAt));
  const conditions = [];
  if (filters?.status) conditions.push(eq(upgradeRequests.status, filters.status as "pending" | "approved" | "rejected"));
  if (filters?.userId) conditions.push(eq(upgradeRequests.userId, filters.userId));
  if (conditions.length > 0) return query.where(and(...conditions));
  return query;
}

export async function getUpgradeById(id: number) {
  const rows = await getDb().select().from(upgradeRequests).where(eq(upgradeRequests.id, id)).limit(1);
  return rows.at(0);
}

export async function approveUpgrade(id: number, adminId: number) {
  await getDb().update(upgradeRequests).set({ status: "approved", reviewedBy: adminId, reviewedAt: new Date() }).where(eq(upgradeRequests.id, id));
}

export async function rejectUpgrade(id: number, adminId: number, reason?: string) {
  await getDb().update(upgradeRequests).set({ status: "rejected", reviewedBy: adminId, reviewedAt: new Date(), rejectionReason: reason || null }).where(eq(upgradeRequests.id, id));
}

export async function getUpgradeStats() {
  const result = await getDb()
    .select({ total: sql<number>`count(*)`, pending: sql<number>`sum(case when ${upgradeRequests.status} = 'pending' then 1 else 0 end)`, approved: sql<number>`sum(case when ${upgradeRequests.status} = 'approved' then 1 else 0 end)`, rejected: sql<number>`sum(case when ${upgradeRequests.status} = 'rejected' then 1 else 0 end)`, totalRevenue: sql<string>`sum(case when ${upgradeRequests.status} = 'approved' then ${upgradeRequests.amountUsd} else 0 end)` })
    .from(upgradeRequests);
  return result[0];
}
