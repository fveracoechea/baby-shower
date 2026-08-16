// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { GuestNavigation } from "#/components/GuestNavigation";

vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		search,
		to,
		...props
	}: {
		children: ReactNode;
		search?: { view?: string };
		to: string;
	} & Omit<ComponentProps<"a">, "href">) => (
		<a href={`${to}${search?.view ? `?view=${search.view}` : ""}`} {...props}>
			{children}
		</a>
	),
}));

describe("Guest navigation", () => {
	it("uses links for Case, Invitation, and RSVP", () => {
		render(<GuestNavigation active="case" />);

		expect(
			screen.getByRole("link", { name: "Case" }).getAttribute("href"),
		).toBe("/?view=case");
		expect(
			screen.getByRole("link", { name: "Invitation" }).getAttribute("href"),
		).toBe("/?view=invitation");
		expect(
			screen.getByRole("link", { name: "RSVP" }).getAttribute("href"),
		).toBe("/rsvp");
		expect(screen.getByRole("link", { name: "Case" }).dataset.active).toBe(
			"true",
		);
		expect(
			screen.getByRole("link", { name: "Case" }).getAttribute("aria-current"),
		).toBe("page");
		expect(
			screen.getByRole("link", { name: "Invitation" }).dataset.active,
		).toBe("false");
	});
});
