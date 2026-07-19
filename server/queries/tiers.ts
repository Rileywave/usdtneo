import { eq, asc } from "drizzle-orm";
import { tiers } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function getActiveTiers() {
  return getDb().select().from(tiers).where(eq(tiers.isActive, true)).orderBy(asc(tiers.level));
}

export async function getTierById(id: number) {
  const rows = await getDb().select().from(tiers).where(eq(tiers.id, id)).limit(1);
  return rows.at(0);
}

export async function getTierByLevel(level: number) {
  const rows = await getDb().select().from(tiers).where(eq(tiers.level, level)).limit(1);
  return rows.at(0);
}

export async function updateTier(id: number, data: Record<string, unknown>) {
  await getDb().update(tiers).set(data).where(eq(tiers.id, id));
}
