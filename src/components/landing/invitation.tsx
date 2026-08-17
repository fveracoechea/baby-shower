import { Link } from "@tanstack/react-router";
import {
	Calendar,
	CalendarClock,
	ClipboardList,
	Clock3,
	FolderOpen,
	MapPin,
	Stethoscope,
} from "lucide-react";

import { FactItem } from "#/components/landing/case-ui";
import { EventNotes } from "#/components/landing/event-notes";
import { Button } from "#/components/ui/button";
import {
	Card,
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
	},
	{
		id: 2,
		icon: ClipboardList,
		name: m.witness2_name,
		detail: m.witness2_detail,
	},
] as const;

/**
 * The invitation overview: the case file with the event facts (city only)
 * and pinned evidence photos. The CTA scrolls to the RSVP.
 */
export function Invitation({ guestName }: { guestName: string | null }) {
	return (
		<section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
			<Card variant="manila">
				<CardHeader>
					<div className="flex items-center gap-2 font-mono text-sm leading-relaxed text-stone-500">
						<FolderOpen className="size-3.5" aria-hidden />
						{m.envelope_case_number()}
					</div>
					<CardTitle className="text-4xl sm:text-5xl">
						{m.beat2_title()}
					</CardTitle>
					<CardDescription className="max-w-prose">
						{m.beat4_body()}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					{guestName ? (
						<div className="border-y border-stone-900/20 py-4">
							<p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-stamp">
								{m.invite_guest_label()}
							</p>
							<h2 className="display-title mt-1 break-words text-3xl text-case-ink sm:text-4xl">
								{guestName}
							</h2>
						</div>
					) : null}
					<ul className="flex flex-col gap-3">
						<FactItem icon={Calendar}>{m.event_date_long()}</FactItem>
						<FactItem icon={Clock3}>{m.event_time()}</FactItem>
						<FactItem icon={MapPin}>{m.event_city()}</FactItem>
					</ul>
					<EventNotes stacked />
					<p className="font-mono text-sm leading-relaxed text-stone-500">
						{m.invite_sealed_note()}
					</p>
				</CardContent>
				<CardFooter className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
					<Button asChild variant="case">
						<Link to="/rsvp">{m.rsvp_title()}</Link>
					</Button>
					<p className="flex items-center gap-2 font-mono text-sm font-bold leading-relaxed text-stamp">
						<CalendarClock className="size-4 shrink-0" aria-hidden />
						{m.invite_rsvp_cutoff()}
					</p>
				</CardFooter>
			</Card>

			{/* pinned evidence photos */}
			<div className="relative mx-auto w-full max-w-sm pb-14 pl-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-200 motion-safe:fill-mode-backwards motion-safe:duration-500">
				<figure className="relative z-0 rotate-2 bg-stone-100 p-2 pb-9 shadow-2xl">
					<div
						aria-hidden
						className="absolute -top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 -rotate-2 bg-lamp/80"
					/>
					<picture>
						<source
							srcSet="/assets/couple-portrait-384.webp 384w, /assets/couple-portrait-768.webp 768w"
							sizes="(min-width: 1024px) 384px, calc(100vw - 2rem)"
						/>
						<img
							src="/assets/couple-portrait-768.webp"
							alt={m.alt_couple()}
							width={768}
							height={1253}
							className="w-full grayscale-[70%] contrast-110"
						/>
					</picture>
					<figcaption className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
						{m.event_parents()}
					</figcaption>
				</figure>
				<figure className="absolute right-0 bottom-5 z-10 w-52 rotate-6 bg-stone-100 p-1.5 shadow-xl sm:w-60">
					<img
						src="/assets/secondary-landscape-512.webp"
						srcSet="/assets/secondary-landscape-512.webp 512w, /assets/secondary-landscape-1024.webp 1024w"
						sizes="(min-width: 640px) 240px, 208px"
						alt=""
						width={512}
						height={341}
						className="w-full grayscale-[70%] contrast-110"
					/>
				</figure>
				<figure className="absolute -bottom-2 -left-2 z-10 w-40 -rotate-6 bg-stone-100 p-1.5 pb-7 shadow-xl sm:w-48">
					<div
						aria-hidden
						className="absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 rotate-2 bg-lamp/80"
					/>
					<img
						src="/assets/baby-ultrasound-384.webp"
						alt={m.alt_ultrasound()}
						width={384}
						height={288}
						className="w-full grayscale-[70%] contrast-110"
					/>
					<figcaption className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-stone-500">
						{m.exhibit_a()}
					</figcaption>
				</figure>
			</div>
		</section>
	);
}

export function Witnesses() {
	return (
		<section className="flex flex-col gap-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-300 motion-safe:fill-mode-backwards motion-safe:duration-500">
			<div className="flex flex-col gap-2">
				<p className="font-mono text-sm leading-relaxed text-lamp/70">
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
							className="relative rounded-sm bg-amber-50 p-5 pt-8 text-case-ink shadow-xl"
						>
							<span
								aria-hidden
								className="absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-red-600 shadow ring-2 ring-red-900/40"
							/>
							<div className="flex items-start justify-between gap-3">
								<p className="font-mono text-xs leading-relaxed text-stamp">
									{m.witness_role({ number: witness.id })}
								</p>
								<witness.icon className="size-5 text-stone-700" aria-hidden />
							</div>
							<h3 className="display-title mt-2 text-2xl">{witness.name()}</h3>
							<p className="mt-2 font-mono text-xs leading-relaxed text-stone-600">
								{witness.detail()}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
