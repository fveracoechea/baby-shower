// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RevealDocument } from "#/components/landing/reveal-document";

describe("Guest Reveal", () => {
	it("shows the map and registry in the post-RSVP Reveal document", () => {
		render(<RevealDocument />);

		const map = screen.getByTitle("Open in Google Maps");
		expect(map.getAttribute("src")).toContain("google.com/maps");
		expect(
			screen.getByRole("link", { name: "Open our Babylist registry" }),
		).toHaveProperty("href", "https://my.babylist.com/nf-baby-registry");
	});
});
