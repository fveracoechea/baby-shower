import { eq } from "drizzle-orm";

import { db } from "#/db";
import { invitations, rsvps } from "#/db/schema";
import type {
	AddInvitationInput,
	AdminView,
	EditInvitationInput,
	InvitationStatus,
} from "#/server/admin";

function cleanName(name: string) {
	return name.trim().replace(/\s+/g, " ");
}

async function invitationHasPhoneNumber(
	phoneNumber: string,
	exceptId?: number,
	database: typeof db = db,
) {
	const rows = await database
		.select({ id: invitations.id })
		.from(invitations)
		.where(eq(invitations.phoneNumber, phoneNumber));
	return rows.some((row) => row.id !== exceptId);
}

async function requireUniquePhoneNumber(
	phoneNumber: string,
	exceptId?: number,
	database: typeof db = db,
) {
	if (await invitationHasPhoneNumber(phoneNumber, exceptId, database)) {
		throw new Error("An Invitation already uses this phone number.");
	}
}

export async function getAdminViewRecord(): Promise<AdminView> {
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
			attendingCount: invitationRows.filter((row) => row.status === "attending")
				.length,
			declinedCount: invitationRows.filter((row) => row.status === "declined")
				.length,
			headcount: invitationRows.reduce(
				(total, row) => total + (row.partySize ?? 0),
				0,
			),
			girlTheoryCount: rows.filter(({ rsvp }) => rsvp?.theory === "girl")
				.length,
			boyTheoryCount: rows.filter(({ rsvp }) => rsvp?.theory === "boy").length,
		},
	};
}

export async function addInvitationRecord(data: AddInvitationInput) {
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
}

export async function editInvitationRecord(
	data: EditInvitationInput,
	database: typeof db = db,
) {
	await requireUniquePhoneNumber(data.phoneNumber, data.id, database);
	return database.transaction((tx) => {
		const [rsvp] = tx
			.select({
				additionalGuestCount: rsvps.additionalGuestCount,
				attending: rsvps.attending,
			})
			.from(rsvps)
			.where(eq(rsvps.invitationId, data.id))
			.all();
		const additionalGuestsAttending = rsvp?.attending
			? rsvp.additionalGuestCount
			: 0;
		if (data.additionalGuestAllowance < additionalGuestsAttending) {
			throw new Error(
				"Allowance cannot be below the confirmed Additional-guest count.",
			);
		}
		const [invitation] = tx
			.update(invitations)
			.set({
				guestName: cleanName(data.name),
				phoneNumber: data.phoneNumber,
				additionalGuestAllowance: data.additionalGuestAllowance,
			})
			.where(eq(invitations.id, data.id))
			.returning()
			.all();
		if (!invitation) throw new Error("Invitation not found.");
		return invitation;
	});
}

export async function removeInvitationRecord(id: number) {
	const deleted = await db
		.delete(invitations)
		.where(eq(invitations.id, id))
		.returning();
	if (!deleted[0]) throw new Error("Invitation not found.");
}
