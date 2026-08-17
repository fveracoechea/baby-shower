import { createFileRoute } from "@tanstack/react-router";

import { Landing, type LandingView } from "#/components/landing/landing";
import { m } from "#/paraglide/messages";
import { paraglideRequestMiddleware } from "#/server/locale";
import { getRememberedGuestName } from "#/server/rsvp";

export const Route = createFileRoute("/")({
	validateSearch: (search): { view?: LandingView } => ({
		view:
			search.view === "case" || search.view === "invitation"
				? search.view
				: undefined,
	}),
	server: {
		middleware: [paraglideRequestMiddleware],
	},
	loader: () => getRememberedGuestName(),
	head: () => ({
		meta: [
			{ title: m.meta_title() },
			{ name: "description", content: m.meta_description() },
			{ property: "og:type", content: "website" },
			{ property: "og:title", content: m.meta_title() },
			{ property: "og:description", content: m.meta_description() },
			{ property: "og:image", content: "/opengraph-image.png" },
			{ property: "og:image:type", content: "image/png" },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{
				property: "og:image:alt",
				content:
					"A confidential case file for Nancy and Francisco's baby shower and gender reveal",
			},
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: m.meta_title() },
			{ name: "twitter:description", content: m.meta_description() },
			{ name: "twitter:image", content: "/opengraph-image.png" },
			{
				name: "twitter:image:alt",
				content:
					"A confidential case file for Nancy and Francisco's baby shower and gender reveal",
			},
		],
	}),
	component: InvitationPage,
});

function InvitationPage() {
	const { view } = Route.useSearch();
	const guestName = Route.useLoaderData();
	return <Landing view={view} guestName={guestName} />;
}
