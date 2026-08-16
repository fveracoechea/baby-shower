// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { InvitationManager } from "#/components/admin/invitation-manager";

const view = {
	summary: {
		invitationCount: 1,
		awaitingResponseCount: 1,
		attendingCount: 0,
		declinedCount: 0,
		headcount: 0,
		girlTheoryCount: 0,
		boyTheoryCount: 0,
	},
	invitations: [
		{
			id: 1,
			name: "Ada Lovelace",
			phoneNumber: "+14045550123",
			additionalGuestAllowance: 1,
			status: "awaiting-response" as const,
			additionalGuestsAttending: null,
			partySize: null,
		},
	],
};

describe("InvitationManager", () => {
	it("asks for explicit confirmation before removing an Invitation", () => {
		const removeInvitation = vi.fn();
		render(
			<InvitationManager
				view={view}
				onAdd={vi.fn()}
				onEdit={vi.fn()}
				onRemove={removeInvitation}
				onLogout={vi.fn()}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Remove Ada Lovelace" }),
		);
		expect(screen.getByRole("dialog").textContent).toContain(
			"Remove Invitation?",
		);
		expect(removeInvitation).not.toHaveBeenCalled();

		fireEvent.click(screen.getByRole("button", { name: "Remove Invitation" }));
		expect(removeInvitation).toHaveBeenCalledWith(1);
	});
});
