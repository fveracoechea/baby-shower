// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { StoryReel } from "#/components/landing/story-reel";

afterEach(cleanup);

describe("Case story", () => {
	it("presents the Mystery in three scenes", () => {
		render(<StoryReel onComplete={vi.fn()} />);

		expect(screen.getAllByRole("button", { name: /^Scene/ })).toHaveLength(3);
	});

	it("uses the ultrasound evidence in scene 03", async () => {
		render(<StoryReel onComplete={vi.fn()} />);

		fireEvent.click(screen.getByRole("button", { name: /^Scene 3:/ }));

		await waitFor(() =>
			expect(screen.getByAltText(/Baby ultrasound/)).toBeDefined(),
		);
	});
});
