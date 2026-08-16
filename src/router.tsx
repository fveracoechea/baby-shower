import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getContext } from "./integrations/tanstack-query/root-provider";
import { deLocalizeUrl, localizeUrl } from "./paraglide/runtime";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const context = getContext();

	const router = createTanStackRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
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

	setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
