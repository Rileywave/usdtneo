import { eq } from "drizzle-orm";
import { walletBindings } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function getUserWallet(userId: number) {
  const rows = await getDb().select().from(walletBindings).where(eq(walletBindings.userId, userId)).limit(1);
  return rows.at(0);
}

export async function createOrUpdateWallet(userId: number, address: string, network: string = "TRC20") {
  const existing = await getUserWallet(userId);
  if (existing) {
    await getDb().update(walletBindings).set({ address, network }).where(eq(walletBindings.id, existing.id));
    return { ...existing, address, network };
  }
  const result = await getDb().insert(walletBindings).values({ userId, address, network, isDefault: true }).returning();
  return result[0];
}
