import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { normalizeUsPhoneNumber } from "#/lib/phone";
import type { GuestRsvpInput, RsvpDto } from "#/lib/rsvp";
import {
	lookupRememberedRsvp,
	lookupRsvp,
	submitRsvp,
	updateRsvp,
} from "#/server/rsvp";

export type FlowPhase =
	| "idle"
	| "submitting"
	| "confirmed"
	| "declined"
	| "closed";

type Invitation = Pick<
	RsvpDto,
	"name" | "phoneNumber" | "additionalGuestAllowance"
>;

export type RsvpFlowError =
	| "invalid-phone"
	| "not-found"
	| "rate-limited"
	| "generic";

function errorCode(exception: unknown): RsvpFlowError {
	return exception instanceof Error && exception.message.includes("Too many")
		? "rate-limited"
		: "generic";
}

export function useRsvpFlow() {
	const submitFn = useServerFn(submitRsvp);
	const updateFn = useServerFn(updateRsvp);
	const lookupFn = useServerFn(lookupRsvp);
	const lookupRememberedFn = useServerFn(lookupRememberedRsvp);
	const [phase, setPhase] = useState<FlowPhase>("idle");
	const [rsvp, setRsvp] = useState<RsvpDto | null>(null);
	const [invitation, setInvitation] = useState<Invitation | null>(null);
	const [error, setError] = useState<RsvpFlowError | null>(null);
	const [readOnly, setReadOnly] = useState(false);

	async function identify(phoneNumber: string) {
		setError(null);
		setInvitation(null);
		setRsvp(null);
		setReadOnly(false);
		if (!normalizeUsPhoneNumber(phoneNumber)) {
			setError("invalid-phone");
			return false;
		}
		setPhase("submitting");
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
				setPhase(result.rsvp.attending ? "confirmed" : "declined");
				return true;
			}
			setError("not-found");
			setPhase("idle");
			return false;
		} catch (exception) {
			setError(errorCode(exception));
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
			setPhase(result.rsvp.attending ? "confirmed" : "declined");
		} catch (exception) {
			setError(errorCode(exception));
			setPhase("idle");
		}
	}

	async function editRememberedRsvp() {
		setPhase("submitting");
		setError(null);
		try {
			const result = await lookupRememberedFn();
			if (result.status !== "found") {
				setError("not-found");
				setPhase("idle");
				return;
			}
			setRsvp(result.rsvp);
			setInvitation(result.rsvp);
			setReadOnly(result.readOnly);
			setPhase(result.readOnly ? "confirmed" : "idle");
		} catch (exception) {
			setError(errorCode(exception));
			setPhase("idle");
		}
	}

	return {
		phase,
		rsvp,
		invitation,
		error,
		readOnly,
		clearError: () => setError(null),
		identify,
		submit: (input: GuestRsvpInput) => write(input, false),
		update: (input: GuestRsvpInput) => write(input, true),
		editRememberedRsvp,
	};
}
