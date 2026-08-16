import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "#/db";
import { invitations, rsvps } from "#/db/schema";
import { normalizeUsPhoneNumber } from "#/lib/phone";

const phoneNumberSchema = z
	.string()
	.trim()
	.transform((value, context) => {
		const normalizedPhoneNumber = normalizeUsPhoneNumber(value);
		if (!normalizedPhoneNumber) {
			context.addIssue({
				code: "custom",
				message: "Enter a valid US phone number",
			});
			return z.NEVER;
		}
		return normalizedPhoneNumber;
	});

const invitationFields = {
	name: z
		.string()
		.trim()
		.min(2, "Enter the Guest name")
		.max(80, "Name is too long"),
	phoneNumber: phoneNumberSchema,
	additionalGuestAllowance: z.number().int().min(0).max(3),
};

export const addInvitationInputSchema = z.object(invitationFields);
export const editInvitationInputSchema = z.object({
	id: z.number().int().positive(),
	...invitationFields,
});
const removeInvitationInputSchema = z.object({
	id: z.number().int().positive(),
	confirmed: z.literal(true),
});

export type InvitationStatus = "awaiting-response" | "attending" | "declined";

export interface AdminInvitation {
	id: number;
	name: string;
	phoneNumber: string;
	additionalGuestAllowance: number;
	status: InvitationStatus;
	additionalGuestsAttending: number | null;
	partySize: number | null;
}

export interface AdminSummary {
	invitationCount: number;
	awaitingResponseCount: number;
	attendingCount: number;
	declinedCount: number;
	headcount: number;
	girlTheoryCount: number;
	boyTheoryCount: number;
}

export interface AdminView {
	summary: AdminSummary;
	invitations: AdminInvitation[];
}

function cleanName(name: string) {
	return name.trim().replace(/\s+/g, " ");
}

async function invitationHasPhoneNumber(
	phoneNumber: string,
	exceptId?: number,
) {
	const rows = await db
		.select({ id: invitations.id })
		.from(invitations)
		.where(eq(invitations.phoneNumber, phoneNumber));
	return rows.some((row) => row.id !== exceptId);
}

async function requireUniquePhoneNumber(
	phoneNumber: string,
	exceptId?: number,
) {
	if (await invitationHasPhoneNumber(phoneNumber, exceptId)) {
		throw new Error("An Invitation already uses this phone number.");
	}
}

export const getAdminView = createServerFn({ method: "GET" }).handler(
	async (): Promise<AdminView> => {
		const rows = await db
			.select({ invitation: invitations, rsvp: rsvps })
			.from(invitations)
			.leftJoin(rsvps, eq(rsvps.invitationId, invitations.id))
			.orderBy(invitations.guestName);

		const invitationRows = rows.map(({ invitation, rsvp }) => {
			const status: InvitationStatus = !rsvp
				? "awaiting-response"
				: rsvp.attending
					? "attending"
					: "declined";
			return {
				id: invitation.id,
				name: invitation.guestName,
				phoneNumber: invitation.phoneNumber,
				additionalGuestAllowance: invitation.additionalGuestAllowance,
				status,
				additionalGuestsAttending: rsvp?.attending
					? rsvp.additionalGuestCount
					: null,
				partySize: rsvp?.attending ? rsvp.additionalGuestCount + 1 : null,
			};
		});

		return {
			invitations: invitationRows,
			summary: {
				invitationCount: invitationRows.length,
				awaitingResponseCount: invitationRows.filter(
					(row) => row.status === "awaiting-response",
				).length,
				attendingCount: invitationRows.filter(
					(row) => row.status === "attending",
				).length,
				declinedCount: invitationRows.filter((row) => row.status === "declined")
					.length,
				headcount: invitationRows.reduce(
					(total, row) => total + (row.partySize ?? 0),
					0,
				),
				girlTheoryCount: rows.filter(({ rsvp }) => rsvp?.theory === "girl")
					.length,
				boyTheoryCount: rows.filter(({ rsvp }) => rsvp?.theory === "boy")
					.length,
			},
		};
	},
);

export const addInvitation = createServerFn({ method: "POST" })
	.validator(addInvitationInputSchema)
	.handler(async ({ data }) => {
		await requireUniquePhoneNumber(data.phoneNumber);
		const [invitation] = await db
			.insert(invitations)
			.values({
				guestName: cleanName(data.name),
				phoneNumber: data.phoneNumber,
				additionalGuestAllowance: data.additionalGuestAllowance,
			})
			.returning();
		return invitation;
	});

export const editInvitation = createServerFn({ method: "POST" })
	.validator(editInvitationInputSchema)
	.handler(async ({ data }) => {
		await requireUniquePhoneNumber(data.phoneNumber, data.id);
		const [rsvp] = await db
			.select({
				additionalGuestCount: rsvps.additionalGuestCount,
				attending: rsvps.attending,
			})
			.from(rsvps)
			.where(eq(rsvps.invitationId, data.id));
		const additionalGuestsAttending = rsvp?.attending
			? rsvp.additionalGuestCount
			: 0;
		if (data.additionalGuestAllowance < additionalGuestsAttending) {
			throw new Error(
				"Allowance cannot be below the confirmed Additional-guest count.",
			);
		}
		const [invitation] = await db
			.update(invitations)
			.set({
				guestName: cleanName(data.name),
				phoneNumber: data.phoneNumber,
				additionalGuestAllowance: data.additionalGuestAllowance,
			})
			.where(eq(invitations.id, data.id))
			.returning();
		if (!invitation) throw new Error("Invitation not found.");
		return invitation;
	});

export const removeInvitation = createServerFn({ method: "POST" })
	.validator(removeInvitationInputSchema)
	.handler(async ({ data }) => {
		await db.transaction(async (tx) => {
			await tx.delete(rsvps).where(eq(rsvps.invitationId, data.id));
			const deleted = await tx
				.delete(invitations)
				.where(eq(invitations.id, data.id))
				.returning();
			if (!deleted[0]) throw new Error("Invitation not found.");
		});
	});
