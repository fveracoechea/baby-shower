import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setResponseHeader } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { invitations, rsvps } from "#/db/schema";
import { RSVP_CUTOFF } from "#/server/rsvp-service";

const REVEAL_ACCESS_COOKIE = "reveal-access";

export const getRevealAccess = createServerFn({ method: "GET" }).handler(
	async () => {
		setResponseHeader("Cache-Control", "private, no-store");
		setResponseHeader("Vary", "Cookie");

		const phoneNumber = getCookie(REVEAL_ACCESS_COOKIE);
		if (!phoneNumber) throw redirect({ to: "/" });

		const [access] = await db
			.select({
				attending: rsvps.attending,
				guestName: invitations.guestName,
			})
			.from(invitations)
			.innerJoin(rsvps, eq(rsvps.invitationId, invitations.id))
			.where(eq(invitations.phoneNumber, phoneNumber))
			.limit(1);

		if (!access) throw redirect({ to: "/" });
		return { ...access, canEdit: new Date() <= RSVP_CUTOFF };
	},
);
