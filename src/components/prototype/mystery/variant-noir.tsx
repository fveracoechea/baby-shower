import {
	Balloon,
	CakeSlice,
	Calendar,
	Clock3,
	ExternalLink,
	FileText,
	FolderOpen,
	Gift,
	LockOpen,
	type LucideIcon,
	MapPin,
	Search,
	Stethoscope,
} from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";

import {
	ASSETS,
	COPY,
	EVENT,
	STORY_BEATS,
	WITNESSES,
} from "#/components/prototype/mystery/content";
import { useRsvpFlow } from "#/components/prototype/mystery/use-rsvp-flow";
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
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { Separator } from "#/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";

const BEAT_MS = 3200;

const WITNESS_ICONS: Record<number, LucideIcon> = {
	1: Stethoscope,
	2: Balloon,
	3: CakeSlice,
};

const WITNESS_TILTS = ["-rotate-2", "rotate-1", "-rotate-1"];

const MANILA_CARD =
	"rounded-md bg-amber-100 text-neutral-900 shadow-2xl ring-amber-900/30";

const INPUT_MANILA =
	"rounded-md border-neutral-900/30 bg-amber-50/80 font-mono text-neutral-900 placeholder:text-neutral-500 focus-visible:border-red-700 focus-visible:ring-red-700/30";

const MONO_LABEL =
	"font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600";

const TOGGLE_ITEM =
	"rounded-md border-neutral-900/30 bg-amber-50/70 font-mono text-xs text-neutral-700 hover:bg-amber-200/70 data-[state=on]:border-neutral-900 data-[state=on]:bg-neutral-900 data-[state=on]:text-amber-100 aria-pressed:bg-neutral-900 aria-pressed:text-amber-100";

const THEORY_ITEM =
	"rounded-md border-neutral-900/30 bg-amber-50/70 font-mono text-xs text-neutral-700 hover:bg-amber-200/70 data-[state=on]:border-neutral-900 data-[state=on]:text-neutral-900 aria-pressed:text-neutral-900";

const LAMP_GLOW =
	"pointer-events-none absolute inset-x-0 top-0 h-[75vh] bg-[radial-gradient(ellipse_65%_55%_at_50%_0%,rgba(251,191,36,0.22),rgba(251,191,36,0.05)_45%,transparent_72%)]";

/** Rubber stamp, hit at an angle. Text stays literal caps for the ink. */
function Stamp({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			aria-hidden
			className={`pointer-events-none w-fit border-[3px] px-2 py-1 font-mono text-[10px] tracking-[0.3em] ${className}`}
		>
			{children}
		</div>
	);
}

/** One line of the case facts: icon medallion plus mono type. */
function FactItem({
	icon: Icon,
	label,
	children,
}: {
	icon: LucideIcon;
	label?: string;
	children: ReactNode;
}) {
	return (
		<li className="flex items-center gap-3">
			<span className="grid size-9 shrink-0 place-items-center rounded-full border border-neutral-900/20 bg-amber-50/70 text-red-700">
				<Icon className="size-4" aria-hidden />
			</span>
			<span className="font-mono text-sm text-neutral-800">
				{label ? (
					<span className="mb-0.5 block text-[10px] uppercase tracking-[0.25em] text-neutral-500">
						{label}
					</span>
				) : null}
				{children}
			</span>
		</li>
	);
}

