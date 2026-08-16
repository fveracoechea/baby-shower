// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RevealDocument } from "#/components/landing/reveal-document";

describe("Guest Reveal", () => {
	it("shows the no-key Google map only in the post-RSVP Reveal document", () => {
		render(<RevealDocument />);

		const map = screen.getByTitle("Open in Google Maps");
		expect(map.getAttribute("src")).toContain("google.com/maps");
		expect(
			screen
				.getByText("Registry link coming soon")
				.getAttribute("aria-disabled"),
		).toBe("true");
	});
});
