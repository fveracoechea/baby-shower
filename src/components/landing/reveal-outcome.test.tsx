// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { RevealOutcome } from "#/components/landing/reveal-outcome";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
}));

describe("Reveal outcome", () => {
	it("shows only the declined message and edit action when the Guest cannot attend", () => {
		render(
			<RevealOutcome attending={false} canEdit guestName="Maria Garcia" />,
		);

		expect(screen.getByText("We will miss you, Maria Garcia")).toBeDefined();
		expect(screen.queryByText("Thank you, detective")).toBeNull();
		expect(screen.queryByTitle("Open in Google Maps")).toBeNull();
		expect(
			screen.getByRole("link", { name: "Change my RSVP" }).getAttribute("href"),
		).toBe("/rsvp");
	});
});
