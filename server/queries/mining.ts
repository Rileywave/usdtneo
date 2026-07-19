import { eq, desc, sql } from "drizzle-orm";
import { miningHistory, tiers } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function createMiningRecord(data: typeof miningHistory.$inferInsert) {
  await getDb().insert(miningHistory).values(data);
}

export async function getUserMiningHistory(userId: number) {
  return getDb()
    .select({ id: miningHistory.id, tierName: tiers.name, amount: miningHistory.amount, createdAt: miningHistory.createdAt })
    .from(miningHistory).leftJoin(tiers, eq(miningHistory.tierId, tiers.id))
    .where(eq(miningHistory.userId, userId)).orderBy(desc(miningHistory.createdAt));
}

export async function getMiningStats() {
  const result = await getDb()
    .select({ totalMined: sql<string>`coalesce(sum(${miningHistory.amount}), 0)`, totalSessions: sql<number>`count(*)` })
    .from(miningHistory);
  return result[0];
}
