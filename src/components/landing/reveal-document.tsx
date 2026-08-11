import {
	Calendar,
	Clock3,
	ExternalLink,
	Gift,
	LockOpen,
	MapPin,
} from "lucide-react";

import { FactItem, MONO_LABEL, Stamp } from "#/components/landing/case-ui";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Separator } from "#/components/ui/separator";
import { m } from "#/paraglide/messages";

const MAPS_URL = "https://maps.app.goo.gl/C36KF6Vh7rPCbdss6";
const REGISTRY_URL = "#registry-to-be-confirmed";

/**
 * The Reveal: a second, unsealed document that slides up over the case
 * file once an attending RSVP is filed. Venue, address, time range,
 * dress code, registry. It never hints at the baby's sex: the answer
 * comes out live at the party.
 */
export function RevealDocument() {
	return (
		<Card className="rounded-md bg-amber-50 text-case-ink shadow-2xl ring-stone-900/30 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-8 motion-safe:duration-700">
			<CardHeader>
				<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-green-800">
					<LockOpen className="size-3.5" aria-hidden />
					{m.reveal_kicker()}
				</div>
				<CardTitle className="display-title text-3xl text-case-ink sm:text-4xl">
					{m.reveal_title()}
				</CardTitle>
				<CardAction>
					<Stamp className="rotate-12 border-green-800/70 text-green-800/70">
						{m.stamp_unsealed()}
					</Stamp>
				</CardAction>
				<CardDescription className="font-mono text-sm leading-relaxed text-stone-700">
					{m.reveal_body()}
				</CardDescription>
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
							className="text-case-ink underline decoration-stamp/60 underline-offset-4 transition-colors hover:text-stamp focus-visible:outline-2 focus-visible:outline-stamp"
						>
							{m.event_address()}
						</a>
					</FactItem>
				</ul>
				<div className="grid grid-cols-2 gap-4">
					<figure className="-rotate-2 bg-white p-1.5 shadow-lg">
						<img
							src="/assets/venue-exterior.jpg"
							alt={m.alt_venue_exterior()}
							className="w-full"
						/>
					</figure>
					<figure className="rotate-2 bg-white p-1.5 shadow-lg">
						<img
							src="/assets/venue-interior.jpg"
							alt={m.alt_venue_interior()}
							className="w-full"
						/>
					</figure>
				</div>
				<Separator className="bg-stone-900/20" />
				<div className="flex flex-col gap-2">
					<p className={MONO_LABEL}>{m.reveal_dress_code_label()}</p>
					<p className="flex items-center gap-2 font-mono text-sm text-stone-800">
						<span
							aria-hidden
							className="size-2.5 shrink-0 rounded-full bg-pink-400"
						/>
						<span
							aria-hidden
							className="size-2.5 shrink-0 rounded-full bg-sky-400"
						/>
						{m.event_dress_code()}
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<p className={MONO_LABEL}>{m.reveal_registry_label()}</p>
					<p className="font-mono text-sm leading-relaxed text-stone-700">
						{m.event_registry_note()}
					</p>
					<a
						href={REGISTRY_URL}
						className="inline-flex w-fit items-center gap-2 font-mono text-sm text-case-ink underline decoration-stamp/60 underline-offset-4 transition-colors hover:text-stamp focus-visible:outline-2 focus-visible:outline-stamp"
					>
						<Gift className="size-4" aria-hidden />
						{m.reveal_registry_cta()}
					</a>
				</div>
				<p className="border-t border-stone-900/15 pt-4 text-center font-mono text-xs text-stone-500">
					{m.beat4_body()}
				</p>
			</CardContent>
		</Card>
	);
}
