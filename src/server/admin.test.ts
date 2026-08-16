import { describe, expect, it } from "vitest";

import {
	addInvitationInputSchema,
	editInvitationInputSchema,
} from "#/server/admin";

describe("admin server functions", () => {
	it("normalizes a US phone number before creating an Invitation", () => {
		expect(
			addInvitationInputSchema.parse({
				name: "Ada Lovelace",
				phoneNumber: "(404) 555-0123",
				additionalGuestAllowance: 2,
			}),
		).toMatchObject({ phoneNumber: "+14045550123" });
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
});
