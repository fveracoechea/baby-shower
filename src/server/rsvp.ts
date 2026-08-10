import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { rsvps } from "#/db/schema";
import { toNameKey } from "#/lib/name-key";
import {
	type LookupResult,
	lookupSchema,
	type RsvpDto,
	rsvpInputSchema,
	type SubmitResult,
	type UpdateResult,
} from "#/lib/rsvp";

function toDto(row: typeof rsvps.$inferSelect): RsvpDto {
	return {
		id: row.id,
		name: row.name,
		attending: row.attending,
		partySize: row.partySize,
		theory: row.theory ?? null,
		createdAt: row.createdAt.getTime(),
		updatedAt: row.updatedAt.getTime(),
	};
}

// Rough per-IP sliding-window limiter for the submit endpoint.
// Prototype grade: in-memory, per server process.
const hits = new Map<string, number[]>();
function isRateLimited(key: string, limit = 10, windowMs = 60_000): boolean {
	const now = Date.now();
	const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
	if (recent.length >= limit) {
		hits.set(key, recent);
		return true;
	}
	hits.set(key, [...recent, now]);
	return false;
}

function clientKey(): string {
	return (
		getRequestHeader("x-forwarded-for") ??
		getRequestHeader("x-real-ip") ??
		"unknown"
	);
}

async function findByName(name: string) {
	const rows = await db
		.select()
		.from(rsvps)
		.where(eq(rsvps.nameKey, toNameKey(name)))
		.limit(1);
	return rows[0];
}

export const submitRsvp = createServerFn({ method: "POST" })
	.validator(rsvpInputSchema)
	.handler(async ({ data }): Promise<SubmitResult> => {
		// honeypot: pretend success, write nothing
		if (data.website) {
			return {
				status: "created",
				rsvp: {
					id: -1,
					name: data.name,
					attending: data.attending,
					partySize: data.partySize,
					theory: data.theory ?? null,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				},
			};
		}

		if (isRateLimited(clientKey())) {
			throw new Error("Too many attempts. Please wait a minute and try again.");
		}

		const existing = await findByName(data.name);
		// one RSVP per name: a re-submit routes to already-confirmed, no overwrite
		if (existing) {
			return { status: "existing", rsvp: toDto(existing) };
		}

		const [row] = await db
			.insert(rsvps)
			.values({
				name: data.name.trim().replace(/\s+/g, " "),
				nameKey: toNameKey(data.name),
				attending: data.attending,
				partySize: data.partySize,
				theory: data.theory ?? null,
			})
			.returning();

		return { status: "created", rsvp: toDto(row) };
	});

export const updateRsvp = createServerFn({ method: "POST" })
	.validator(rsvpInputSchema)
	.handler(async ({ data }): Promise<UpdateResult> => {
		if (isRateLimited(clientKey())) {
			throw new Error("Too many attempts. Please wait a minute and try again.");
		}

		const existing = await findByName(data.name);
		if (!existing) {
			const [row] = await db
				.insert(rsvps)
				.values({
					name: data.name.trim().replace(/\s+/g, " "),
					nameKey: toNameKey(data.name),
					attending: data.attending,
					partySize: data.partySize,
					theory: data.theory ?? null,
				})
				.returning();
			return { status: "updated", rsvp: toDto(row) };
		}

		const [row] = await db
			.update(rsvps)
			.set({
				attending: data.attending,
				partySize: data.partySize,
				theory: data.theory ?? null,
				updatedAt: new Date(),
			})
			.where(eq(rsvps.id, existing.id))
			.returning();

		return { status: "updated", rsvp: toDto(row) };
	});

export const lookupRsvp = createServerFn({ method: "GET" })
	.validator(lookupSchema)
	.handler(async ({ data }): Promise<LookupResult> => {
		const row = await findByName(data.name);
		return { rsvp: row ? toDto(row) : null };
	});
