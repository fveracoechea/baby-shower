import { RevealActions } from "#/components/landing/reveal-actions";
import { RevealDocument } from "#/components/landing/reveal-document";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { m } from "#/paraglide/messages";

export function RevealOutcome({
	attending,
	canEdit,
	guestName,
}: {
	attending: boolean;
	canEdit: boolean;
	guestName: string;
}) {
	return (
		<>
			{attending ? (
				<RevealDocument canEdit={canEdit} guestName={guestName} />
			) : (
				<Card>
					<CardHeader>
						<RevealActions canEdit={canEdit} dark />
						<CardTitle role="heading" aria-level={1} className="text-amber-100">
							{m.declined_title({ name: guestName })}
						</CardTitle>
						<CardDescription className="text-stone-300">
							{m.declined_body()}
						</CardDescription>
					</CardHeader>
				</Card>
			)}
		</>
	);
}
