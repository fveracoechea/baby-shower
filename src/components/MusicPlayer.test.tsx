// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MusicPlayer } from "#/components/MusicPlayer";

const pathname = vi.hoisted(() => ({ value: "/" }));

vi.mock("@tanstack/react-router", () => ({
	useLocation: ({
		select,
	}: {
		select: (value: { pathname: string }) => string;
	}) => select({ pathname: pathname.value }),
}));

describe("Music player", () => {
	beforeEach(() => {
		pathname.value = "/";
		vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
		vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
	});

	afterEach(() => {
		cleanup();
		vi.restoreAllMocks();
	});

	it("starts by default and lets the Guest pause the soundtrack", async () => {
		render(<MusicPlayer />);

		expect((screen.getByRole("slider") as HTMLInputElement).value).toBe("0.8");
		await waitFor(() =>
			expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce(),
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Pause mystery soundtrack" }),
		);
		expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledOnce();
	});

	it("does not appear in the Admin view", () => {
		pathname.value = "/admin";

		render(<MusicPlayer />);

		expect(screen.queryByText("Case soundtrack")).toBeNull();
	});
});
