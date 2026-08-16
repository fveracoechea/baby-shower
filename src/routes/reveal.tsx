import { createFileRoute, Link } from "@tanstack/react-router";

import LocaleSwitcher from "#/components/LocaleSwitcher";
import { LAMP_GLOW, PRIMARY_BUTTON } from "#/components/landing/case-ui";
import { RevealDocument } from "#/components/landing/reveal-document";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
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
	const { attending, canEdit } = Route.useLoaderData();

	return (
		<main className="relative min-h-svh overflow-x-clip px-4 py-20 sm:py-24">
			<div aria-hidden className={LAMP_GLOW} />
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]"
			/>
			<nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 p-4">
				<LocaleSwitcher />
				<Button asChild className={PRIMARY_BUTTON}>
					<Link to="/">{m.reveal_back_to_invitation()}</Link>
				</Button>
			</nav>
			<div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6">
				{!attending ? (
					<Card className="rounded-md border-amber-300/30 bg-stone-900/95 text-amber-50 shadow-xl">
						<CardHeader>
							<CardTitle className="display-title text-3xl text-amber-100">
								{m.declined_title()}
							</CardTitle>
							<CardDescription className="font-mono text-sm leading-relaxed text-stone-300">
								{m.declined_body()}
							</CardDescription>
						</CardHeader>
					</Card>
				) : null}
				<RevealDocument />
				{canEdit ? (
					<div className="flex justify-center">
						<Button asChild className={PRIMARY_BUTTON}>
							<Link to="/" search={{ edit: "rsvp" }}>
								{m.already_change()}
							</Link>
						</Button>
					</div>
				) : null}
			</div>
		</main>
	);
}
