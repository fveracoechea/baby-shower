import { createFileRoute } from "@tanstack/react-router";

import { GuestNavigation } from "#/components/GuestNavigation";
import { LAMP_GLOW } from "#/components/landing/case-ui";
import { RsvpForm } from "#/components/rsvp-form";
import { m } from "#/paraglide/messages";
import { paraglideRequestMiddleware } from "#/server/locale";

export const Route = createFileRoute("/rsvp")({
	validateSearch: (search): { edit?: true } => ({
		edit: search.edit === true ? true : undefined,
	}),
	server: {
		middleware: [paraglideRequestMiddleware],
	},
	head: () => ({
		meta: [{ title: `${m.rsvp_title()} · ${m.event_parents()}` }],
	}),
	component: RsvpPage,
});

function RsvpPage() {
	const { edit } = Route.useSearch();

	return (
		<main className="relative min-h-svh overflow-x-clip px-4 pt-20 sm:pt-24">
			<div aria-hidden className={LAMP_GLOW} />
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]"
			/>
			<GuestNavigation active="rsvp" />
			<div className="relative z-10">
				<RsvpForm editRsvp={edit === true} />
			</div>
		</main>
	);
}
