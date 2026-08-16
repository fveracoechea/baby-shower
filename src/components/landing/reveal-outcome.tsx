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
}: {
	attending: boolean;
	canEdit: boolean;
}) {
	return (
		<>
			{attending ? (
				<RevealDocument canEdit={canEdit} />
			) : (
				<Card>
					<CardHeader>
						<RevealActions canEdit={canEdit} dark />
						<CardTitle className="text-amber-100">
							{m.declined_title()}
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
