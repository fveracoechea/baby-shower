import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
	id: integer({ mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	title: text().notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
});

export const invitations = sqliteTable(
	"invitations",
	{
		id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		guestName: text("guest_name").notNull(),
		phoneNumber: text("phone_number").notNull().unique(),
		additionalGuestAllowance: integer("additional_guest_allowance").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [
		check(
			"invitations_additional_guest_allowance_range",
			sql`${table.additionalGuestAllowance} between 0 and 3`,
		),
	],
);

export const rsvps = sqliteTable(
	"rsvps",
	{
		id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
		invitationId: integer("invitation_id")
			.notNull()
			.references(() => invitations.id)
			.unique(),
		attending: integer("attending", { mode: "boolean" }).notNull(),
		additionalGuestCount: integer("additional_guest_count")
			.notNull()
			.default(0),
		theory: text({ enum: ["girl", "boy"] }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [
		check(
			"rsvps_additional_guest_count_range",
			sql`${table.additionalGuestCount} between 0 and 3`,
		),
	],
);
