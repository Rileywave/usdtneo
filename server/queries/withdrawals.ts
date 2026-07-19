import { eq, desc, and, sql } from "drizzle-orm";
import { withdrawals, users } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function createWithdrawal(data: typeof withdrawals.$inferInsert) {
  await getDb().insert(withdrawals).values(data);
}

export async function getUserWithdrawals(userId: number) {
  return getDb().select().from(withdrawals).where(eq(withdrawals.userId, userId)).orderBy(desc(withdrawals.createdAt));
}

export async function getAllWithdrawals(filters?: { status?: string; userId?: number }) {
  let query = getDb()
    .select({ id: withdrawals.id, userId: withdrawals.userId, userName: users.name, userEmail: users.email, amount: withdrawals.amount, address: withdrawals.address, network: withdrawals.network, status: withdrawals.status, createdAt: withdrawals.createdAt, reviewedAt: withdrawals.reviewedAt, paidAt: withdrawals.paidAt, paidTxHash: withdrawals.paidTxHash, rejectionReason: withdrawals.rejectionReason })
    .from(withdrawals).leftJoin(users, eq(withdrawals.userId, users.id))
    .orderBy(desc(withdrawals.createdAt));
  const conditions = [];
  if (filters?.status) conditions.push(eq(withdrawals.status, filters.status as "pending" | "approved" | "paid" | "rejected"));
  if (filters?.userId) conditions.push(eq(withdrawals.userId, filters.userId));
  if (conditions.length > 0) return query.where(and(...conditions));
  return query;
}

export async function approveWithdrawal(id: number, adminId: number) {
  await getDb().update(withdrawals).set({ status: "approved", reviewedBy: adminId, reviewedAt: new Date() }).where(eq(withdrawals.id, id));
}

export async function markWithdrawalPaid(id: number, adminId: number, txHash?: string) {
  await getDb().update(withdrawals).set({ status: "paid", paidBy: adminId, paidAt: new Date(), paidTxHash: txHash || null }).where(eq(withdrawals.id, id));
}

export async function rejectWithdrawal(id: number, adminId: number, reason?: string) {
  await getDb().update(withdrawals).set({ status: "rejected", reviewedBy: adminId, reviewedAt: new Date(), rejectionReason: reason || null }).where(eq(withdrawals.id, id));
}

export async function getWithdrawalStats() {
  const result = await getDb()
    .select({ total: sql<number>`count(*)`, pending: sql<number>`sum(case when ${withdrawals.status} = 'pending' then 1 else 0 end)`, approved: sql<number>`sum(case when ${withdrawals.status} = 'approved' then 1 else 0 end)`, paid: sql<number>`sum(case when ${withdrawals.status} = 'paid' then 1 else 0 end)`, rejected: sql<number>`sum(case when ${withdrawals.status} = 'rejected' then 1 else 0 end)`, totalPaid: sql<string>`sum(case when ${withdrawals.status} = 'paid' then ${withdrawals.amount} else 0 end)` })
    .from(withdrawals);
  return result[0];
}