/** Signature element: the Secret Envelope opens on load and falls away. */
function EnvelopeIntro({ step }: { step: number }) {
	return (
		<div className="fixed inset-0 z-40 grid place-items-center overflow-hidden bg-gradient-to-b from-neutral-950 via-stone-950 to-black p-6">
			<div aria-hidden className={LAMP_GLOW} />
			<div className="relative flex flex-col items-center gap-12">
				<div
					className={
						step >= 2
							? "motion-safe:translate-y-[130vh] motion-safe:rotate-6 motion-safe:opacity-0 motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-in"
							: "motion-safe:transition-all motion-safe:duration-700"
					}
				>
					<div className="relative h-48 w-72 [perspective:900px] sm:h-56 sm:w-88">
						{/* envelope back */}
						<div className="absolute inset-0 bg-amber-300/90 shadow-2xl" />
						{/* the letter inside */}
						<div
							className={`absolute inset-x-3 top-2 bottom-5 z-10 rounded-sm bg-amber-50 p-4 shadow-md motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out ${
								step >= 1 ? "motion-safe:-translate-y-[62%]" : ""
							}`}
						>
							<p className="font-mono text-[10px] tracking-[0.35em] text-red-700">
								TOP SECRET
							</p>
							<p className="mt-1 font-mono text-[10px] text-neutral-500">
								{EVENT.caseNumber}
							</p>
							<p className="display-title mt-3 text-2xl text-neutral-900">
								{STORY_BEATS[1].title}
							</p>
							<p className="mt-1 font-mono text-[11px] text-neutral-600">
								{EVENT.parents}
							</p>
						</div>
						{/* envelope front pocket */}
						<div className="absolute inset-0 z-20 bg-amber-200 [clip-path:polygon(0_0,50%_48%,100%_0,100%_100%,0_100%)]" />
						{/* the flap, hinged on the top edge */}
						<div
							className={`absolute inset-x-0 top-0 z-30 h-[52%] origin-top bg-amber-400 [backface-visibility:hidden] [clip-path:polygon(0_0,100%_0,50%_100%)] motion-safe:transition-transform motion-safe:duration-700 ${
								step >= 1 ? "motion-safe:[transform:rotateX(170deg)]" : ""
							}`}
						/>
						{/* wax seal */}
						<div
							aria-hidden
							className={`absolute top-[46%] left-1/2 z-40 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-700 font-mono text-lg text-amber-100 shadow-lg ring-4 ring-red-900/40 ${
								step >= 1
									? "motion-safe:scale-50 motion-safe:opacity-0 motion-safe:transition-all motion-safe:duration-500"
									: ""
							}`}
						>
							?
						</div>
						<Stamp className="absolute bottom-3 left-3 z-30 -rotate-6 border-red-700/70 text-red-700/70">
							CONFIDENCIAL
						</Stamp>
					</div>
				</div>
				<p className="font-mono text-[11px] tracking-[0.4em] text-stone-500">
					{EVENT.caseNumber}
				</p>
			</div>
		</div>
	);
}

