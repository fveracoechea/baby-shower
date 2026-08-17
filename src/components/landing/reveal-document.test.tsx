// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { RevealDocument } from "#/components/landing/reveal-document";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
}));

describe("Guest Reveal", () => {
	it("shows the map and registry in the post-RSVP Reveal document", () => {
		render(<RevealDocument canEdit guestName="Maria Garcia" />);

		const map = screen.getByTitle("Open in Google Maps");
		const footerCopy = screen.getByText(
			"The mystery stays sealed until October 10. Then our family and friends will follow the clues, test their theories, and solve the case together.",
		);
		expect(map.getAttribute("src")).toContain("google.com/maps");
		expect(
			screen.getByRole("heading", { name: "Thank you, Maria Garcia" }),
		).toBeDefined();
		expect(map.classList.contains("grayscale-[70%]")).toBe(true);
		expect(map.classList.contains("lg:h-96")).toBe(true);
		expect(footerCopy.closest("footer")).not.toBeNull();
		expect(
			map.compareDocumentPosition(footerCopy) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(map.closest('[data-slot="card"]')).toBeNull();
		expect(
			screen
				.getByAltText("Provisions Boutique, the venue, seen from the street")
				.closest('[data-slot="card"]'),
		).toBeNull();
		expect(
			screen.getByText(
				"Casual. White clothing is preferred, with optional blue or pink accessories based on your theory.",
			),
		).toBeDefined();
		expect(
			screen.getByRole("link", { name: "Open in Google Maps" }),
		).toHaveProperty("href", "https://maps.app.goo.gl/C36KF6Vh7rPCbdss6");
		expect(
			screen.getByRole("link", { name: "Open our Babylist registry" }),
		).toHaveProperty("href", "https://my.babylist.com/nf-baby-registry");
		expect(
			screen
				.getByText("Date")
				.compareDocumentPosition(screen.getByText("Dress code")) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			screen
				.getByText("Dress code")
				.compareDocumentPosition(screen.getByText("Gifts")) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(
			screen
				.getByRole("link", { name: "Back to invitation" })
				.compareDocumentPosition(screen.getByText("Case unlocked")) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
		expect(screen.getByRole("link", { name: "Change my RSVP" })).toBeDefined();
	});
});
