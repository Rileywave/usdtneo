import { eq } from "drizzle-orm";
import { settings } from "../../db/schema.js";
import { getDb } from "./connection.js";

export async function getAllSettings() {
  const rows = await getDb().select().from(settings);
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export async function getSetting(key: string) {
  const rows = await getDb().select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows.at(0)?.value;
}

export async function updateSetting(key: string, value: string) {
  const db = getDb();
  const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  if (existing.length === 0) {
    await db.insert(settings).values({ key, value });
  } else {
    await db.update(settings).set({ value, updatedAt: new Date() }).where(eq(settings.key, key));
  }
}

export async function updateSettingsBatch(updates: Record<string, string>) {
  for (const [key, value] of Object.entries(updates)) await updateSetting(key, value);
}
