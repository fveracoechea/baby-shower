import { createServerFn } from "@tanstack/react-start";
import {
	getCookie,
	getRequestHeader,
	setCookie,
	setResponseHeader,
} from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { invitations, rsvps } from "#/db/schema";
import { lookupSchema, type RsvpDto, rsvpInputSchema } from "#/lib/rsvp";
import { createRsvpService, type GuestRsvp } from "#/server/rsvp-service";

const REVEAL_ACCESS_COOKIE = "reveal-access";
const REVEAL_ACCESS_MAX_AGE = 60 * 60 * 24 * 90;

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

function rememberRevealAccess(rsvp: GuestRsvp) {
	setCookie(REVEAL_ACCESS_COOKIE, rsvp.phoneNumber, {
		httpOnly: true,
		maxAge: REVEAL_ACCESS_MAX_AGE,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
}

function toDto(rsvp: GuestRsvp): RsvpDto {
	return {
		...rsvp,
		createdAt: rsvp.createdAt.getTime(),
		updatedAt: rsvp.updatedAt.getTime(),
	};
}

export const submitRsvp = createServerFn({ method: "POST" })
	.validator(rsvpInputSchema)
	.handler(async ({ data }) => {
		rateLimit();
		const result = await service.submit(data);
		if ("rsvp" in result && result.rsvp) rememberRevealAccess(result.rsvp);
		return "rsvp" in result && result.rsvp
			? { ...result, rsvp: toDto(result.rsvp) }
			: result;
	});

export const updateRsvp = createServerFn({ method: "POST" })
	.validator(rsvpInputSchema)
	.handler(async ({ data }) => {
		rateLimit();
		const result = await service.update(data);
		if ("rsvp" in result && result.rsvp) rememberRevealAccess(result.rsvp);
		return "rsvp" in result && result.rsvp
			? { ...result, rsvp: toDto(result.rsvp) }
			: result;
	});

export const lookupRsvp = createServerFn({ method: "GET" })
	.validator(lookupSchema)
	.handler(async ({ data }) => {
		rateLimit();
		const result = await service.retrieve(data);
		if ("rsvp" in result && result.rsvp) rememberRevealAccess(result.rsvp);
		return "rsvp" in result && result.rsvp
			? { ...result, rsvp: toDto(result.rsvp) }
			: result;
	});

export const lookupRememberedRsvp = createServerFn({ method: "GET" }).handler(
	async () => {
		rateLimit();
		const phoneNumber = getCookie(REVEAL_ACCESS_COOKIE);
		if (!phoneNumber) return { status: "not-found" as const };

		const result = await service.retrieve({ phoneNumber });
		if (result.status !== "found") {
			return { status: "not-found" as const };
		}

		rememberRevealAccess(result.rsvp);
		return { ...result, rsvp: toDto(result.rsvp) };
	},
);

export const getRememberedGuestName = createServerFn({ method: "GET" }).handler(
	async () => {
		setResponseHeader("Cache-Control", "private, no-store");
		setResponseHeader("Vary", "Cookie");

		const phoneNumber = getCookie(REVEAL_ACCESS_COOKIE);
		if (!phoneNumber) return null;

		const [invitation] = await db
			.select({ name: invitations.guestName })
			.from(invitations)
			.where(eq(invitations.phoneNumber, phoneNumber))
			.limit(1);
		return invitation?.name ?? null;
	},
);
