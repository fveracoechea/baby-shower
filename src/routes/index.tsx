import { createFileRoute, redirect } from "@tanstack/react-router";

// Temporary: the real landing is build ticket #17, blocked on the
// visual-direction pick (#13). Until then, the root sends guests to the
// prototype gallery.
export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/prototype/mystery", search: { variant: "noir" } });
	},
});
