import { Link } from "@tanstack/react-router";

import LocaleSwitcher from "#/components/LocaleSwitcher";
import { Button } from "#/components/ui/button";
import { m } from "#/paraglide/messages";

type GuestPage = "case" | "invitation" | "rsvp";

export function GuestNavigation({
	active,
	onCase,
	onInvitation,
}: {
	active: GuestPage;
	onCase?: () => void;
	onInvitation?: () => void;
}) {
	return (
		<nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 p-3 sm:p-4">
			<LocaleSwitcher />
			<div className="pointer-events-auto flex rounded-md border border-stone-700 bg-stone-950/85 shadow-lg backdrop-blur-sm">
				<Button asChild variant="nav" size="sm">
					<Link
						to="/"
						search={{ view: "case" }}
						onClick={onCase}
						aria-current={active === "case" ? "page" : undefined}
						data-active={active === "case"}
					>
						{m.nav_case()}
					</Link>
				</Button>
				<Button asChild variant="nav" size="sm">
					<Link
						to="/"
						search={{ view: "invitation" }}
						onClick={onInvitation}
						aria-current={active === "invitation" ? "page" : undefined}
						data-active={active === "invitation"}
					>
						{m.nav_invitation()}
					</Link>
				</Button>
				<Button asChild variant="nav" size="sm">
					<Link
						to="/rsvp"
						aria-current={active === "rsvp" ? "page" : undefined}
						data-active={active === "rsvp"}
					>
						{m.nav_rsvp()}
					</Link>
				</Button>
			</div>
		</nav>
	);
}
