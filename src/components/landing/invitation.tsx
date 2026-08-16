import {
	Calendar,
	ClipboardList,
	Clock3,
	FolderOpen,
	MapPin,
	Stethoscope,
} from "lucide-react";

import {
	FactItem,
	MANILA_CARD,
	PRIMARY_BUTTON,
	Stamp,
} from "#/components/landing/case-ui";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { m } from "#/paraglide/messages";

const WITNESSES = [
	{
		id: 1,
		icon: Stethoscope,
		name: m.witness1_name,
		detail: m.witness1_detail,
		tilt: "-rotate-2",
	},
	{
		id: 2,
		icon: ClipboardList,
		name: m.witness2_name,
		detail: m.witness2_detail,
		tilt: "rotate-1",
	},
] as const;

/**
 * The invitation state: the case file with the event facts (city only,
 * the venue stays sealed), the pinned evidence photos, and the two
 * witnesses strung together on the desk. The CTA scrolls to the RSVP.
 */
export function Invitation({ onCta }: { onCta: () => void }) {
	return (
		<>
			<section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
				<Card
					className={`-rotate-1 ${MANILA_CARD} motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-backwards motion-safe:duration-500`}
				>
					<CardHeader>
						<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
							<FolderOpen className="size-3.5" aria-hidden />
							{m.envelope_case_number()}
						</div>
						<CardTitle className="display-title text-4xl text-case-ink sm:text-5xl">
							{m.beat2_title()}
						</CardTitle>
						<CardAction>
							<Stamp className="rotate-12 border-stamp/70 text-stamp/70 sm:px-3 sm:py-1.5 sm:text-xs">
								{m.stamp_confidencial()}
							</Stamp>
						</CardAction>
						<CardDescription className="max-w-prose font-mono text-sm leading-relaxed text-stone-700">
							{m.beat4_body()}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<ul className="flex flex-col gap-3">
							<FactItem icon={Calendar}>{m.event_date_long()}</FactItem>
							<FactItem icon={Clock3}>{m.event_time()}</FactItem>
							<FactItem icon={MapPin}>{m.event_city()}</FactItem>
						</ul>
						<p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">
							{m.invite_sealed_note()}
						</p>
					</CardContent>
					<CardFooter>
						<Button type="button" onClick={onCta} className={PRIMARY_BUTTON}>
							{m.rsvp_title()}
						</Button>
					</CardFooter>
				</Card>

				{/* pinned evidence photos */}
				<div className="relative mx-auto w-full max-w-sm pb-14 pl-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-200 motion-safe:fill-mode-backwards motion-safe:duration-500">
					<figure className="relative rotate-2 bg-stone-100 p-2 pb-9 shadow-2xl">
						<div
							aria-hidden
							className="absolute -top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 -rotate-2 bg-lamp/80"
						/>
						<img
							src="/assets/couple-portrait.jpg"
							alt={m.alt_couple()}
							className="w-full grayscale contrast-125"
						/>
						<figcaption className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
							{m.event_parents()}
						</figcaption>
					</figure>
					<figure className="absolute -bottom-2 -left-2 w-40 -rotate-6 bg-stone-100 p-1.5 pb-7 shadow-xl sm:w-48">
						<div
							aria-hidden
							className="absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 rotate-2 bg-lamp/80"
						/>
						<img
							src="/assets/baby-ultrasound.jpg"
							alt={m.alt_ultrasound()}
							className="w-full grayscale contrast-125"
						/>
						<figcaption className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-stone-500">
							{m.exhibit_a()}
						</figcaption>
					</figure>
				</div>
			</section>

			{/* the witnesses, pinned and strung together */}
			<section className="flex flex-col gap-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-300 motion-safe:fill-mode-backwards motion-safe:duration-500">
				<div className="flex flex-col gap-2">
					<p className="font-mono text-[11px] uppercase tracking-[0.35em] text-lamp/70">
						{m.beat3_kicker()}
					</p>
					<h2 className="display-title text-3xl text-amber-50 sm:text-4xl">
						{m.beat3_title()}
					</h2>
				</div>
				<div className="relative">
					<div
						aria-hidden
						className="absolute inset-x-6 top-1/2 hidden h-0.5 -translate-y-1/2 -rotate-1 bg-string md:block"
					/>
					<div className="relative mx-auto grid max-w-4xl gap-8 md:grid-cols-2 md:gap-6">
						{WITNESSES.map((witness) => (
							<article
								key={witness.id}
								className={`relative rounded-sm bg-amber-50 p-5 pt-8 text-case-ink shadow-xl ${witness.tilt}`}
							>
								<span
									aria-hidden
									className="absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-red-600 shadow ring-2 ring-red-900/40"
								/>
								<div className="flex items-start justify-between gap-3">
									<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stamp">
										{m.witness_role({ number: witness.id })}
									</p>
									<witness.icon className="size-5 text-stone-700" aria-hidden />
								</div>
								<h3 className="display-title mt-2 text-2xl">
									{witness.name()}
								</h3>
								<p className="mt-2 font-mono text-xs leading-relaxed text-stone-600">
									{witness.detail()}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
