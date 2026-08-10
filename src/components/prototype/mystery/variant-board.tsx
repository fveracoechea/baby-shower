import {
	ArrowRight,
	Balloon,
	CakeSlice,
	Calendar,
	Clock,
	ExternalLink,
	Gift,
	MapPin,
	RotateCcw,
	Search,
	Shirt,
	Stamp,
	Stethoscope,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import {
	ASSETS,
	COPY,
	EVENT,
	STORY_BEATS,
	WITNESSES,
	type Witness,
} from "#/components/prototype/mystery/content";
import { useRsvpFlow } from "#/components/prototype/mystery/use-rsvp-flow";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Progress } from "#/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { Separator } from "#/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import type { RsvpInput } from "#/lib/rsvp";
import { cn } from "#/lib/utils";

/**
 * PROTOTYPE (throwaway). Direction: "The Evidence Board".
 * A tactile corkboard war-room: pinned polaroids, sticky notes, red yarn,
 * and a camera pan that glides across the wall through the story beats.
 */

const CORK = "bg-gradient-to-br from-amber-900 via-[#3f2d20] to-stone-900";

/**
 * Camera pan per story beat. The board is a 1600x1020 wall centered with
 * left/top 1/2; each entry translates the wall so the beat's pinned item
 * lands at the viewport center, then zooms in slightly.
 */
const PAN: readonly string[] = [
	"md:translate-x-[calc(-50%_+_632px)] md:translate-y-[calc(-50%_+_391px)] md:scale-[1.15]",
	"md:translate-x-[calc(-50%_-_143px)] md:translate-y-[calc(-50%_+_242px)] md:scale-[1.1]",
	"md:translate-x-[calc(-50%_+_184px)] md:translate-y-[calc(-50%_-_108px)] md:scale-[1.08]",
	"md:translate-x-[calc(-50%_-_561px)] md:translate-y-[calc(-50%_+_198px)] md:scale-[1.1]",
	"md:translate-x-[calc(-50%_-_605px)] md:translate-y-[calc(-50%_-_291px)] md:scale-[1.12]",
];

const PAN_DONE = "md:-translate-x-1/2 md:-translate-y-1/2 md:scale-[0.82]";

interface YarnSpec {
	id: string;
	position: string;
	/** Beat index at which the yarn finishes drawing. */
	showAt: number;
	delay?: string;
}

/** Red yarn strands between pinned items (board coordinates, md+ only). */
const YARNS: readonly YarnSpec[] = [
	{
		id: "case-to-question",
		position: "left-[250px] top-[78px] w-[711px] rotate-[3deg]",
		showAt: 1,
	},
	{
		id: "question-to-doctor",
		position: "left-[830px] top-[330px] w-[544px] rotate-[163deg]",
		showAt: 2,
	},
	{
		id: "doctor-to-balloon-store",
		position: "left-[310px] top-[474px] w-[320px] rotate-[-2deg]",
		showAt: 2,
		delay: "motion-safe:delay-300",
	},
	{
		id: "balloon-store-to-cake-shop",
		position: "left-[630px] top-[464px] w-[320px] rotate-[2deg]",
		showAt: 2,
		delay: "motion-safe:delay-500",
	},
	{
		id: "cake-shop-to-ultrasound",
		position: "left-[1000px] top-[640px] w-[641px] rotate-[-62deg]",
		showAt: 3,
	},
	{
		id: "photos-to-invitation",
		position: "left-[1320px] top-[354px] w-[261px] rotate-[86deg]",
		showAt: 4,
	},
];

const WITNESS_ICONS = [Stethoscope, Balloon, CakeSlice] as const;

const BEAT_MS = 3200;

function Pin({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"absolute -top-1.5 left-1/2 z-10 size-3 -translate-x-1/2 rounded-full bg-red-600 shadow-md shadow-black/50 ring-1 ring-red-950/70",
				className,
			)}
		/>
	);
}

function Tape({ className }: { className?: string }) {
	return (
		<span
			aria-hidden
			className={cn(
				"absolute -top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rotate-[-5deg] bg-amber-100/50 shadow-sm",
				className,
			)}
		/>
	);
}

function CorkOverlays() {
	return (
		<>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.18)_1px,transparent_1.5px)] bg-[size:7px_7px] opacity-40"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(12,8,4,0.6)_100%)]"
			/>
		</>
	);
}

