// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { useRsvpFlow } from "#/components/landing/use-rsvp-flow";
import { RsvpForm } from "#/components/rsvp-form";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => navigate,
}));

vi.mock("#/components/landing/use-rsvp-flow", () => ({
	useRsvpFlow: vi.fn(),
}));

const mockedUseRsvpFlow = vi.mocked(useRsvpFlow);

function flow(overrides: Partial<ReturnType<typeof useRsvpFlow>> = {}) {
	return {
		phase: "idle" as const,
		rsvp: null,
		invitation: null,
		error: null,
		readOnly: false,
		clearError: vi.fn(),
		identify: vi.fn(),
		submit: vi.fn(),
		update: vi.fn(),
		editRememberedRsvp: vi.fn(),
		...overrides,
	};
}

describe("RSVP section", () => {
	beforeAll(() => {
		vi.stubGlobal(
			"ResizeObserver",
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			},
		);
	});

	beforeEach(() => {
		navigate.mockReset();
	});

	afterEach(cleanup);
	afterAll(() => vi.unstubAllGlobals());

	it("does not show a separate Retrieval section", () => {
		mockedUseRsvpFlow.mockReturnValue(flow());

		render(<RsvpForm />);

		expect(screen.queryByText("Already confirmed?")).toBeNull();
		expect(screen.queryByText("Find my RSVP")).toBeNull();
		expect(
			screen.getByRole("button", { name: "Find my Invitation" }),
		).toBeDefined();
	});

	it("hides Additional guests when the Invitation allowance is zero", () => {
		mockedUseRsvpFlow.mockReturnValue(
			flow({
				invitation: {
					name: "Maria Garcia",
					phoneNumber: "+14045550123",
					additionalGuestAllowance: 0,
				},
			}),
		);

		render(<RsvpForm />);
		fireEvent.click(screen.getByLabelText("Yes, I will be there"));

		expect(screen.queryByText("Additional guests attending")).toBeNull();
	});

	it("explains that an attendance choice is required", () => {
		mockedUseRsvpFlow.mockReturnValue(
			flow({
				invitation: {
					name: "Maria Garcia",
					phoneNumber: "+14045550123",
					additionalGuestAllowance: 0,
				},
			}),
		);

		render(<RsvpForm />);
		fireEvent.click(screen.getByRole("button", { name: "File my RSVP" }));

		expect(screen.getByText("Choose whether you will attend.")).toBeDefined();
	});

	it("redirects an existing RSVP from the main lookup to the Reveal", async () => {
		mockedUseRsvpFlow.mockReturnValue(
			flow({
				phase: "confirmed",
				rsvp: {
					name: "Maria Garcia",
					phoneNumber: "+14045550123",
					additionalGuestAllowance: 2,
					attending: true,
					additionalGuestCount: 1,
					theory: "girl",
					createdAt: 0,
					updatedAt: 0,
				},
			}),
		);

		render(<RsvpForm />);

		await waitFor(() =>
			expect(navigate).toHaveBeenCalledWith({ to: "/reveal" }),
		);
	});
});
