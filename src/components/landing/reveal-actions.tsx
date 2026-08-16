import { Link } from "@tanstack/react-router";
import { ArrowLeft, FilePenLine } from "lucide-react";

import { Button } from "#/components/ui/button";
import { m } from "#/paraglide/messages";

export function RevealActions({
	canEdit,
	dark = false,
}: {
	canEdit: boolean;
	dark?: boolean;
}) {
	return (
		<div
			className={`mb-2 flex flex-wrap items-center gap-2 border-b pb-4 ${dark ? "border-amber-100/15" : "border-stone-900/15"}`}
		>
			<Button
				asChild
				variant={dark ? "dark-outline" : "case-outline"}
				size="sm"
				className="font-mono text-[10px] uppercase tracking-[0.1em]"
			>
				<Link to="/">
					<ArrowLeft aria-hidden />
					{m.reveal_back_to_invitation()}
				</Link>
			</Button>
			{canEdit ? (
				<Button
					asChild
					variant={dark ? "dark-outline" : "case-outline"}
					size="sm"
					className="font-mono text-[10px] uppercase tracking-[0.1em]"
				>
					<Link to="/rsvp" search={{ edit: true }}>
						<FilePenLine aria-hidden />
						{m.already_change()}
					</Link>
				</Button>
			) : null}
		</div>
	);
}
