import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { describe, expect, it } from "vitest";

import * as schema from "#/db/schema";
import {
	addInvitationInputSchema,
	editInvitationInputSchema,
	editInvitationRecord,
} from "#/server/admin";

describe("admin server functions", () => {
	it("normalizes an international phone number before creating an Invitation", () => {
		expect(
			addInvitationInputSchema.parse({
				name: "Ada Lovelace",
				phoneNumber: "+52 55 1234 5678",
				additionalGuestAllowance: 2,
			}),
		).toMatchObject({ phoneNumber: "+525512345678" });
	});

	it("rejects an allowance outside zero through three", () => {
		expect(() =>
			editInvitationInputSchema.parse({
				id: 1,
				name: "Ada Lovelace",
				phoneNumber: "+14045550123",
				additionalGuestAllowance: 4,
			}),
		).toThrow();
	});

	it("edits an Invitation in the synchronous SQLite transaction", async () => {
		const sqlite = new Database(":memory:");
		const testDb = drizzle(sqlite, { schema });
		migrate(testDb, { migrationsFolder: "./drizzle" });
		const [invitation] = testDb
			.insert(schema.invitations)
			.values({
				guestName: "Ada Lovelace",
				phoneNumber: "+14045550123",
				additionalGuestAllowance: 1,
			})
			.returning()
			.all();

		await expect(
			editInvitationRecord(
				{
					id: invitation.id,
					name: "Ada Byron",
					phoneNumber: invitation.phoneNumber,
					additionalGuestAllowance: 2,
				},
				testDb,
			),
		).resolves.toMatchObject({
			guestName: "Ada Byron",
			additionalGuestAllowance: 2,
		});
		sqlite.close();
	});
});
