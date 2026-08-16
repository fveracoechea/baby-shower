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

/** Legacy visual-prototype input. Production Guest flows use GuestRsvpInput. */
export type RsvpInput =
	| GuestRsvpInput
	| {
			name: string;
			attending: boolean;
			partySize: number;
			theory: "girl" | "boy" | null;
			website?: string;
	  };

export const lookupSchema = z.object({ phoneNumber });

export interface RsvpDto {
	/** Retained only for the isolated visual prototypes. */
	id?: number;
	name: string;
	phoneNumber: string;
	additionalGuestAllowance: number;
	attending: boolean;
	additionalGuestCount: number;
	/** Retained only for the isolated visual prototypes. */
	partySize: number;
	theory: "girl" | "boy" | null;
	createdAt: number;
	updatedAt: number;
}
