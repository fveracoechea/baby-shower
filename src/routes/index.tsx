import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import { Landing } from "#/components/landing/landing";
import { m } from "#/paraglide/messages";
import { paraglideMiddleware } from "#/paraglide/server";

/**
 * Per-request locale context for SSR. The router's rewrite option already
 * delocalizes URLs (/es -> /), so the original request is passed through
 * untouched; the middleware only binds the locale (AsyncLocalStorage) so
 * getLocale() and m.*() resolve server-side.
 */
const paraglideRequestMiddleware = createMiddleware().server(
	({ request, next }) => paraglideMiddleware(request, () => next()),
);

export const Route = createFileRoute("/")({
	server: {
		middleware: [paraglideRequestMiddleware],
	},
	head: () => ({
		meta: [
			{ title: m.meta_title() },
			{ name: "description", content: m.meta_description() },
		],
	}),
	component: Landing,
});
