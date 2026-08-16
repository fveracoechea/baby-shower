import { describe, expect, it } from "vitest";

import { normalizePhoneNumber } from "#/lib/phone";

describe("normalizePhoneNumber", () => {
	it("normalizes equivalent US number formats to E.164", () => {
		expect(normalizePhoneNumber("(404) 555-0123")).toBe("+14045550123");
		expect(normalizePhoneNumber("1 404.555.0123")).toBe("+14045550123");
	});

	it("normalizes international phone numbers without rejecting them", () => {
		expect(normalizePhoneNumber("+52 55 1234 5678")).toBe("+525512345678");
	});
});
