import { createFileRoute } from "@tanstack/react-router";

import { GuestNavigation } from "#/components/GuestNavigation";
import { LAMP_GLOW } from "#/components/landing/case-ui";
import { RevealOutcome } from "#/components/landing/reveal-outcome";
import { m } from "#/paraglide/messages";
import { paraglideRequestMiddleware } from "#/server/locale";
import { getRevealAccess } from "#/server/reveal";

export const Route = createFileRoute("/reveal")({
	server: {
		middleware: [paraglideRequestMiddleware],
	},
	loader: () => getRevealAccess(),
	head: () => ({
		meta: [{ title: `${m.reveal_title()} · ${m.event_parents()}` }],
	}),
	component: RevealPage,
});

function RevealPage() {
	const { attending, canEdit, guestName } = Route.useLoaderData();

	return (
		<main className="relative min-h-svh overflow-x-clip px-4 py-20 sm:py-24">
			<div aria-hidden className={LAMP_GLOW} />
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]"
			/>
			<GuestNavigation active="rsvp" />
			<div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6">
				<RevealOutcome
					attending={attending}
					canEdit={canEdit}
					guestName={guestName}
				/>
			</div>
		</main>
	);
}
