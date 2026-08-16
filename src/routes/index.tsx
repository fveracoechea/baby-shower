import { createFileRoute } from "@tanstack/react-router";

import { Landing } from "#/components/landing/landing";
import { m } from "#/paraglide/messages";
import { paraglideRequestMiddleware } from "#/server/locale";

export const Route = createFileRoute("/")({
	validateSearch: (search): { edit?: "rsvp" } => ({
		edit: search.edit === "rsvp" ? "rsvp" : undefined,
	}),
	server: {
		middleware: [paraglideRequestMiddleware],
	},
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
	const { edit } = Route.useSearch();
	return <Landing editRsvp={edit === "rsvp"} />;
}
