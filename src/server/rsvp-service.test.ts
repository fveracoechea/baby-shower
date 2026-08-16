import { describe, expect, it } from "vitest";

import { createRsvpService } from "#/server/rsvp-service";

const invitation = {
	id: 1,
	guestName: "Maria Garcia",
	phoneNumber: "+14045550123",
	additionalGuestAllowance: 2,
};

type TestState = {
	stored?: {
		invitationId: number;
		attending: boolean;
		additionalGuestCount: number;
		theory: "girl" | "boy" | null;
		createdAt: Date;
		updatedAt: Date;
	};
};

function serviceAt(now: string, state: TestState = {}) {
	return createRsvpService({
		now: () => new Date(now),
		findInvitation: async (phoneNumber) =>
			phoneNumber === invitation.phoneNumber ? invitation : undefined,
		findRsvp: async () => state.stored,
		createRsvp: async (input) => {
			state.stored = {
				...input,
				createdAt: new Date(now),
				updatedAt: new Date(now),
			};
			return state.stored;
		},
		updateRsvp: async (input) => {
			if (!state.stored)
				throw new Error("RSVP must exist before it can be updated");
			state.stored = { ...state.stored, ...input, updatedAt: new Date(now) };
			return state.stored;
		},
	});
}

describe("Guest RSVP server functions", () => {
	it("files an RSVP only for a recognized Invitation and respects its allowance", async () => {
		const service = serviceAt("2026-10-03T23:00:00-04:00");

		await expect(
			service.submit({
				phoneNumber: "404-555-0123",
				attending: true,
				additionalGuestCount: 2,
				theory: "girl",
				website: "",
			}),
		).resolves.toMatchObject({
			status: "created",
			rsvp: { name: "Maria Garcia" },
		});

		await expect(
			service.submit({
				phoneNumber: "404-555-0123",
				attending: true,
				additionalGuestCount: 3,
				theory: null,
				website: "",
			}),
		).rejects.toThrow(
			"Additional guest count exceeds this Invitation's allowance",
		);
	});

	it("returns a neutral result for an unrecognized phone number", async () => {
		const service = serviceAt("2026-10-03T23:00:00-04:00");

		await expect(
			service.retrieve({ phoneNumber: "404-555-0999" }),
		).resolves.toEqual({
			status: "not-found",
		});
	});

	it("retrieves an Invitation with an international phone number", async () => {
		const internationalInvitation = {
			...invitation,
			phoneNumber: "+525512345678",
		};
		const service = createRsvpService({
			now: () => new Date("2026-10-03T23:00:00-04:00"),
			findInvitation: async (phoneNumber) =>
				phoneNumber === internationalInvitation.phoneNumber
					? internationalInvitation
					: undefined,
			findRsvp: async () => undefined,
			createRsvp: async () => {
				throw new Error("Not used");
			},
			updateRsvp: async () => {
				throw new Error("Not used");
			},
		});

		await expect(
			service.retrieve({ phoneNumber: "+52 55 1234 5678" }),
		).resolves.toMatchObject({ status: "awaiting" });
	});

	it("keeps Retrieval available but makes it read-only after the Cutoff", async () => {
		const state: TestState = {};
		const beforeCutoff = serviceAt("2026-10-03T23:00:00-04:00", state);
		await beforeCutoff.submit({
			phoneNumber: "404-555-0123",
			attending: true,
			additionalGuestCount: 0,
			theory: null,
			website: "",
		});

		const afterCutoff = serviceAt("2026-10-04T00:00:00-04:00", state);
		await expect(
			afterCutoff.retrieve({ phoneNumber: "404-555-0123" }),
		).resolves.toMatchObject({ status: "found", readOnly: true });
		await expect(
			afterCutoff.submit({
				phoneNumber: "404-555-0123",
				attending: false,
				additionalGuestCount: 0,
				theory: null,
				website: "",
			}),
		).resolves.toEqual({ status: "closed" });
	});
});
