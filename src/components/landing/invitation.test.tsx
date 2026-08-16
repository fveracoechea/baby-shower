// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { Invitation } from "#/components/landing/invitation";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
}));

describe("Invitation", () => {
	it("shows the dress code and gift information before RSVP", () => {
		render(<Invitation />);

		expect(
			screen.getByText("Wear pink, blue, green, yellow, or white."),
		).toBeDefined();
		expect(
			screen.getByText(
				"Having you there to celebrate this special day with us is the greatest gift we could ask for. No present is expected, but if you would still like to help us welcome our little one, here is our registry.",
			),
		).toBeDefined();
		expect(
			screen.getByRole("link", { name: "Open our Babylist registry" }),
		).toHaveProperty("href", "https://my.babylist.com/nf-baby-registry");
		expect(
			screen.getByRole("link", { name: "File your RSVP" }).getAttribute("href"),
		).toBe("/rsvp");
	});
});
