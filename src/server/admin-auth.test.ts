import { afterEach, describe, expect, it } from "vitest";

import { adminPasswordMatches } from "#/server/admin-auth.server";

const originalPassword = process.env.ADMIN_PASSWORD;

afterEach(() => {
	if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
	else process.env.ADMIN_PASSWORD = originalPassword;
});

describe("Admin authentication", () => {
	it("accepts only the configured password", () => {
		process.env.ADMIN_PASSWORD = "configured-test-password";

		expect(adminPasswordMatches("configured-test-password")).toBe(true);
		expect(adminPasswordMatches("wrong-password")).toBe(false);
	});
});