function Yarn({ spec, drawn }: { spec: YarnSpec; drawn: boolean }) {
	return (
		<div
			role="img"
			aria-label="Red yarn connecting the evidence on the corkboard"
			className={cn(
				"pointer-events-none absolute hidden h-0 origin-top-left md:block",
				spec.position,
			)}
		>
			<span
				aria-hidden
				className="absolute top-0 left-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-md shadow-black/50 ring-1 ring-red-950/70"
			/>
			<span
				aria-hidden
				className={cn(
					"block h-0.5 w-full origin-left bg-red-500/80 shadow-sm motion-safe:transition-transform motion-safe:duration-700",
					spec.delay,
					drawn ? "scale-x-100" : "scale-x-0",
				)}
			/>
			<span
				aria-hidden
				className={cn(
					"absolute top-0 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-md shadow-black/50 ring-1 ring-red-950/70 motion-safe:transition-opacity",
					spec.delay,
					drawn ? "opacity-100" : "opacity-0",
				)}
			/>
		</div>
	);
}

function Polaroid({
	src,
	alt,
	tag,
	caption,
	className,
	imgClassName,
}: {
	src: string;
	alt: string;
	tag: string;
	caption: string;
	className?: string;
	imgClassName?: string;
}) {
	return (
		<figure
			className={cn(
				"relative bg-white p-2 pb-6 shadow-xl shadow-black/40",
				className,
			)}
		>
			<Pin />
			<img
				src={src}
				alt={alt}
				loading="lazy"
				className={cn("w-full object-cover", imgClassName)}
			/>
			<figcaption className="flex items-baseline justify-between gap-2 px-1 pt-2">
				<span className="font-mono text-[10px] uppercase tracking-widest text-red-700">
					{tag}
				</span>
				<span className="font-mono text-[11px] text-stone-600">{caption}</span>
			</figcaption>
		</figure>
	);
}

function WitnessCard({
	witness,
	index,
	className,
}: {
	witness: Witness;
	index: number;
	className?: string;
}) {
	const Icon = WITNESS_ICONS[index] ?? Stethoscope;
	return (
		<figure
			className={cn(
				"relative bg-white p-2 pb-6 shadow-xl shadow-black/40",
				className,
			)}
		>
			<Pin />
			<div className="grid aspect-[4/3] w-full place-items-center bg-gradient-to-br from-amber-100 via-[#f3e7d3] to-stone-200">
				<Icon className="size-12 text-[#3f2d20]" strokeWidth={1.5} />
			</div>
			<figcaption className="px-1 pt-2">
				<p className="font-mono text-[10px] uppercase tracking-widest text-red-700">
					{witness.role}
				</p>
				<p className="font-semibold text-stone-800">{witness.name}</p>
				<p className="mt-1 text-[11px] leading-snug text-stone-600">
					{witness.detail}
				</p>
			</figcaption>
		</figure>
	);
}

type AttendingChoice = "yes" | "no" | "";
type TheoryChoice = "girl" | "boy" | null;

