import { normalizePhoneNumber } from "#/lib/phone";

export const RSVP_CUTOFF = new Date("2026-10-04T03:59:59.999Z");

type Invitation = {
	id: number;
	guestName: string;
	phoneNumber: string;
	additionalGuestAllowance: number;
};

type StoredRsvp = {
	invitationId: number;
	attending: boolean;
	additionalGuestCount: number;
	theory: "girl" | "boy" | null;
	createdAt: Date;
	updatedAt: Date;
};

type RsvpWrite = Pick<
	StoredRsvp,
	"invitationId" | "attending" | "additionalGuestCount" | "theory"
>;

type Repository = {
	findInvitation(phoneNumber: string): Promise<Invitation | undefined>;
	findRsvp(invitationId: number): Promise<StoredRsvp | undefined>;
	createRsvp(input: RsvpWrite): Promise<StoredRsvp>;
	updateRsvp(input: RsvpWrite): Promise<StoredRsvp>;
};

export type GuestRsvpInput = {
	phoneNumber: string;
	attending: boolean;
	additionalGuestCount: number;
	theory: "girl" | "boy" | null;
	website?: string;
};

export type GuestRsvp = Omit<StoredRsvp, "invitationId"> & {
	name: string;
	phoneNumber: string;
	additionalGuestAllowance: number;
};

function toGuestRsvp(invitation: Invitation, rsvp: StoredRsvp): GuestRsvp {
	return {
		name: invitation.guestName,
		phoneNumber: invitation.phoneNumber,
		additionalGuestAllowance: invitation.additionalGuestAllowance,
		attending: rsvp.attending,
		additionalGuestCount: rsvp.additionalGuestCount,
		theory: rsvp.theory,
		createdAt: rsvp.createdAt,
		updatedAt: rsvp.updatedAt,
	};
}

export function createRsvpService(repository: Repository & { now(): Date }) {
	async function invitationFor(phoneNumber: string) {
		const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
		if (!normalizedPhoneNumber) return undefined;
		return repository.findInvitation(normalizedPhoneNumber);
	}

	function isClosed() {
		return repository.now() > RSVP_CUTOFF;
	}

	return {
		async submit(input: GuestRsvpInput) {
			if (input.website) return { status: "not-found" as const };
			if (isClosed()) return { status: "closed" as const };

			const invitation = await invitationFor(input.phoneNumber);
			if (!invitation) return { status: "not-found" as const };
			if (
				input.additionalGuestCount < 0 ||
				input.additionalGuestCount > invitation.additionalGuestAllowance
			) {
				throw new Error(
					"Additional guest count exceeds this Invitation's allowance",
				);
			}

			const existing = await repository.findRsvp(invitation.id);
			if (existing) {
				return {
					status: "existing" as const,
					rsvp: toGuestRsvp(invitation, existing),
				};
			}

			const rsvp = await repository.createRsvp({
				invitationId: invitation.id,
				attending: input.attending,
				additionalGuestCount: input.attending ? input.additionalGuestCount : 0,
				theory: input.theory,
			});
			return {
				status: "created" as const,
				rsvp: toGuestRsvp(invitation, rsvp),
			};
		},

		async retrieve(input: { phoneNumber: string }) {
			const invitation = await invitationFor(input.phoneNumber);
			if (!invitation) return { status: "not-found" as const };
			const rsvp = await repository.findRsvp(invitation.id);
			if (!rsvp) {
				return {
					status: "awaiting" as const,
					invitation: {
						name: invitation.guestName,
						phoneNumber: invitation.phoneNumber,
						additionalGuestAllowance: invitation.additionalGuestAllowance,
					},
					readOnly: isClosed(),
				};
			}
			return {
				status: "found" as const,
				rsvp: toGuestRsvp(invitation, rsvp),
				readOnly: isClosed(),
			};
		},

		async update(input: GuestRsvpInput) {
			if (input.website) return { status: "not-found" as const };
			if (isClosed()) return { status: "closed" as const };
			const invitation = await invitationFor(input.phoneNumber);
			if (!invitation) return { status: "not-found" as const };
			if (
				input.additionalGuestCount < 0 ||
				input.additionalGuestCount > invitation.additionalGuestAllowance
			) {
				throw new Error(
					"Additional guest count exceeds this Invitation's allowance",
				);
			}
			const existing = await repository.findRsvp(invitation.id);
			if (!existing) return { status: "not-found" as const };

			const rsvp = await repository.updateRsvp({
				invitationId: invitation.id,
				attending: input.attending,
				additionalGuestCount: input.attending ? input.additionalGuestCount : 0,
				theory: input.theory,
			});
			return {
				status: "updated" as const,
				rsvp: toGuestRsvp(invitation, rsvp),
			};
		},
	};
}
