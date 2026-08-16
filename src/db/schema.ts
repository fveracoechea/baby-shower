import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
			.references(() => invitations.id, { onDelete: "cascade" })
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
		check("rsvps_attending_boolean", sql`${table.attending} in (0, 1)`),
		check(
			"rsvps_additional_guest_count_range",
			sql`${table.additionalGuestCount} between 0 and 3`,
		),
		check(
			"rsvps_declined_without_additional_guests",
			sql`${table.attending} = 1 or ${table.additionalGuestCount} = 0`,
		),
		check(
			"rsvps_theory_values",
			sql`${table.theory} is null or ${table.theory} in ('girl', 'boy')`,
		),
	],
);
