import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
	id: integer({ mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	title: text().notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
});

export const rsvps = sqliteTable("rsvps", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	// display form, as typed by the guest
	name: text().notNull(),
	// identity key: trim + collapse whitespace + case-fold (accents significant)
	nameKey: text("name_key").notNull().unique(),
	attending: integer("attending", { mode: "boolean" }).notNull(),
	// total party size including the guest (1 = just the guest, 2..4 = +1..+3)
	partySize: integer("party_size").notNull().default(1),
	// the guest's optional guess: 'girl' | 'boy' | null
	theory: text({ enum: ["girl", "boy"] }),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});
