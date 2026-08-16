import { describe, expect, it } from "vitest";

import { normalizeUsPhoneNumber } from "#/lib/phone";

describe("normalizeUsPhoneNumber", () => {
	it("normalizes equivalent US number formats to E.164", () => {
		expect(normalizeUsPhoneNumber("(404) 555-0123")).toBe("+14045550123");
		expect(normalizeUsPhoneNumber("1 404.555.0123")).toBe("+14045550123");
	});

	it("rejects a non-US phone number", () => {
		expect(normalizeUsPhoneNumber("+52 55 1234 5678")).toBeNull();
	});
});
