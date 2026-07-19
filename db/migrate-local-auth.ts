
import { getDb } from "../server/queries/connection.js";
import { sql } from "drizzle-orm";

async function migrate() {
  const db = getDb();

  try {
    await db.execute(sql`ALTER TABLE users MODIFY COLUMN unionId VARCHAR(255) NULL`);
    console.log("Made unionId nullable");
  } catch (e) { console.log("unionId:", (e as Error).message); }

  try {
    await db.execute(sql`ALTER TABLE users ADD COLUMN username VARCHAR(100) UNIQUE`);
    console.log("Added username");
  } catch (e) { console.log("username:", (e as Error).message); }

  try {
    await db.execute(sql`ALTER TABLE users ADD COLUMN password VARCHAR(255)`);
    console.log("Added password");
  } catch (e) { console.log("password:", (e as Error).message); }

  console.log("Done!");
}

migrate().catch(console.error);
