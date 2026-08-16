import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { invitations, rsvps } from "#/db/schema";
import { lookupSchema, type RsvpDto, rsvpInputSchema } from "#/lib/rsvp";
import { createRsvpService, type GuestRsvp } from "#/server/rsvp-service";

const service = createRsvpService({
	now: () => new Date(),
	async findInvitation(phoneNumber) {
		return (
			await db
				.select()
				.from(invitations)
				.where(eq(invitations.phoneNumber, phoneNumber))
				.limit(1)
		)[0];
	},
	async findRsvp(invitationId) {
		return (
			await db
				.select()
				.from(rsvps)
				.where(eq(rsvps.invitationId, invitationId))
				.limit(1)
		)[0];
	},
	async createRsvp(input) {
		return (await db.insert(rsvps).values(input).returning())[0];
	},
	async updateRsvp(input) {
		return (
			await db
				.update(rsvps)
				.set({ ...input, updatedAt: new Date() })
				.where(eq(rsvps.invitationId, input.invitationId))
				.returning()
		)[0];
	},
});

const hits = new Map<string, number[]>();
function isRateLimited(key: string, limit = 10, windowMs = 60_000): boolean {
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
	if (recent.length >= limit) {
		hits.set(key, recent);
		return true;
	}
	hits.set(key, [...recent, now]);
	return false;
}

function clientKey(): string {
	return (
		getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
		getRequestHeader("x-real-ip") ??
		"unknown"
	);
}

function rateLimit() {
	if (isRateLimited(clientKey())) {
		throw new Error("Too many attempts. Please wait a minute and try again.");
	}
}

function toDto(rsvp: GuestRsvp): RsvpDto {
	return {
		...rsvp,
		partySize: rsvp.additionalGuestCount + 1,
		createdAt: rsvp.createdAt.getTime(),
		updatedAt: rsvp.updatedAt.getTime(),
	};
}

export const submitRsvp = createServerFn({ method: "POST" })
	.validator(rsvpInputSchema)
	.handler(async ({ data }) => {
		rateLimit();
		const result = await service.submit(data);
		return "rsvp" in result && result.rsvp
			? { ...result, rsvp: toDto(result.rsvp) }
			: result;
	});

export const updateRsvp = createServerFn({ method: "POST" })
	.validator(rsvpInputSchema)
	.handler(async ({ data }) => {
		rateLimit();
		const result = await service.update(data);
		return "rsvp" in result && result.rsvp
			? { ...result, rsvp: toDto(result.rsvp) }
			: result;
	});

export const lookupRsvp = createServerFn({ method: "GET" })
	.validator(lookupSchema)
	.handler(async ({ data }) => {
		rateLimit();
		const result = await service.retrieve(data);
		return "rsvp" in result && result.rsvp
			? { ...result, rsvp: toDto(result.rsvp) }
			: result;
	});
