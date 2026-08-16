import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		// Paraglide url strategy: the router matches delocalized URLs (/es/x -> /x)
		// and emits localized ones (/x -> /es/x when the locale is es).
		rewrite: {
			input: ({ url }) => deLocalizeUrl(url),
			output: ({ url }) => {
				const localized = localizeUrl(url);
				// canonical form carries no trailing slash (except the root itself):
				// localizing "/" yields "/es/", but the canonical es root is "/es"
				if (localized.pathname.length > 1 && localized.pathname.endsWith("/")) {
					localized.pathname = localized.pathname.slice(0, -1);
				}
				return localized;
			},
		},
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
