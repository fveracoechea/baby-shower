import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { normalizePhoneNumber } from "#/lib/phone";
import {
	addInvitationRecord,
	editInvitationRecord,
	getAdminViewRecord,
	removeInvitationRecord,
} from "#/server/admin.server";
import { adminAuthMiddleware } from "#/server/admin-auth";

const phoneNumberSchema = z
	.string()
	.trim()
	.transform((value, context) => {
		const normalizedPhoneNumber = normalizePhoneNumber(value);
		if (!normalizedPhoneNumber) {
			context.addIssue({
				code: "custom",
				message: "Enter a phone number",
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
export type AddInvitationInput = z.infer<typeof addInvitationInputSchema>;
export type EditInvitationInput = z.infer<typeof editInvitationInputSchema>;
const removeInvitationInputSchema = z.object({
	id: z.number().int().positive(),
	confirmed: z.literal(true),
});

export type InvitationStatus = "awaiting-response" | "attending" | "declined";

interface AdminInvitation {
	id: number;
	name: string;
	phoneNumber: string;
	additionalGuestAllowance: number;
	status: InvitationStatus;
	additionalGuestsAttending: number | null;
	partySize: number | null;
}

interface AdminSummary {
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

export const getAdminView = createServerFn({ method: "GET" })
	.middleware([adminAuthMiddleware])
	.handler(getAdminViewRecord);

export const addInvitation = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware])
	.validator(addInvitationInputSchema)
	.handler(({ data }) => addInvitationRecord(data));

export const editInvitation = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware])
	.validator(editInvitationInputSchema)
	.handler(({ data }) => editInvitationRecord(data));

export const removeInvitation = createServerFn({ method: "POST" })
	.middleware([adminAuthMiddleware])
	.validator(removeInvitationInputSchema)
	.handler(({ data }) => removeInvitationRecord(data.id));
