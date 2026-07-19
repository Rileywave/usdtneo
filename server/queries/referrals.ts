import { eq, desc, sql } from "drizzle-orm";
import { referralEarnings, users } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function createReferralEarning(data: typeof referralEarnings.$inferInsert) {
  await getDb().insert(referralEarnings).values(data);
}

export async function getReferralEarnings(referrerId: number) {
  return getDb()
    .select({ id: referralEarnings.id, referredId: referralEarnings.referredId, referredName: users.name, amount: referralEarnings.amount, tier: referralEarnings.tier, source: referralEarnings.source, createdAt: referralEarnings.createdAt })
    .from(referralEarnings).leftJoin(users, eq(referralEarnings.referredId, users.id))
    .where(eq(referralEarnings.referrerId, referrerId)).orderBy(desc(referralEarnings.createdAt));
}

export async function getReferralStats(referrerId: number) {
  const result = await getDb()
    .select({ totalEarned: sql<string>`coalesce(sum(${referralEarnings.amount}), 0)`, totalReferrals: sql<number>`count(distinct ${referralEarnings.referredId})`, tier1Count: sql<number>`sum(case when ${referralEarnings.tier} = 1 then 1 else 0 end)`, tier2Count: sql<number>`sum(case when ${referralEarnings.tier} = 2 then 1 else 0 end)`, tier3Count: sql<number>`sum(case when ${referralEarnings.tier} = 3 then 1 else 0 end)`, tier1Amount: sql<string>`coalesce(sum(case when ${referralEarnings.tier} = 1 then ${referralEarnings.amount} else 0 end), 0)`, tier2Amount: sql<string>`coalesce(sum(case when ${referralEarnings.tier} = 2 then ${referralEarnings.amount} else 0 end), 0)`, tier3Amount: sql<string>`coalesce(sum(case when ${referralEarnings.tier} = 3 then ${referralEarnings.amount} else 0 end), 0)` })
    .from(referralEarnings).where(eq(referralEarnings.referrerId, referrerId));
  return result[0];
}

export async function getTopReferrairs(limit: number = 20) {
  return getDb()
    .select({ referrerId: referralEarnings.referrerId, userName: users.name, totalEarned: sql<string>`sum(${referralEarnings.amount})`, referralCount: sql<number>`count(distinct ${referralEarnings.referredId})` })
    .from(referralEarnings).leftJoin(users, eq(referralEarnings.referrerId, users.id))
    .groupBy(referralEarnings.referrerId).orderBy(desc(sql`sum(${referralEarnings.amount})`)).limit(limit);
}

export async function getAllReferralEarnings() {
  return getDb()
    .select({ id: referralEarnings.id, referrerId: referralEarnings.referrerId, referrerName: users.name, referredId: referralEarnings.referredId, amount: referralEarnings.amount, tier: referralEarnings.tier, source: referralEarnings.source, createdAt: referralEarnings.createdAt })
    .from(referralEarnings).leftJoin(users, eq(referralEarnings.referrerId, users.id))
    .orderBy(desc(referralEarnings.createdAt));
}