export function VariantNoir() {
	const { phase, rsvp, error, submit, update, retrieve, changeRsvp } =
		useRsvpFlow();

	const [stage, setStage] = useState<"envelope" | "story" | "invite">(
		"envelope",
	);
	const [envelopeStep, setEnvelopeStep] = useState(0);
	const [beatIndex, setBeatIndex] = useState(0);

	const [name, setName] = useState("");
	const [attending, setAttending] = useState<"yes" | "no" | null>(null);
	const [partySize, setPartySize] = useState("1");
	const [theory, setTheory] = useState<"girl" | "boy" | null>(null);
	const [website, setWebsite] = useState("");
	const [showRetrieval, setShowRetrieval] = useState(false);
	const [retrievalName, setRetrievalName] = useState("");

	// The envelope opens on load, then falls away into the case file.
	useEffect(() => {
		if (stage !== "envelope") return;
		const timers = [
			window.setTimeout(() => setEnvelopeStep(1), 700),
			window.setTimeout(() => setEnvelopeStep(2), 1700),
			window.setTimeout(() => setStage("story"), 2500),
		];
		return () => {
			for (const id of timers) window.clearTimeout(id);
		};
	}, [stage]);

	// Auto-advancing scenes: one story beat every few seconds.
	useEffect(() => {
		if (stage !== "story") return;
		const id = window.setTimeout(() => {
			if (beatIndex < STORY_BEATS.length - 1) {
				setBeatIndex(beatIndex + 1);
			} else {
				setStage("invite");
			}
		}, BEAT_MS);
		return () => window.clearTimeout(id);
	}, [stage, beatIndex]);

	// Returning to the form pre-fills the stored response.
	useEffect(() => {
		if (phase === "idle" && rsvp) {
			setName(rsvp.name);
			setAttending(rsvp.attending ? "yes" : "no");
			setPartySize(String(rsvp.partySize));
			setTheory(rsvp.theory);
		}
	}, [phase, rsvp]);

	const beat = STORY_BEATS[beatIndex];
	const submitting = phase === "submitting";
	const canSubmit =
		name.trim().length >= 2 && attending !== null && !submitting;

	function scrollToRsvp() {
		const target = document.getElementById("rsvp");
		if (!target) return;
		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		target.scrollIntoView({
			behavior: reduced ? "auto" : "smooth",
			block: "start",
		});
	}

	function skipToRsvp() {
		setStage("invite");
		window.setTimeout(scrollToRsvp, 80);
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (attending === null || submitting) return;
		const input = {
			name: name.trim(),
			attending: attending === "yes",
			partySize: Number(partySize),
			theory,
			website,
		};
		if (rsvp) {
			update(input);
		} else {
			submit(input);
		}
	}

	function handleRetrieve(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (retrievalName.trim().length < 2 || submitting) return;
		retrieve(retrievalName.trim());
	}

	return (
		<main className="relative min-h-svh overflow-x-clip bg-gradient-to-b from-neutral-950 via-stone-950 to-black text-stone-200">
			{/* the one warm desk lamp */}
			<div aria-hidden className={LAMP_GLOW} />
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]"
			/>

			{stage === "envelope" ? <EnvelopeIntro step={envelopeStep} /> : null}

			{stage === "story" ? (
				<section
					aria-live="polite"
					className="relative z-10 mx-auto flex min-h-svh w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16"
				>
					<div className="flex w-full items-end justify-between gap-2">
						<div className="flex items-end gap-1">
							{STORY_BEATS.map((storyBeat, index) => (
								<button
									key={storyBeat.kicker}
									type="button"
									onClick={() => setBeatIndex(index)}
									aria-current={index === beatIndex}
									aria-label={`Scene ${index + 1}: ${storyBeat.title}`}
									className={`rounded-t-md px-3 py-1.5 font-mono text-[11px] tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-amber-300 ${
										index === beatIndex
											? "bg-amber-100 text-neutral-900"
											: "bg-stone-800/80 text-stone-500 hover:bg-stone-700 hover:text-stone-200"
									}`}
								>
									{String(index + 1).padStart(2, "0")}
								</button>
							))}
						</div>
						<span className="hidden font-mono text-[10px] tracking-[0.3em] text-stone-500 sm:block">
							{EVENT.caseNumber}
						</span>
					</div>

					<Card
						key={beatIndex}
						className={`w-full -rotate-1 ${MANILA_CARD} motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500`}
					>
						<CardHeader>
							<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
								<FolderOpen className="size-3.5" aria-hidden />
								{beat.kicker}
							</div>
							<CardTitle className="display-title text-3xl text-neutral-900 sm:text-4xl">
								{beat.title}
							</CardTitle>
							<CardAction>
								<Stamp className="rotate-12 border-red-700/70 text-red-700/70">
									CONFIDENCIAL
								</Stamp>
							</CardAction>
							<CardDescription className="max-w-prose font-mono text-sm leading-relaxed text-neutral-700">
								{beat.body}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex justify-end">
							<figure className="relative w-28 rotate-3 bg-stone-100 p-1.5 pb-6 shadow-lg sm:w-36">
								<div
									aria-hidden
									className="absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 -rotate-3 bg-amber-300/80"
								/>
								<img
									src={ASSETS.ultrasound}
									alt="Baby ultrasound, pinned to the case file as Exhibit A"
									className="w-full grayscale contrast-125"
								/>
								<figcaption className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500">
									Exhibit A
								</figcaption>
							</figure>
						</CardContent>
						<CardFooter className="justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
							<span>
								Scene {beatIndex + 1} / {STORY_BEATS.length}
							</span>
							<span>Sealed until October 10</span>
						</CardFooter>
					</Card>
				</section>
			) : null}

			{stage === "invite" ? (
				<div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-24 px-4 py-16 sm:py-24">
					{/* the invitation case file */}
					<section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
						<Card
							className={`-rotate-1 ${MANILA_CARD} motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-backwards motion-safe:duration-500`}
						>
							<CardHeader>
								<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
									<FolderOpen className="size-3.5" aria-hidden />
									{EVENT.caseNumber}
								</div>
								<CardTitle className="display-title text-4xl text-neutral-900 sm:text-5xl">
									{STORY_BEATS[1].title}
								</CardTitle>
								<CardAction>
									<Stamp className="rotate-12 border-red-700/70 text-red-700/70 sm:px-3 sm:py-1.5 sm:text-xs">
										CONFIDENCIAL
									</Stamp>
								</CardAction>
								<CardDescription className="max-w-prose font-mono text-sm leading-relaxed text-neutral-700">
									{STORY_BEATS[3].body}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-5">
								<ul className="flex flex-col gap-3">
									<FactItem icon={Calendar}>{EVENT.dateLong}</FactItem>
									<FactItem icon={Clock3}>{EVENT.timeRange}</FactItem>
									<FactItem icon={MapPin}>{EVENT.city}</FactItem>
								</ul>
								<p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500">
									The exact scene stays sealed until your RSVP is filed.
								</p>
							</CardContent>
							<CardFooter>
								<Button
									type="button"
									onClick={scrollToRsvp}
									className="rounded-md bg-neutral-900 font-mono text-xs uppercase tracking-[0.2em] text-amber-100 hover:bg-neutral-800"
								>
									{COPY.rsvpTitle}
								</Button>
							</CardFooter>
						</Card>

						{/* pinned evidence photos */}
						<div className="relative mx-auto w-full max-w-sm pb-14 pl-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-200 motion-safe:fill-mode-backwards motion-safe:duration-500">
							<figure className="relative rotate-2 bg-stone-100 p-2 pb-9 shadow-2xl">
								<div
									aria-hidden
									className="absolute -top-2.5 left-1/2 z-10 h-5 w-20 -translate-x-1/2 -rotate-2 bg-amber-300/80"
								/>
								<img
									src={ASSETS.hero}
									alt="Nancy and Francisco, the parents-to-be"
									className="w-full grayscale contrast-125"
								/>
								<figcaption className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
									{EVENT.parents}
								</figcaption>
							</figure>
							<figure className="absolute -bottom-2 -left-2 w-40 -rotate-6 bg-stone-100 p-1.5 pb-7 shadow-xl sm:w-48">
								<div
									aria-hidden
									className="absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 rotate-2 bg-amber-300/80"
								/>
								<img
									src={ASSETS.secondary}
									alt="Landscape pinned to the desk as Exhibit B"
									className="w-full grayscale contrast-125"
								/>
								<figcaption className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500">
									Exhibit B
								</figcaption>
							</figure>
						</div>
					</section>

					{/* the witnesses, pinned and strung together */}
					<section className="flex flex-col gap-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-300 motion-safe:fill-mode-backwards motion-safe:duration-500">
						<div className="flex flex-col gap-2">
							<p className="font-mono text-[11px] uppercase tracking-[0.35em] text-amber-200/70">
								{STORY_BEATS[2].kicker}
							</p>
							<h2 className="display-title text-3xl text-amber-50 sm:text-4xl">
								{STORY_BEATS[2].title}
							</h2>
						</div>
						<div className="relative">
							<div
								aria-hidden
								className="absolute inset-x-6 top-1/2 hidden h-0.5 -translate-y-1/2 -rotate-1 bg-red-600/70 md:block"
							/>
							<div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
								{WITNESSES.map((witness, index) => {
									const Icon = WITNESS_ICONS[witness.id];
									return (
										<article
											key={witness.id}
											className={`relative rounded-sm bg-amber-50 p-5 pt-8 text-neutral-900 shadow-xl ${WITNESS_TILTS[index]}`}
										>
											<span
												aria-hidden
												className="absolute -top-1.5 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-red-600 shadow ring-2 ring-red-900/40"
											/>
											<div className="flex items-start justify-between gap-3">
												<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-700">
													{witness.role}
												</p>
												<Icon className="size-5 text-neutral-700" aria-hidden />
											</div>
											<h3 className="display-title mt-2 text-2xl">
												{witness.name}
											</h3>
											<p className="mt-2 font-mono text-xs leading-relaxed text-neutral-600">
												{witness.detail}
											</p>
										</article>
									);
								})}
							</div>
						</div>
					</section>

					{/* the RSVP, typed onto the case file itself */}
					<section
						id="rsvp"
						className="scroll-mt-20 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-500 motion-safe:fill-mode-backwards motion-safe:duration-500"
					>
						{phase === "confirmed" && rsvp ? (
							<Card
								key="reveal"
								className="rounded-md bg-amber-50 text-neutral-900 shadow-2xl ring-amber-900/30 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-8 motion-safe:duration-700"
							>
								<CardHeader>
									<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-green-800">
										<LockOpen className="size-3.5" aria-hidden />
										{COPY.revealKicker}
									</div>
									<CardTitle className="display-title text-3xl text-neutral-900 sm:text-4xl">
										{COPY.revealTitle}
									</CardTitle>
									<CardAction>
										<Stamp className="rotate-12 border-green-800/70 text-green-800/70">
											UNSEALED
										</Stamp>
									</CardAction>
									<CardDescription className="font-mono text-sm leading-relaxed text-neutral-700">
										{COPY.revealBody}
									</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-col gap-6">
									<ul className="grid gap-4 sm:grid-cols-2">
										<FactItem icon={Calendar} label={COPY.dateLabel}>
											{EVENT.dateLong}
										</FactItem>
										<FactItem icon={Clock3} label={COPY.timeLabel}>
											{EVENT.timeRange}
										</FactItem>
										<FactItem icon={MapPin} label={COPY.venueLabel}>
											{EVENT.venue}
										</FactItem>
										<FactItem icon={ExternalLink} label={COPY.addressLabel}>
											<a
												href={EVENT.mapsUrl}
												target="_blank"
												rel="noreferrer"
												className="underline decoration-red-700/60 underline-offset-4 transition-colors hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-700"
											>
												{EVENT.address}
											</a>
										</FactItem>
									</ul>
									<div className="grid grid-cols-2 gap-4">
										<figure className="-rotate-2 bg-white p-1.5 shadow-lg">
											<img
												src={ASSETS.venueExterior}
												alt="Provisions Boutique, the venue, seen from the street"
												className="w-full"
											/>
										</figure>
										<figure className="rotate-2 bg-white p-1.5 shadow-lg">
											<img
												src={ASSETS.venueInterior}
												alt="Inside Provisions Boutique"
												className="w-full"
											/>
										</figure>
									</div>
									<Separator className="bg-neutral-900/20" />
									<div className="flex flex-col gap-2">
										<p className={MONO_LABEL}>{COPY.dressCodeLabel}</p>
										<p className="flex items-center gap-2 font-mono text-sm text-neutral-800">
											<span
												aria-hidden
												className="size-2.5 shrink-0 rounded-full bg-pink-400"
											/>
											<span
												aria-hidden
												className="size-2.5 shrink-0 rounded-full bg-sky-400"
											/>
											{EVENT.dressCode}
										</p>
									</div>
									<div className="flex flex-col gap-2">
										<p className={MONO_LABEL}>{COPY.registryLabel}</p>
										<p className="font-mono text-sm leading-relaxed text-neutral-700">
											{EVENT.registryNote}
										</p>
										<a
											href={EVENT.registryUrl}
											className="inline-flex w-fit items-center gap-2 font-mono text-sm text-neutral-900 underline decoration-red-700/60 underline-offset-4 transition-colors hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-700"
										>
											<Gift className="size-4" aria-hidden />
											{COPY.registryCta}
										</a>
									</div>
									<p className="border-t border-neutral-900/15 pt-4 text-center font-mono text-xs text-neutral-500">
										{STORY_BEATS[3].body}
									</p>
								</CardContent>
							</Card>
						) : phase === "declined" ? (
							<Card className={MANILA_CARD}>
								<CardHeader>
									<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
										<FileText className="size-3.5" aria-hidden />
										{EVENT.caseNumber}
									</div>
									<CardTitle className="display-title text-3xl text-neutral-900 sm:text-4xl">
										{COPY.declinedTitle}
									</CardTitle>
									<CardDescription className="font-mono text-sm leading-relaxed text-neutral-700">
										{COPY.declinedBody}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Stamp className="-rotate-6 border-neutral-500/60 text-neutral-500">
										FILED
									</Stamp>
								</CardContent>
							</Card>
						) : phase === "already-confirmed" && rsvp ? (
							<Card className={MANILA_CARD}>
								<CardHeader>
									<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
										<FolderOpen className="size-3.5" aria-hidden />
										{EVENT.caseNumber}
									</div>
									<CardTitle className="display-title text-3xl text-neutral-900 sm:text-4xl">
										{COPY.alreadyConfirmedTitle}
									</CardTitle>
									<CardDescription className="font-mono text-sm leading-relaxed text-neutral-700">
										{COPY.alreadyConfirmedBody}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-sm text-neutral-800">
										<dt className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
											{COPY.nameLabel}
										</dt>
										<dd>{rsvp.name}</dd>
										<dt className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
											{COPY.attendingLabel}
										</dt>
										<dd>
											{rsvp.attending ? COPY.attendingYes : COPY.attendingNo}
										</dd>
										<dt className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
											{COPY.partySizeLabel}
										</dt>
										<dd>{COPY.partySizeOptions[rsvp.partySize - 1]}</dd>
										{rsvp.theory ? (
											<>
												<dt className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
													{COPY.theoryLabel}
												</dt>
												<dd>
													{rsvp.theory === "girl"
														? COPY.theoryGirl
														: COPY.theoryBoy}
												</dd>
											</>
										) : null}
									</dl>
								</CardContent>
								<CardFooter>
									<Button
										type="button"
										onClick={changeRsvp}
										className="rounded-md bg-neutral-900 font-mono text-xs uppercase tracking-[0.2em] text-amber-100 hover:bg-neutral-800"
									>
										{COPY.changeRsvp}
									</Button>
								</CardFooter>
							</Card>
						) : (
							<Card className={`rotate-1 ${MANILA_CARD}`}>
								<CardHeader>
									<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
										<FileText className="size-3.5" aria-hidden />
										{COPY.rsvpKicker}
									</div>
									<CardTitle className="display-title text-3xl text-neutral-900 sm:text-4xl">
										{COPY.rsvpTitle}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<form onSubmit={handleSubmit}>
										<fieldset
											disabled={submitting}
											className="flex min-w-0 flex-col gap-5"
										>
											<div className="flex flex-col gap-2">
												<Label htmlFor="noir-name" className={MONO_LABEL}>
													{COPY.nameLabel}
												</Label>
												<Input
													id="noir-name"
													value={name}
													onChange={(event) => setName(event.target.value)}
													placeholder={COPY.namePlaceholder}
													autoComplete="name"
													className={INPUT_MANILA}
												/>
											</div>

											<div className="flex flex-col gap-2">
												<span className={MONO_LABEL}>
													{COPY.attendingLabel}
												</span>
												<RadioGroup
													value={attending ?? ""}
													onValueChange={(value) =>
														setAttending(value as "yes" | "no")
													}
													className="grid gap-2 sm:grid-cols-2"
												>
													{(
														[
															["yes", COPY.attendingYes],
															["no", COPY.attendingNo],
														] as const
													).map(([value, label]) => (
														<Label
															key={value}
															className={`cursor-pointer gap-3 rounded-md border px-3 py-2.5 font-mono text-xs tracking-wide transition-colors ${
																attending === value
																	? "border-neutral-900/60 bg-amber-200/70 text-neutral-900"
																	: "border-neutral-900/20 bg-amber-50/60 text-neutral-600 hover:border-neutral-900/40"
															}`}
														>
															<RadioGroupItem
																value={value}
																aria-label={label}
																className="border-neutral-900/50 data-checked:border-red-700 data-checked:bg-red-700 dark:data-checked:border-red-700 dark:data-checked:bg-red-700 [&_[data-slot='radio-group-indicator']>span]:bg-amber-50"
															/>
															{label}
														</Label>
													))}
												</RadioGroup>
											</div>

											<div className="flex flex-col gap-2">
												<span className={MONO_LABEL}>
													{COPY.partySizeLabel}
												</span>
												<ToggleGroup
													type="single"
													value={partySize}
													onValueChange={(value) => {
														if (value) setPartySize(value);
													}}
													className="flex-wrap"
												>
													{COPY.partySizeOptions.map((label, index) => (
														<ToggleGroupItem
															key={label}
															value={String(index + 1)}
															className={TOGGLE_ITEM}
														>
															{label}
														</ToggleGroupItem>
													))}
												</ToggleGroup>
											</div>

											<div className="flex flex-col gap-2">
												<span className={MONO_LABEL}>{COPY.theoryLabel}</span>
												<ToggleGroup
													type="single"
													value={theory ?? ""}
													onValueChange={(value) =>
														setTheory(
															value === "girl" || value === "boy"
																? value
																: null,
														)
													}
													className="flex-wrap"
												>
													<ToggleGroupItem
														value="girl"
														className={`${THEORY_ITEM} data-[state=on]:bg-pink-300 aria-pressed:bg-pink-300`}
													>
														{COPY.theoryGirl}
													</ToggleGroupItem>
													<ToggleGroupItem
														value="boy"
														className={`${THEORY_ITEM} data-[state=on]:bg-sky-300 aria-pressed:bg-sky-300`}
													>
														{COPY.theoryBoy}
													</ToggleGroupItem>
												</ToggleGroup>
											</div>

											<input
												type="text"
												name="website"
												value={website}
												onChange={(event) => setWebsite(event.target.value)}
												className="hidden"
												aria-hidden="true"
												tabIndex={-1}
												autoComplete="off"
											/>

											{error && error !== "not-found" ? (
												<p
													role="alert"
													className="font-mono text-xs text-red-700"
												>
													{COPY.errorGeneric}
												</p>
											) : null}

											<Button
												type="submit"
												disabled={!canSubmit}
												className="w-full rounded-md bg-neutral-900 font-mono text-xs uppercase tracking-[0.2em] text-amber-100 hover:bg-neutral-800"
											>
												{submitting
													? COPY.submitting
													: rsvp
														? COPY.update
														: COPY.submit}
											</Button>
										</fieldset>
									</form>
								</CardContent>
								<CardFooter className="flex-col items-stretch gap-3">
									<Separator className="bg-neutral-900/20" />
									{showRetrieval ? (
										<form
											onSubmit={handleRetrieve}
											className="flex flex-col gap-2"
										>
											<Label htmlFor="noir-retrieval" className={MONO_LABEL}>
												{COPY.retrievalLabel}
											</Label>
											<div className="flex flex-col gap-2 sm:flex-row">
												<Input
													id="noir-retrieval"
													value={retrievalName}
													onChange={(event) =>
														setRetrievalName(event.target.value)
													}
													autoComplete="name"
													className={INPUT_MANILA}
												/>
												<Button
													type="submit"
													variant="outline"
													disabled={
														submitting || retrievalName.trim().length < 2
													}
													className="rounded-md border-neutral-900/40 bg-transparent font-mono text-xs uppercase tracking-[0.15em] text-neutral-800 hover:bg-amber-200/70 hover:text-neutral-900"
												>
													<Search aria-hidden />
													{COPY.retrievalSubmit}
												</Button>
											</div>
											{error === "not-found" ? (
												<p
													role="alert"
													className="font-mono text-xs text-red-700"
												>
													{COPY.retrievalNotFound}
												</p>
											) : null}
										</form>
									) : (
										<button
											type="button"
											onClick={() => setShowRetrieval(true)}
											className="self-start font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500 underline underline-offset-4 transition-colors hover:text-red-700 focus-visible:outline-2 focus-visible:outline-red-700"
										>
											{COPY.retrievalLink}
										</button>
									)}
								</CardFooter>
							</Card>
						)}
					</section>
				</div>
			) : null}

			{stage !== "invite" ? (
				<div className="fixed right-4 bottom-5 z-50">
					<Button
						type="button"
						variant="outline"
						onClick={skipToRsvp}
						className="rounded-md border-stone-700 bg-stone-900/80 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-300 hover:bg-stone-800 hover:text-amber-100"
					>
						Skip to RSVP
					</Button>
				</div>
			) : null}
		</main>
	);
}
