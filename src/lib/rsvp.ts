import { z } from "zod";

const phoneNumber = z
	.string()
	.trim()
	.min(7, "Enter a US phone number")
	.max(30, "Phone number is too long");

export const rsvpInputSchema = z.object({
	phoneNumber,
	attending: z.boolean(),
	additionalGuestCount: z.number().int().min(0).max(3),
	theory: z.enum(["girl", "boy"]).nullable(),
	website: z.string().optional(),
});

export type GuestRsvpInput = z.infer<typeof rsvpInputSchema>;

export const lookupSchema = z.object({ phoneNumber });

export interface RsvpDto {
	name: string;
	phoneNumber: string;
	additionalGuestAllowance: number;
	attending: boolean;
	additionalGuestCount: number;
	theory: "girl" | "boy" | null;
	createdAt: number;
	updatedAt: number;
}
