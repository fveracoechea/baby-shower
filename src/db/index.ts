import { config } from "dotenv";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import * as schema from "./schema.ts";

config({ path: [".env.local", ".env"] });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

export const db = drizzle(databaseUrl, { schema });

migrate(db, { migrationsFolder: process.env.MIGRATIONS_DIR ?? "./drizzle" });