export function VariantBoard() {
	const { phase, rsvp, error, submit, update, retrieve, changeRsvp } =
		useRsvpFlow();

	// Intro: the camera pan across the evidence wall.
	const [beat, setBeat] = useState(0);
	const [introDone, setIntroDone] = useState(false);

	useEffect(() => {
		if (introDone) return;
		const timer = window.setTimeout(() => {
			if (beat >= STORY_BEATS.length - 1) setIntroDone(true);
			else setBeat(beat + 1);
		}, BEAT_MS);
		return () => window.clearTimeout(timer);
	}, [beat, introDone]);

	// Form state.
	const [name, setName] = useState("");
	const [attending, setAttending] = useState<AttendingChoice>("");
	const [partySize, setPartySize] = useState("1");
	const [theory, setTheory] = useState<TheoryChoice>(null);
	const [website, setWebsite] = useState("");
	const [showRetrieve, setShowRetrieve] = useState(false);
	const [retrieveName, setRetrieveName] = useState("");

	// Pre-fill the form when a stored RSVP exists (change-my-RSVP path).
	useEffect(() => {
		if (!rsvp) return;
		setName(rsvp.name);
		setAttending(rsvp.attending ? "yes" : "no");
		setPartySize(String(rsvp.partySize));
		setTheory(rsvp.theory);
	}, [rsvp]);

	function scrollToRsvp() {
		const el = document.getElementById("rsvp");
		if (!el) return;
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
	}

	function skipToRsvp() {
		setIntroDone(true);
		scrollToRsvp();
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (attending === "") return;
		const input: RsvpInput = {
			name: name.trim(),
			attending: attending === "yes",
			partySize: Number(partySize),
			theory,
			website: website === "" ? undefined : website,
		};
		if (rsvp) void update(input);
		else void submit(input);
	}

	function handleRetrieve(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (retrieveName.trim().length < 2) return;
		void retrieve(retrieveName.trim());
	}

	const submitting = phase === "submitting";
	const canSubmit = !submitting && attending !== "" && name.trim().length >= 2;
	const currentBeat = STORY_BEATS[beat] ?? STORY_BEATS[0];

	return (
		<main className="min-h-screen bg-stone-950 text-amber-50">
			{/* ------------------------------ The wall ------------------------------ */}
			<section
				aria-label="The evidence board"
				className={cn("relative overflow-hidden md:h-svh", CORK)}
			>
				<CorkOverlays />
				<h1 className="sr-only">
					The Evidence Board: Nancy and Francisco&apos;s baby shower and gender
					reveal
				</h1>

				<div
					className={cn(
						"relative mx-auto flex w-full max-w-md flex-col gap-10 px-5 py-16",
						"md:absolute md:top-1/2 md:left-1/2 md:block md:h-[1020px] md:w-[1600px] md:max-w-none md:p-0",
						"md:motion-safe:transition-transform md:motion-safe:duration-700 md:motion-safe:ease-in-out",
						introDone ? PAN_DONE : (PAN[beat] ?? PAN[0]),
					)}
				>
					{/* Case tag index card */}
					<div className="relative rotate-[-1deg] rounded-sm bg-[#fffdf5] p-4 text-stone-800 shadow-lg shadow-black/40 md:absolute md:top-[70px] md:left-[90px] md:w-[320px]">
						<Pin />
						<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
							The Evidence Board
						</p>
						<p className="mt-1 font-mono text-lg font-bold tracking-wide text-red-700">
							{EVENT.caseNumber}
						</p>
						<Separator className="my-3 bg-stone-300" />
						<ul className="space-y-1 font-mono text-[11px] text-stone-600">
							<li>&middot; 3 witnesses</li>
							<li>&middot; 1 sealed envelope</li>
							<li>&middot; 0 leaks &mdash; not even the parents</li>
						</ul>
						<p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-stone-400">
							pinned to the cork &middot; do not remove
						</p>
					</div>

					{/* Main case card */}
					<Card className="relative rotate-[1deg] rounded-md bg-[#f7efe2] text-stone-800 shadow-2xl shadow-black/50 ring-stone-900/10 md:absolute md:top-[110px] md:left-[770px] md:w-[380px]">
						<Pin />
						<CardHeader>
							<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-700">
								{EVENT.caseNumber}
							</p>
							<CardTitle className="display-title text-4xl leading-tight text-stone-900">
								{STORY_BEATS[1]?.title}
							</CardTitle>
							<CardDescription className="text-stone-600">
								{STORY_BEATS[1]?.body}
							</CardDescription>
						</CardHeader>
						<CardContent className="flex gap-2">
							<Badge className="bg-pink-600/90 font-mono text-[10px] uppercase tracking-widest text-white">
								girl?
							</Badge>
							<Badge className="bg-sky-600/90 font-mono text-[10px] uppercase tracking-widest text-white">
								boy?
							</Badge>
						</CardContent>
					</Card>

					{/* Hero polaroid */}
					<Polaroid
						src={ASSETS.hero}
						alt="Polaroid of Nancy and Francisco, the parents-to-be"
						tag="Exhibit A"
						caption="the parents-to-be"
						className="rotate-[-2deg] md:absolute md:top-[50px] md:left-[440px] md:w-[300px]"
						imgClassName="aspect-[4/5]"
					/>

					{/* Sticky note */}
					<div className="relative w-56 rotate-[3deg] bg-yellow-200 p-4 text-stone-800 shadow-lg shadow-black/40 md:absolute md:top-[330px] md:left-[350px] md:w-[170px]">
						<Tape />
						<p className="font-mono text-[11px] leading-snug">
							the parents-to-be don&apos;t know!!
						</p>
						<p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-stone-500">
							sealed by design
						</p>
					</div>

					{/* The three witnesses */}
					{WITNESSES.map((witness, i) => (
						<WitnessCard
							key={witness.id}
							witness={witness}
							index={i}
							className={cn(
								i === 0 && "rotate-[2deg] md:top-[480px] md:left-[180px]",
								i === 1 && "rotate-[-1.5deg] md:top-[470px] md:left-[500px]",
								i === 2 && "rotate-[2deg] md:top-[480px] md:left-[820px]",
								"md:absolute md:w-[260px]",
							)}
						/>
					))}

					{/* Ultrasound polaroid */}
					<Polaroid
						src={ASSETS.ultrasound}
						alt="Polaroid of the baby's first ultrasound"
						tag="Exhibit B"
						caption="the person of interest"
						className="rotate-[3deg] md:absolute md:top-[80px] md:left-[1160px] md:w-[280px]"
						imgClassName="aspect-square"
					/>

					{/* Landscape polaroid */}
					<Polaroid
						src={ASSETS.secondary}
						alt="Polaroid of Nancy and Francisco together"
						tag="Exhibit C"
						caption="the accomplices"
						className="rotate-[-2deg] md:absolute md:top-[360px] md:left-[1170px] md:w-[300px]"
						imgClassName="aspect-[3/2]"
					/>

					{/* Sticky note 2 */}
					<div className="relative w-56 rotate-[-4deg] bg-yellow-200 p-4 text-stone-800 shadow-lg shadow-black/40 md:absolute md:top-[360px] md:left-[690px] md:w-[160px]">
						<Tape />
						<p className="font-mono text-[11px] leading-snug">
							confetti color = classified
						</p>
						<p className="mt-1 font-mono text-[11px] leading-snug">
							cake filling = classified
						</p>
					</div>

					{/* The invitation */}
					<Card className="relative rotate-[1deg] rounded-md bg-[#f7efe2] text-stone-800 shadow-2xl shadow-black/50 ring-stone-900/10 md:absolute md:top-[620px] md:left-[1150px] md:w-[380px]">
						<Pin />
						<CardHeader>
							<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-700">
								Invitation &middot; rsvp requested
							</p>
							<CardTitle className="display-title text-3xl leading-tight text-stone-900">
								{EVENT.parents}
							</CardTitle>
							<CardDescription className="text-stone-600">
								invite you to crack the case: one baby shower, one live reveal.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<ul className="space-y-2 border-y border-stone-300/80 py-3 text-sm font-medium text-stone-700">
								<li className="flex items-center gap-2">
									<Calendar className="size-4 shrink-0 text-red-700" />
									{EVENT.dateLong}
								</li>
								<li className="flex items-center gap-2">
									<Clock className="size-4 shrink-0 text-red-700" />
									{EVENT.timeRange}
								</li>
								<li className="flex items-center gap-2">
									<MapPin className="size-4 shrink-0 text-red-700" />
									{EVENT.city}
								</li>
							</ul>
							<Button
								type="button"
								onClick={scrollToRsvp}
								className="w-full bg-red-700 font-medium text-amber-50 hover:bg-red-800"
							>
								{COPY.rsvpTitle}
								<ArrowRight data-icon="inline-end" />
							</Button>
						</CardContent>
					</Card>

					{/* Red yarn (md+ only) */}
					{YARNS.map((spec) => (
						<Yarn
							key={spec.id}
							spec={spec}
							drawn={introDone || beat >= spec.showAt}
						/>
					))}
				</div>

				{/* Fixed case-notes overlay while the intro plays */}
				{!introDone && (
					<>
						<div className="fixed top-4 left-4 z-40 flex items-center gap-3">
							<span className="rounded-sm bg-stone-950/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100 ring-1 ring-amber-100/20 backdrop-blur-sm">
								{EVENT.caseNumber} &middot; {String(beat + 1).padStart(2, "0")}/
								{String(STORY_BEATS.length).padStart(2, "0")}
							</span>
							<Progress
								value={((beat + 1) / STORY_BEATS.length) * 100}
								aria-label="Story progress"
								className="h-1 w-24 rounded-full bg-amber-100/20 [&_[data-slot=progress-indicator]]:bg-red-500"
							/>
						</div>

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={skipToRsvp}
							className="fixed top-4 right-4 z-40 border-amber-100/30 bg-stone-950/50 font-mono text-[11px] uppercase tracking-widest text-amber-100 backdrop-blur-sm hover:bg-stone-900/70 hover:text-amber-50"
						>
							Skip to RSVP
							<ArrowRight data-icon="inline-end" />
						</Button>

						<div className="fixed bottom-20 left-4 z-40 max-w-[17rem] md:bottom-6 md:left-6 md:max-w-xs">
							<figure
								key={beat}
								className="rotate-[-1.5deg] bg-yellow-200 p-4 text-stone-800 shadow-xl shadow-black/40 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500"
							>
								<Tape className="left-8 w-14 translate-x-0" />
								<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-700">
									{currentBeat.kicker}
								</p>
								<p className="mt-1 text-sm font-semibold">
									{currentBeat.title}
								</p>
								<p className="mt-1 text-xs leading-relaxed text-stone-700">
									{currentBeat.body}
								</p>
							</figure>
						</div>
					</>
				)}
			</section>

			{/* --------------------------- The assignment ---------------------------- */}
			<section
				id="rsvp"
				aria-label="RSVP"
				className={cn("relative overflow-hidden px-4 py-16 md:py-24", CORK)}
			>
				<CorkOverlays />
				<div className="relative mx-auto max-w-xl">
					<p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-amber-100/70">
						your move, detective
					</p>

					{phase === "confirmed" && rsvp ? (
						/* -------- The Reveal: a pinned manila envelope -------- */
						<div className="relative">
							<div className="relative rotate-[-1deg] rounded-md bg-gradient-to-b from-[#ecd6a4] via-[#e0c288] to-[#cbae74] p-4 text-stone-800 shadow-2xl shadow-black/50 md:p-6">
								<Pin />
								<div className="flex items-center justify-between gap-3 px-1 pt-1">
									<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-700">
										{COPY.revealKicker}
									</p>
									<span className="inline-flex rotate-6 items-center gap-1 rounded-sm border-2 border-red-700/70 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-red-700/80">
										<Stamp className="size-3" />
										Opened
									</span>
								</div>

								<div className="mt-4 rounded-sm bg-[#fffdf5] p-5 shadow-inner motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-4 motion-safe:duration-700 md:p-6">
									<h2 className="display-title text-3xl text-stone-900">
										{COPY.revealTitle}
									</h2>
									<p className="mt-1 text-sm text-stone-600">
										{COPY.revealBody}
									</p>

									<ul className="mt-4 space-y-3 border-y border-stone-300/80 py-4 text-sm">
										<li className="flex items-start gap-3">
											<Calendar className="mt-0.5 size-4 shrink-0 text-red-700" />
											<span>
												<span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
													{COPY.dateLabel}
												</span>
												<br />
												<span className="font-medium text-stone-800">
													{EVENT.dateLong}
												</span>
											</span>
										</li>
										<li className="flex items-start gap-3">
											<Clock className="mt-0.5 size-4 shrink-0 text-red-700" />
											<span>
												<span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
													{COPY.timeLabel}
												</span>
												<br />
												<span className="font-medium text-stone-800">
													{EVENT.timeRange}
												</span>
											</span>
										</li>
										<li className="flex items-start gap-3">
											<MapPin className="mt-0.5 size-4 shrink-0 text-red-700" />
											<span>
												<span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
													{COPY.venueLabel}
												</span>
												<br />
												<span className="font-medium text-stone-800">
													{EVENT.venue}
												</span>
												<br />
												<a
													href={EVENT.mapsUrl}
													target="_blank"
													rel="noreferrer"
													className="inline-flex items-center gap-1 font-medium text-red-700 underline underline-offset-4 hover:text-red-800"
												>
													{EVENT.address}
													<ExternalLink className="size-3.5" />
													<span className="sr-only">{COPY.openInMaps}</span>
												</a>
											</span>
										</li>
										<li className="flex items-start gap-3">
											<Shirt className="mt-0.5 size-4 shrink-0 text-red-700" />
											<span>
												<span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
													{COPY.dressCodeLabel}
												</span>
												<br />
												<span className="font-medium text-stone-800">
													{EVENT.dressCode}
												</span>
											</span>
										</li>
										<li className="flex items-start gap-3">
											<Gift className="mt-0.5 size-4 shrink-0 text-red-700" />
											<span>
												<span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
													{COPY.registryLabel}
												</span>
												<br />
												<span className="font-medium text-stone-800">
													{EVENT.registryNote}
												</span>{" "}
												<a
													href={EVENT.registryUrl}
													className="font-medium text-red-700 underline underline-offset-4 hover:text-red-800"
												>
													{COPY.registryCta}
												</a>
											</span>
										</li>
									</ul>

									<p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-stone-400">
										{EVENT.caseNumber} &middot; filed under: {rsvp.name}
									</p>
								</div>
							</div>

							{/* Party polaroids + yarn, pinned beside the envelope */}
							<figure className="absolute top-2 -right-56 hidden w-44 rotate-3 bg-white p-2 pb-6 shadow-xl shadow-black/40 lg:block">
								<Pin />
								<img
									src={ASSETS.venueExterior}
									alt="Polaroid of Provisions Boutique, the party venue"
									loading="lazy"
									className="aspect-square w-full object-cover"
								/>
								<figcaption className="px-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-red-700">
									the scene
								</figcaption>
							</figure>
							<div
								role="img"
								aria-label="Red yarn connecting the envelope to the party polaroid"
								className="pointer-events-none absolute top-12 -right-44 hidden h-0 w-36 origin-top-left rotate-[8deg] lg:block"
							>
								<span
									aria-hidden
									className="absolute top-0 left-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-md shadow-black/50 ring-1 ring-red-950/70"
								/>
								<span
									aria-hidden
									className="block h-0.5 w-full bg-red-500/80 shadow-sm motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000"
								/>
								<span
									aria-hidden
									className="absolute top-0 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 shadow-md shadow-black/50 ring-1 ring-red-950/70"
								/>
							</div>
							<figure className="absolute bottom-0 -left-56 hidden w-40 -rotate-2 bg-white p-2 pb-6 shadow-xl shadow-black/40 lg:block">
								<Pin />
								<img
									src={ASSETS.venueInterior}
									alt="Polaroid of the venue interior"
									loading="lazy"
									className="aspect-square w-full object-cover"
								/>
								<figcaption className="px-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-red-700">
									inside the scene
								</figcaption>
							</figure>

							{/* Small screens: photos in flow */}
							<div className="mt-8 flex justify-center gap-4 lg:hidden">
								<figure className="relative w-36 rotate-2 bg-white p-2 pb-6 shadow-xl shadow-black/40">
									<Tape />
									<img
										src={ASSETS.venueExterior}
										alt="Polaroid of Provisions Boutique, the party venue"
										loading="lazy"
										className="aspect-square w-full object-cover"
									/>
									<figcaption className="px-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-red-700">
										the scene
									</figcaption>
								</figure>
								<figure className="relative w-36 -rotate-2 bg-white p-2 pb-6 shadow-xl shadow-black/40">
									<Tape />
									<img
										src={ASSETS.venueInterior}
										alt="Polaroid of the venue interior"
										loading="lazy"
										className="aspect-square w-full object-cover"
									/>
									<figcaption className="px-1 pt-2 font-mono text-[10px] uppercase tracking-widest text-red-700">
										inside the scene
									</figcaption>
								</figure>
							</div>
						</div>
					) : phase === "declined" ? (
						/* ------------- Declined: a gracious sticky note ------------- */
						<div className="relative mx-auto max-w-md rotate-2 bg-yellow-200 p-6 text-stone-800 shadow-xl shadow-black/40 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 md:p-8">
							<Tape />
							<h2 className="display-title text-3xl text-stone-900">
								{COPY.declinedTitle}
							</h2>
							<p className="mt-2 text-sm leading-relaxed">
								{COPY.declinedBody}
							</p>
							<p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-stone-500">
								{EVENT.caseNumber}
							</p>
						</div>
					) : phase === "already-confirmed" && rsvp ? (
						/* --------- Already on the case: the stored response --------- */
						<div className="relative rotate-1 rounded-sm bg-[#fffdf5] p-5 text-stone-800 shadow-2xl shadow-black/50 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 md:p-7">
							<Pin />
							<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-700">
								{EVENT.caseNumber}
							</p>
							<h2 className="display-title mt-1 text-3xl text-stone-900">
								{COPY.alreadyConfirmedTitle}
							</h2>
							<p className="mt-1 text-sm text-stone-600">
								{COPY.alreadyConfirmedBody}
							</p>
							<dl className="mt-4 divide-y divide-stone-300/70 border-y border-stone-300/70 font-mono text-sm">
								<div className="flex items-center justify-between gap-4 py-2.5">
									<dt className="text-[10px] uppercase tracking-widest text-stone-500">
										{COPY.nameLabel}
									</dt>
									<dd className="text-stone-800">{rsvp.name}</dd>
								</div>
								<div className="flex items-center justify-between gap-4 py-2.5">
									<dt className="text-[10px] uppercase tracking-widest text-stone-500">
										{COPY.attendingLabel}
									</dt>
									<dd className="text-stone-800">
										{rsvp.attending ? COPY.attendingYes : COPY.attendingNo}
									</dd>
								</div>
								<div className="flex items-center justify-between gap-4 py-2.5">
									<dt className="text-[10px] uppercase tracking-widest text-stone-500">
										{COPY.partySizeLabel}
									</dt>
									<dd className="text-stone-800">
										{COPY.partySizeOptions[rsvp.partySize - 1] ??
											COPY.partySizeOptions[0]}
									</dd>
								</div>
								<div className="flex items-center justify-between gap-4 py-2.5">
									<dt className="text-[10px] uppercase tracking-widest text-stone-500">
										{COPY.theoryLabel}
									</dt>
									<dd className="text-stone-800">
										{rsvp.theory === "girl"
											? COPY.theoryGirl
											: rsvp.theory === "boy"
												? COPY.theoryBoy
												: "\u2014"}
									</dd>
								</div>
							</dl>
							<Button
								type="button"
								onClick={changeRsvp}
								className="mt-4 bg-red-700 font-medium text-amber-50 hover:bg-red-800"
							>
								<RotateCcw data-icon="inline-start" />
								{COPY.changeRsvp}
							</Button>
						</div>
					) : (
						/* ---------------- The RSVP index card ---------------- */
						<div className="relative rotate-1 rounded-sm bg-[#fffdf5] p-5 text-stone-800 shadow-2xl shadow-black/50 md:p-7">
							<Pin />
							<span
								aria-hidden
								className="absolute top-10 -right-4 size-24 rotate-12 rounded-full border-[7px] border-amber-800/15"
							/>
							<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-700">
								{COPY.rsvpKicker}
							</p>
							<h2 className="display-title mt-1 text-3xl text-stone-900">
								{COPY.rsvpTitle}
							</h2>

							<form
								onSubmit={handleSubmit}
								className="mt-3 divide-y divide-stone-300/70"
							>
								<div className="py-3">
									<Label
										htmlFor="board-rsvp-name"
										className="font-mono text-[11px] uppercase tracking-widest text-stone-500"
									>
										{COPY.nameLabel}
									</Label>
									<Input
										id="board-rsvp-name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder={COPY.namePlaceholder}
										autoComplete="name"
										required
										minLength={2}
										maxLength={80}
										className="mt-1.5 rounded-md border-stone-300 bg-white/80 text-stone-800 placeholder:text-stone-400"
									/>
								</div>

								<div className="py-3">
									<p
										id="board-attending-label"
										className="font-mono text-[11px] uppercase tracking-widest text-stone-500"
									>
										{COPY.attendingLabel}
									</p>
									<RadioGroup
										value={attending}
										onValueChange={(v) => setAttending(v as AttendingChoice)}
										aria-labelledby="board-attending-label"
										className="mt-2 gap-2"
									>
										<div className="flex items-center gap-2">
											<RadioGroupItem
												value="yes"
												id="board-attending-yes"
												className="border-stone-400 data-checked:border-red-700 data-checked:bg-red-700"
											/>
											<Label
												htmlFor="board-attending-yes"
												className="text-sm font-normal text-stone-700"
											>
												{COPY.attendingYes}
											</Label>
										</div>
										<div className="flex items-center gap-2">
											<RadioGroupItem
												value="no"
												id="board-attending-no"
												className="border-stone-400 data-checked:border-red-700 data-checked:bg-red-700"
											/>
											<Label
												htmlFor="board-attending-no"
												className="text-sm font-normal text-stone-700"
											>
												{COPY.attendingNo}
											</Label>
										</div>
									</RadioGroup>
								</div>

								<div className="py-3">
									<p className="font-mono text-[11px] uppercase tracking-widest text-stone-500">
										{COPY.partySizeLabel}
									</p>
									<ToggleGroup
										type="single"
										variant="outline"
										value={partySize}
										onValueChange={(v) => {
											if (v) setPartySize(v);
										}}
										aria-label={COPY.partySizeLabel}
										className="mt-2 flex-wrap"
									>
										{COPY.partySizeOptions.map((label, i) => (
											<ToggleGroupItem
												key={label}
												value={String(i + 1)}
												className="border-stone-300 text-stone-600 data-[state=on]:border-red-700 data-[state=on]:bg-red-700 data-[state=on]:text-amber-50"
											>
												{label}
											</ToggleGroupItem>
										))}
									</ToggleGroup>
								</div>

								<div className="py-3">
									<p className="font-mono text-[11px] uppercase tracking-widest text-stone-500">
										{COPY.theoryLabel}
									</p>
									<ToggleGroup
										type="single"
										variant="outline"
										value={theory ?? ""}
										onValueChange={(v) =>
											setTheory(v === "" ? null : (v as "girl" | "boy"))
										}
										aria-label={COPY.theoryLabel}
										className="mt-2"
									>
										<ToggleGroupItem
											value="girl"
											className="border-stone-300 text-stone-600 data-[state=on]:border-pink-600 data-[state=on]:bg-pink-600 data-[state=on]:text-white"
										>
											{COPY.theoryGirl}
										</ToggleGroupItem>
										<ToggleGroupItem
											value="boy"
											className="border-stone-300 text-stone-600 data-[state=on]:border-sky-600 data-[state=on]:bg-sky-600 data-[state=on]:text-white"
										>
											{COPY.theoryBoy}
										</ToggleGroupItem>
									</ToggleGroup>
								</div>

								{/* Honeypot: real guests never see or fill this */}
								<input
									type="text"
									name="website"
									value={website}
									onChange={(e) => setWebsite(e.target.value)}
									tabIndex={-1}
									autoComplete="off"
									aria-hidden="true"
									className="hidden"
								/>

								{error ? (
									<p
										role="alert"
										className="py-3 font-mono text-xs text-red-700"
									>
										{error === "not-found" ? COPY.retrievalNotFound : error}
									</p>
								) : null}

								<div className="py-4">
									<Button
										type="submit"
										disabled={!canSubmit}
										className="w-full bg-red-700 font-medium text-amber-50 hover:bg-red-800"
									>
										{submitting
											? COPY.submitting
											: rsvp
												? COPY.update
												: COPY.submit}
									</Button>
								</div>
							</form>

							<div className="border-t border-stone-300/70 pt-3">
								{showRetrieve ? (
									<form
										onSubmit={handleRetrieve}
										className="flex items-end gap-2"
									>
										<div className="flex-1">
											<Label
												htmlFor="board-retrieve-name"
												className="font-mono text-[11px] uppercase tracking-widest text-stone-500"
											>
												{COPY.retrievalLabel}
											</Label>
											<Input
												id="board-retrieve-name"
												value={retrieveName}
												onChange={(e) => setRetrieveName(e.target.value)}
												autoComplete="name"
												className="mt-1.5 rounded-md border-stone-300 bg-white/80 text-stone-800"
											/>
										</div>
										<Button
											type="submit"
											variant="outline"
											disabled={submitting || retrieveName.trim().length < 2}
											className="border-stone-400 text-stone-700 hover:bg-stone-100"
										>
											<Search data-icon="inline-start" />
											{COPY.retrievalSubmit}
										</Button>
									</form>
								) : (
									<Button
										type="button"
										variant="link"
										size="sm"
										onClick={() => setShowRetrieve(true)}
										className="px-0 font-mono text-[11px] uppercase tracking-widest text-stone-500 hover:text-red-700"
									>
										{COPY.retrievalLink}
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			</section>
		</main>
	);
}
