import { useState } from "react";

import type { RsvpDto, RsvpInput } from "#/lib/rsvp";

/** Local state only: the mystery route is a visual prototype, not a Guest flow. */
export type FlowPhase =
	| "idle"
	| "submitting"
	| "confirmed"
	| "declined"
	| "already-confirmed";

function toPrototypeRsvp(
	input: Exclude<RsvpInput, { phoneNumber: string }>,
): RsvpDto {
	return {
		id: 0,
		name: input.name,
		phoneNumber: "",
		additionalGuestAllowance: 3,
		attending: input.attending,
		additionalGuestCount: Math.max(0, input.partySize - 1),
		partySize: input.partySize,
		theory: input.theory,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};
}

export function useRsvpFlow() {
	const [phase, setPhase] = useState<FlowPhase>("idle");
	const [rsvp, setRsvp] = useState<RsvpDto | null>(null);
	const [error, setError] = useState<string | null>(null);

	function submit(input: RsvpInput) {
		if (!("name" in input)) return;
		const next = toPrototypeRsvp(input);
		setRsvp(next);
		setPhase(next.attending ? "confirmed" : "declined");
	}

	function update(input: RsvpInput) {
		submit(input);
	}

	function retrieve(name: string) {
		if (rsvp?.name === name) {
			setPhase("already-confirmed");
			return true;
		}
		setError("not-found");
		return false;
	}

	function changeRsvp() {
		setError(null);
		setPhase("idle");
	}

	return { phase, rsvp, error, submit, update, retrieve, changeRsvp };
}
