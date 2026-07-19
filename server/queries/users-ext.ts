import { eq, like, desc, sql } from "drizzle-orm";
import { users, tiers } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function getUserById(id: number) {
  const rows = await getDb().select().from(users).where(eq(users.id, id)).limit(1);
  return rows.at(0);
}

export async function getUserWithTier(id: number) {
  const rows = await getDb()
    .select({
      id: users.id, name: users.name, email: users.email, avatar: users.avatar,
      role: users.role, status: users.status, balance: users.balance,
      totalMined: users.totalMined, totalWithdrawn: users.totalWithdrawn,
      referralCode: users.referralCode, referredBy: users.referredBy,
      currentTierId: users.currentTierId, currentTierName: tiers.name,
      minesToday: users.minesToday, lastMineAt: users.lastMineAt,
      createdAt: users.createdAt, username: users.username, password: users.password,
    })
    .from(users).leftJoin(tiers, eq(users.currentTierId, tiers.id))
    .where(eq(users.id, id)).limit(1);
  return rows.at(0);
}

export async function getAllUsers(search?: string) {
  let query = getDb()
    .select({
      id: users.id, name: users.name, email: users.email, avatar: users.avatar,
      role: users.role, status: users.status, balance: users.balance,
      currentTierId: users.currentTierId, currentTierName: tiers.name,
      referralCode: users.referralCode, referredBy: users.referredBy,
      createdAt: users.createdAt,
    })
    .from(users).leftJoin(tiers, eq(users.currentTierId, tiers.id))
    .orderBy(desc(users.createdAt));
  if (search) return query.where(like(users.email, `%${search}%`));
  return query;
}

export async function updateUser(id: number, data: Record<string, unknown>) {
  await getDb().update(users).set(data).where(eq(users.id, id));
}

export async function suspendUser(id: number) {
  await getDb().update(users).set({ status: "suspended" }).where(eq(users.id, id));
}

export async function activateUser(id: number) {
  await getDb().update(users).set({ status: "active" }).where(eq(users.id, id));
}

export async function updateUserBalance(id: number, amount: string) {
  await getDb().update(users).set({ balance: sql`${users.balance} + ${amount}` }).where(eq(users.id, id));
}

export async function getDashboardStats() {
  const result = await getDb()
    .select({
      totalUsers: sql<number>`count(*)`,
      activeUsers: sql<number>`sum(case when ${users.status} = 'active' then 1 else 0 end)`,
      suspendedUsers: sql<number>`sum(case when ${users.status} = 'suspended' then 1 else 0 end)`,
      totalBalance: sql<string>`coalesce(sum(${users.balance}), 0)`,
      totalMined: sql<string>`coalesce(sum(${users.totalMined}), 0)`,
      totalWithdrawn: sql<string>`coalesce(sum(${users.totalWithdrawn}), 0)`,
    })
    .from(users);
  return result[0];
}

export async function getReferrerByCode(code: string) {
  const rows = await getDb().select().from(users).where(eq(users.referralCode, code)).limit(1);
  return rows.at(0);
}

export async function setUserTier(userId: number, tierId: number) {
  await getDb().update(users).set({ currentTierId: tierId }).where(eq(users.id, userId));
}

export async function createLocalUser(data: { name: string; username: string; email: string; password: string; referralCode: string; referredBy?: number }) {
  const result = await getDb().insert(users).values({
    name: data.name, username: data.username, email: data.email,
    password: data.password, referralCode: data.referralCode,
    referredBy: data.referredBy, role: "user", status: "active",
    balance: "0", totalMined: "0", totalWithdrawn: "0",
    minesToday: 0, createdAt: new Date(), updatedAt: new Date(),
    lastSignInAt: new Date(),
  }).returning({ id: users.id });
  return result[0].id;
}

export async function findUserByEmailOrUsername(emailOrUsername: string) {
  let rows = await getDb().select().from(users).where(eq(users.email, emailOrUsername)).limit(1);
  if (rows.length === 0) {
    rows = await getDb().select().from(users).where(eq(users.username, emailOrUsername)).limit(1);
  }
  return rows.at(0);
}
