import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import type { RsvpDto, RsvpInput } from "#/lib/rsvp";
import { lookupRsvp, submitRsvp, updateRsvp } from "#/server/rsvp";

/**
 * The RSVP state machine every prototype variant drives.
 * Variants own the presentation; this hook owns the flow and the server calls.
 *
 * Phases:
 * - idle: showing the form
 * - submitting: a server call is in flight
 * - confirmed: created/updated, attending -> show the Reveal
 * - declined: created/updated, not attending -> gracious state, no Reveal
 * - already-confirmed: the name already has an RSVP (or retrieval matched)
 */
export type FlowPhase =
	| "idle"
	| "submitting"
	| "confirmed"
	| "declined"
	| "already-confirmed";

export function useRsvpFlow() {
	const submitFn = useServerFn(submitRsvp);
	const updateFn = useServerFn(updateRsvp);
	const lookupFn = useServerFn(lookupRsvp);

	const [phase, setPhase] = useState<FlowPhase>("idle");
	const [rsvp, setRsvp] = useState<RsvpDto | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function submit(input: RsvpInput) {
		setPhase("submitting");
		setError(null);
		try {
			const res = await submitFn({ data: input });
			setRsvp(res.rsvp);
			if (res.status === "existing") {
				setPhase("already-confirmed");
			} else {
				setPhase(res.rsvp.attending ? "confirmed" : "declined");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setPhase("idle");
		}
	}

	async function update(input: RsvpInput) {
		setPhase("submitting");
		setError(null);
		try {
			const res = await updateFn({ data: input });
			setRsvp(res.rsvp);
			setPhase(res.rsvp.attending ? "confirmed" : "declined");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setPhase("already-confirmed");
		}
	}

	/** Retrieval: re-enter a name to re-show the RSVP. Returns true on match. */
	async function retrieve(name: string): Promise<boolean> {
		setPhase("submitting");
		setError(null);
		try {
			const res = await lookupFn({ data: { name } });
			if (res.rsvp) {
				setRsvp(res.rsvp);
				setPhase("already-confirmed");
				return true;
			}
			setError("not-found");
			setPhase("idle");
			return false;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setPhase("idle");
			return false;
		}
	}

	/** Back to the form (variants pre-fill from `rsvp` when set). */
	function changeRsvp() {
		setError(null);
		setPhase("idle");
	}

	return { phase, rsvp, error, submit, update, retrieve, changeRsvp };
}
