import { eq } from "drizzle-orm";
import { users } from "../../db/schema.js";
import { getDb } from "./connection.js";
import type { User } from "../../db/schema.js";

export async function findUserByUnionId(unionId: string): Promise<User | undefined> {
  const rows = await getDb().select().from(users).where(eq(users.unionId, unionId)).limit(1);
  return rows.at(0);
}

export async function upsertUser(data: Partial<User>) {
  const db = getDb();
  const existing = await db.select().from(users).where(eq(users.unionId, data.unionId!)).limit(1);
  if (existing.length === 0) {
    const result = await db.insert(users).values(data as User).returning();
    return result[0].id;
  } else {
    await db.update(users).set(data).where(eq(users.id, existing[0].id));
    return existing[0].id;
  }
}

export async function createUser(data: Partial<User>): Promise<number> {
  const result = await getDb().insert(users).values(data as User).returning({ id: users.id });
  return result[0].id;
}

export async function updateUserByUnionId(unionId: string, data: Partial<User>) {
  await getDb().update(users).set(data).where(eq(users.unionId, unionId));
}
