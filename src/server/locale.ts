import { createMiddleware } from "@tanstack/react-start";

import { paraglideMiddleware } from "#/paraglide/server";

export const paraglideRequestMiddleware = createMiddleware().server(
	({ request, next }) => paraglideMiddleware(request, () => next()),
);
