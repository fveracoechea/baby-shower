import { Calendar, Clock3, ExternalLink, LockOpen, MapPin } from "lucide-react";

import { FactItem } from "#/components/landing/case-ui";
import { EventNotes } from "#/components/landing/event-notes";
import { RevealActions } from "#/components/landing/reveal-actions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { m } from "#/paraglide/messages";

const MAPS_URL = "https://maps.app.goo.gl/C36KF6Vh7rPCbdss6";
const MAP_EMBED_URL =
	"https://www.google.com/maps?q=60+E+Jefferson+St+Ste+A,+Hoschton,+GA+30548&output=embed";
/**
 * The Reveal: a second, unsealed document that slides up over the case
 * file once an attending RSVP is filed. Venue, address, time range,
 * dress code, registry. It never hints at the baby's sex: the answer
 * comes out live at the party.
 */
export function RevealDocument({ canEdit = false }: { canEdit?: boolean }) {
	return (
		<div className="flex flex-col gap-8">
			<Card variant="paper">
				<CardHeader>
					<RevealActions canEdit={canEdit} />
					<div className="flex items-center gap-2 font-mono text-sm leading-relaxed text-green-800">
						<LockOpen className="size-3.5" aria-hidden />
						{m.reveal_kicker()}
					</div>
					<CardTitle className="sm:text-4xl">{m.reveal_title()}</CardTitle>
					<CardDescription>{m.reveal_body()}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<ul className="grid gap-4 sm:grid-cols-2">
						<FactItem icon={Calendar} label={m.reveal_date_label()}>
							{m.event_date_long()}
						</FactItem>
						<FactItem icon={Clock3} label={m.reveal_time_label()}>
							{m.event_time_range()}
						</FactItem>
						<FactItem icon={MapPin} label={m.reveal_venue_label()}>
							{m.event_venue()}
						</FactItem>
						<FactItem icon={ExternalLink} label={m.reveal_address_label()}>
							<a
								href={MAPS_URL}
								target="_blank"
								rel="noreferrer"
								aria-label={m.reveal_open_maps()}
								className="leading-[normal]"
							>
								{m.event_address()}
							</a>
						</FactItem>
					</ul>
					<EventNotes />
				</CardContent>
			</Card>
			<div className="grid gap-6">
				<div className="grid gap-5 px-2 sm:grid-cols-2 sm:gap-4 sm:px-0">
					<figure className="-rotate-2 bg-white p-1.5 shadow-lg">
						<img
							src="/assets/venue-exterior-640.webp"
							alt={m.alt_venue_exterior()}
							width={640}
							height={426}
							className="aspect-[4/3] w-full object-cover"
						/>
					</figure>
					<figure className="rotate-2 bg-white p-1.5 shadow-lg">
						<img
							src="/assets/venue-interior-640.webp"
							alt={m.alt_venue_interior()}
							width={640}
							height={426}
							className="aspect-[4/3] w-full object-cover"
						/>
					</figure>
				</div>
				<iframe
					title={m.reveal_open_maps()}
					src={MAP_EMBED_URL}
					className="h-64 w-full border border-stone-900/20"
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
				/>
			</div>

			<footer className="border-t border-amber-100/15 pt-6 text-center font-mono text-xs text-stone-400">
				{m.beat4_body()}
			</footer>
		</div>
	);
}
