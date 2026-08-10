import { z } from "zod";

/**
 * Shared RSVP contracts. Used by the server functions and by every
 * prototype variant, so the whole experience speaks one language.
 */

// Unicode letters and marks, spaces, hyphens, apostrophes.
// Covers "Maria Jose", "Garcia-Lopez", "D'Angelo". Rejects digits and emoji.
export const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'-]*$/u;

export const rsvpInputSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Please enter your name")
		.max(80, "Name is too long")
		.regex(NAME_PATTERN, "Letters, spaces, hyphens and apostrophes only"),
	attending: z.boolean(),
	// total party size including the guest: 1..4 ("just me" .. "+3")
	partySize: z.number().int().min(1).max(4),
	theory: z.enum(["girl", "boy"]).nullish(),
	// honeypot: real guests never fill this in
	website: z.string().optional(),
});

export type RsvpInput = z.infer<typeof rsvpInputSchema>;

export const lookupSchema = z.object({
	name: z.string().trim().min(2).max(80),
});

export type LookupInput = z.infer<typeof lookupSchema>;

export interface RsvpDto {
	id: number;
	name: string;
	attending: boolean;
	partySize: number;
	theory: "girl" | "boy" | null;
	createdAt: number;
	updatedAt: number;
}

export type SubmitResult = { status: "created" | "existing"; rsvp: RsvpDto };
export type UpdateResult = { status: "updated"; rsvp: RsvpDto };
export type LookupResult = { rsvp: RsvpDto | null };
