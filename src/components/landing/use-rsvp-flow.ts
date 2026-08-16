import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import type { GuestRsvpInput, RsvpDto } from "#/lib/rsvp";
import { lookupRsvp, submitRsvp, updateRsvp } from "#/server/rsvp";

export type FlowPhase =
	| "idle"
	| "submitting"
	| "confirmed"
	| "declined"
	| "already-confirmed"
	| "closed";

type Invitation = Pick<
	RsvpDto,
	"name" | "phoneNumber" | "additionalGuestAllowance"
>;

export function useRsvpFlow() {
	const submitFn = useServerFn(submitRsvp);
	const updateFn = useServerFn(updateRsvp);
	const lookupFn = useServerFn(lookupRsvp);
	const [phase, setPhase] = useState<FlowPhase>("idle");
	const [rsvp, setRsvp] = useState<RsvpDto | null>(null);
	const [invitation, setInvitation] = useState<Invitation | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [readOnly, setReadOnly] = useState(false);

	async function identify(phoneNumber: string) {
		setPhase("submitting");
		setError(null);
		try {
			const result = await lookupFn({ data: { phoneNumber } });
			if (result.status === "awaiting") {
				setInvitation(result.invitation);
				setReadOnly(result.readOnly);
				setPhase(result.readOnly ? "closed" : "idle");
				return true;
			}
			if (result.status === "found") {
				setRsvp(result.rsvp);
				setInvitation(result.rsvp);
				setReadOnly(result.readOnly);
				setPhase(
					result.readOnly
						? result.rsvp.attending
							? "confirmed"
							: "declined"
						: "already-confirmed",
				);
				return true;
			}
			setError("not-found");
			setPhase("idle");
			return false;
		} catch (exception) {
			setError(
				exception instanceof Error ? exception.message : "Something went wrong",
			);
			setPhase("idle");
			return false;
		}
	}

	async function write(input: GuestRsvpInput, update: boolean) {
		setPhase("submitting");
		setError(null);
		try {
			const result = await (update
				? updateFn({ data: input })
				: submitFn({ data: input }));
			if (result.status === "closed") {
				setReadOnly(true);
				setPhase("closed");
				return;
			}
			if (result.status === "not-found") {
				setError("not-found");
				setPhase("idle");
				return;
			}
			setRsvp(result.rsvp);
			setInvitation(result.rsvp);
			setPhase(
				result.status === "existing"
					? "already-confirmed"
					: result.rsvp.attending
						? "confirmed"
						: "declined",
			);
		} catch (exception) {
			setError(
				exception instanceof Error ? exception.message : "Something went wrong",
			);
			setPhase("idle");
		}
	}

	function changeRsvp() {
		if (!readOnly) {
			setError(null);
			setPhase("idle");
		}
	}

	return {
		phase,
		rsvp,
		invitation,
		error,
		readOnly,
		identify,
		submit: (input: GuestRsvpInput) => write(input, false),
		update: (input: GuestRsvpInput) => write(input, true),
		changeRsvp,
	};
}
