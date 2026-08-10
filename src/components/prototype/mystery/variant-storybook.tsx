// PROTOTYPE (throwaway): "The Cozy Casebook", a warm picture-book detective
// story. One of five ?variant= takes on /prototype/mystery. Storybook pages
// auto-advance through STORY_BEATS (a page every ~3s), then open onto the
// invitation with the working RSVP flow wired to the local sqlite DB.

import type { LucideIcon } from "lucide-react";
import {
	ArrowRight,
	Baby,
	Balloon,
	BookOpen,
	CakeSlice,
	Calendar,
	Clock,
	ExternalLink,
	Footprints,
	Gift,
	Heart,
	MailQuestion,
	MapPin,
	PartyPopper,
	Pencil,
	Search,
	Shirt,
	Stethoscope,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import {
	ASSETS,
	COPY,
	EVENT,
	STORY_BEATS,
	WITNESSES,
} from "#/components/prototype/mystery/content";
import { useRsvpFlow } from "#/components/prototype/mystery/use-rsvp-flow";
import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { Separator } from "#/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import type { RsvpDto } from "#/lib/rsvp";

const PAGE_MS = 3000;
const BOUNCE = "motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)]";

interface BeatMeta {
	Icon: LucideIcon;
	tint: string;
	wash: string;
}

const BEAT_META: readonly BeatMeta[] = [
	{
		Icon: Search,
		tint: "text-rose-400",
		wash: "bg-rose-50 bg-[radial-gradient(circle_at_28%_24%,rgba(251,113,133,0.32),transparent_62%),radial-gradient(circle_at_78%_78%,rgba(253,186,116,0.32),transparent_58%)]",
	},
	{
		Icon: Baby,
		tint: "text-sky-400",
		wash: "bg-sky-50 bg-[radial-gradient(circle_at_25%_30%,rgba(56,189,248,0.30),transparent_60%),radial-gradient(circle_at_80%_75%,rgba(251,113,133,0.26),transparent_58%)]",
	},
	{
		Icon: Footprints,
		tint: "text-amber-500",
		wash: "bg-amber-50 bg-[radial-gradient(circle_at_30%_75%,rgba(253,186,116,0.38),transparent_60%),radial-gradient(circle_at_75%_25%,rgba(251,113,133,0.24),transparent_55%)]",
	},
	{
		Icon: PartyPopper,
		tint: "text-rose-400",
		wash: "bg-rose-50 bg-[radial-gradient(circle_at_20%_30%,rgba(251,113,133,0.30),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.28),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(253,186,116,0.30),transparent_55%)]",
	},
	{
		Icon: MailQuestion,
		tint: "text-sky-400",
		wash: "bg-sky-50 bg-[radial-gradient(circle_at_75%_25%,rgba(56,189,248,0.30),transparent_58%),radial-gradient(circle_at_25%_80%,rgba(253,186,116,0.30),transparent_58%)]",
	},
];

interface WitnessMeta {
	Icon: LucideIcon;
	disc: string;
}

const WITNESS_META: readonly WitnessMeta[] = [
	{ Icon: Stethoscope, disc: "bg-rose-100 text-rose-500" },
	{ Icon: Balloon, disc: "bg-sky-100 text-sky-500" },
	{ Icon: CakeSlice, disc: "bg-amber-100 text-amber-600" },
];

const STAGGER = [
	"motion-safe:delay-0",
	"motion-safe:delay-150",
	"motion-safe:delay-300",
] as const;

const FACTS: readonly { Icon: LucideIcon; label: string; value: string }[] = [
	{ Icon: Calendar, label: COPY.dateLabel, value: EVENT.dateLong },
	{ Icon: Clock, label: COPY.timeLabel, value: EVENT.timeRange },
	{ Icon: MapPin, label: "City", value: EVENT.city },
];

function StoryReader(props: {
	page: number;
	onSelectPage: (page: number) => void;
	onSkip: () => void;
}) {
	const { page, onSelectPage, onSkip } = props;
	const beat = STORY_BEATS[page];
	const meta = BEAT_META[page % BEAT_META.length];
	const Icon = meta.Icon;

	return (
		<main className="flex min-h-screen flex-col bg-gradient-to-b from-rose-50 via-amber-50 to-sky-50 text-amber-950">
			<header className="flex items-center justify-between px-4 py-4 sm:px-6">
				<Badge
					variant="outline"
					className="gap-1.5 rounded-full border-rose-200 bg-white/70 px-3 py-1 text-rose-500"
				>
					<BookOpen aria-hidden className="size-3.5" />
					The Cozy Casebook
				</Badge>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onSkip}
					className="rounded-full text-rose-500 hover:bg-rose-100 hover:text-rose-600"
				>
					Skip to RSVP
					<ArrowRight aria-hidden />
				</Button>
			</header>

			<div className="flex flex-1 items-center justify-center px-4 py-6">
				<article
					key={page}
					className={`w-full max-w-lg rounded-3xl bg-white/80 p-5 shadow-xl shadow-rose-100 ring-1 ring-rose-100 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-8 motion-safe:duration-500 sm:p-8 ${BOUNCE}`}
				>
					<div
						className={`grid h-52 place-items-center rounded-3xl sm:h-64 ${meta.wash}`}
					>
						<Icon
							aria-hidden
							className={`size-20 sm:size-24 ${meta.tint}`}
							strokeWidth={1.25}
						/>
					</div>
					<div className="mt-6 space-y-3 text-center">
						<Badge
							variant="secondary"
							className="rounded-full bg-amber-100 text-amber-700"
						>
							{beat.kicker}
						</Badge>
						<h2 className="display-title text-3xl italic text-rose-950 sm:text-4xl">
							{beat.title}
						</h2>
						<p className="leading-relaxed text-amber-950/70">{beat.body}</p>
					</div>
				</article>
			</div>

			<footer className="flex flex-col items-center gap-3 pb-8">
				<div className="flex items-center gap-2">
					{STORY_BEATS.map((b, i) => (
						<button
							key={b.kicker}
							type="button"
							onClick={() => onSelectPage(i)}
							aria-label={`Go to page ${i + 1}`}
							aria-current={i === page ? "page" : undefined}
							className={`h-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 motion-safe:transition-all ${
								i === page
									? "w-7 bg-rose-400"
									: "w-2.5 bg-rose-200 hover:bg-rose-300"
							}`}
						/>
					))}
				</div>
				<p className="text-xs text-amber-950/50">
					Page {page + 1} of {STORY_BEATS.length}
				</p>
			</footer>
		</main>
	);
}

function RevealRow(props: {
	Icon: LucideIcon;
	label: string;
	children: ReactNode;
}) {
	const { Icon, label, children } = props;
	return (
		<div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
			<span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
				<Icon aria-hidden className="size-4" />
			</span>
			<div className="min-w-0">
				<dt className="text-xs font-medium uppercase tracking-wide text-amber-950/50">
					{label}
				</dt>
				<dd className="mt-0.5 text-sm text-amber-950/80">{children}</dd>
			</div>
		</div>
	);
}

function Reveal({ rsvp }: { rsvp: RsvpDto }) {
	return (
		<div className="space-y-6">
			<div className="space-y-3 text-center">
				<Badge
					variant="secondary"
					className="gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-rose-600"
				>
					<PartyPopper aria-hidden className="size-3.5" />
					{COPY.revealKicker}
				</Badge>
				<h3 className="display-title text-3xl italic text-rose-950">
					{COPY.revealTitle}
				</h3>
				<p className="mx-auto max-w-sm text-amber-950/70">{COPY.revealBody}</p>
				<div className="flex flex-wrap items-center justify-center gap-2">
					<Badge
						variant="outline"
						className="rounded-full border-amber-200 bg-white/70 px-3 py-1 text-amber-700"
					>
						{rsvp.name}
					</Badge>
					<Badge
						variant="outline"
						className="rounded-full border-amber-200 bg-white/70 px-3 py-1 text-amber-700"
					>
						{COPY.partySizeOptions[rsvp.partySize - 1]}
					</Badge>
					{rsvp.theory ? (
						<Badge
							variant="outline"
							className={`rounded-full px-3 py-1 ${
								rsvp.theory === "girl"
									? "border-rose-300 bg-rose-200 text-rose-900"
									: "border-sky-300 bg-sky-200 text-sky-900"
							}`}
						>
							{rsvp.theory === "girl" ? COPY.theoryGirl : COPY.theoryBoy}
						</Badge>
					) : null}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<img
					src={ASSETS.venueExterior}
					alt={EVENT.venue}
					className="h-32 w-full rounded-2xl object-cover ring-4 ring-white sm:h-40"
				/>
				<img
					src={ASSETS.venueInterior}
					alt={`Inside ${EVENT.venue}`}
					className="h-32 w-full rounded-2xl object-cover ring-4 ring-white sm:h-40"
				/>
			</div>

			<div className="rounded-3xl border-2 border-dashed border-rose-300 bg-white/90 p-5 shadow-xl shadow-rose-100 sm:p-6">
				<dl className="divide-y divide-amber-100">
					<RevealRow Icon={MapPin} label={COPY.venueLabel}>
						<span className="font-medium text-rose-950">{EVENT.venue}</span>
					</RevealRow>
					<RevealRow Icon={Calendar} label={COPY.dateLabel}>
						{EVENT.dateLong}
					</RevealRow>
					<RevealRow Icon={Clock} label={COPY.timeLabel}>
						{EVENT.timeRange}
					</RevealRow>
					<RevealRow Icon={ExternalLink} label={COPY.addressLabel}>
						<a
							href={EVENT.mapsUrl}
							target="_blank"
							rel="noreferrer"
							aria-label={COPY.openInMaps}
							className="font-medium text-sky-600 underline underline-offset-4 hover:text-sky-700"
						>
							{EVENT.address}
						</a>
					</RevealRow>
					<RevealRow Icon={Shirt} label={COPY.dressCodeLabel}>
						{EVENT.dressCode}
					</RevealRow>
					<RevealRow Icon={Gift} label={COPY.registryLabel}>
						<span>
							{EVENT.registryNote}{" "}
							<a
								href={EVENT.registryUrl}
								className="font-medium text-rose-500 underline underline-offset-4 hover:text-rose-600"
							>
								{COPY.registryCta}
							</a>
						</span>
					</RevealRow>
				</dl>
			</div>

			<p className="display-title pt-2 text-center text-2xl italic text-rose-400">
				The End... for now
			</p>
		</div>
	);
}

function DeclinedNote() {
	return (
		<div className="space-y-4 py-4 text-center">
			<span className="mx-auto grid size-14 place-items-center rounded-full bg-rose-100 text-rose-400">
				<Heart aria-hidden className="size-7" />
			</span>
			<h3 className="display-title text-2xl italic text-rose-950">
				{COPY.declinedTitle}
			</h3>
			<p className="mx-auto max-w-sm text-amber-950/70">{COPY.declinedBody}</p>
		</div>
	);
}

function AlreadyConfirmed(props: {
	rsvp: RsvpDto;
	error: string | null;
	onChange: () => void;
}) {
	const { rsvp, error, onChange } = props;
	return (
		<div className="space-y-5 text-center">
			<span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-100 text-amber-600">
				<MailQuestion aria-hidden className="size-7" />
			</span>
			<div className="space-y-2">
				<h3 className="display-title text-2xl italic text-rose-950">
					{COPY.alreadyConfirmedTitle}
				</h3>
				<p className="mx-auto max-w-sm text-sm text-amber-950/70">
					{COPY.alreadyConfirmedBody}
				</p>
			</div>
			<dl className="mx-auto max-w-xs space-y-2 rounded-3xl bg-white/80 p-4 text-left ring-1 ring-amber-100">
				<div className="flex items-center justify-between gap-3">
					<dt className="text-xs text-amber-950/50">{COPY.nameLabel}</dt>
					<dd className="text-sm font-medium text-rose-950">{rsvp.name}</dd>
				</div>
				<div className="flex items-center justify-between gap-3">
					<dt className="text-xs text-amber-950/50">{COPY.attendingLabel}</dt>
					<dd className="text-sm font-medium text-rose-950">
						{rsvp.attending ? COPY.attendingYes : COPY.attendingNo}
					</dd>
				</div>
				<div className="flex items-center justify-between gap-3">
					<dt className="text-xs text-amber-950/50">{COPY.partySizeLabel}</dt>
					<dd className="text-sm font-medium text-rose-950">
						{COPY.partySizeOptions[rsvp.partySize - 1]}
					</dd>
				</div>
				{rsvp.theory ? (
					<div className="flex items-center justify-between gap-3">
						<dt className="text-xs text-amber-950/50">{COPY.theoryLabel}</dt>
						<dd>
							<Badge
								variant="outline"
								className={`rounded-full px-3 py-1 ${
									rsvp.theory === "girl"
										? "border-rose-300 bg-rose-200 text-rose-900"
										: "border-sky-300 bg-sky-200 text-sky-900"
								}`}
							>
								{rsvp.theory === "girl" ? COPY.theoryGirl : COPY.theoryBoy}
							</Badge>
						</dd>
					</div>
				) : null}
			</dl>
			{error ? (
				<p role="alert" className="text-sm text-rose-600">
					{COPY.errorGeneric}
				</p>
			) : null}
			<Button
				type="button"
				variant="outline"
				onClick={onChange}
				className="rounded-full border-rose-200 text-rose-500 hover:bg-rose-50"
			>
				<Pencil aria-hidden />
				{COPY.changeRsvp}
			</Button>
		</div>
	);
}

export function VariantStorybook() {
	const { phase, rsvp, error, submit, update, retrieve, changeRsvp } =
		useRsvpFlow();

	const [reading, setReading] = useState(true);
	const [page, setPage] = useState(0);
	const [name, setName] = useState("");
	const [attending, setAttending] = useState<boolean | null>(null);
	const [partySize, setPartySize] = useState(1);
	const [theory, setTheory] = useState<"girl" | "boy" | null>(null);
	const [website, setWebsite] = useState("");
	const [showRetrieval, setShowRetrieval] = useState(false);
	const [retrievalName, setRetrievalName] = useState("");

	const rsvpRef = useRef<HTMLElement | null>(null);
	const busy = phase === "submitting";
	const showForm = phase === "idle" || phase === "submitting";

	useEffect(() => {
		if (!reading) return;
		const id = setTimeout(() => {
			if (page >= STORY_BEATS.length - 1) {
				setReading(false);
			} else {
				setPage((p) => p + 1);
			}
		}, PAGE_MS);
		return () => clearTimeout(id);
	}, [reading, page]);

	function scrollToRsvp() {
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		rsvpRef.current?.scrollIntoView({
			behavior: reduce ? "auto" : "smooth",
			block: "start",
		});
	}

	function skipToRsvp() {
		setReading(false);
		setTimeout(scrollToRsvp, 120);
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (attending === null) return;
		const input = {
			name: name.trim(),
			attending,
			partySize,
			theory,
			website,
		};
		if (rsvp) {
			void update(input);
		} else {
			void submit(input);
		}
	}

	function handleRetrieve() {
		if (retrievalName.trim().length < 2) return;
		void retrieve(retrievalName.trim());
	}

	function handleChangeRsvp() {
		if (rsvp) {
			setName(rsvp.name);
			setAttending(rsvp.attending);
			setPartySize(rsvp.partySize);
			setTheory(rsvp.theory);
		}
		changeRsvp();
	}

	if (reading) {
		return (
			<StoryReader page={page} onSelectPage={setPage} onSkip={skipToRsvp} />
		);
	}

	return (
		<main className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50 to-sky-50 pb-28 text-amber-950">
			<section className="mx-auto flex max-w-xl flex-col items-center px-4 pt-14 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500">
				<Badge
					variant="outline"
					className="rounded-full border-rose-200 bg-white/70 px-3 py-1 text-rose-500"
				>
					{EVENT.caseNumber}
				</Badge>
				<div className="mt-8 w-52 overflow-hidden rounded-t-full shadow-xl shadow-rose-100 ring-4 ring-white sm:w-64">
					<img
						src={ASSETS.hero}
						alt={EVENT.parents}
						className="aspect-[3/4] w-full object-cover"
					/>
				</div>
				<h1 className="display-title mt-8 text-4xl italic text-rose-950 sm:text-5xl">
					{EVENT.parents}
				</h1>
				<p className="mt-3 max-w-md leading-relaxed text-amber-950/70">
					{STORY_BEATS[0].body}
				</p>

				<div className="mt-8 w-full rounded-3xl bg-white/80 p-6 text-left shadow-xl shadow-rose-100 ring-1 ring-rose-100">
					<dl className="space-y-4">
						{FACTS.map((f) => (
							<div key={f.label} className="flex items-center gap-3">
								<span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
									<f.Icon aria-hidden className="size-4.5" />
								</span>
								<div>
									<dt className="text-xs font-medium uppercase tracking-wide text-amber-950/50">
										{f.label}
									</dt>
									<dd className="text-sm font-medium text-rose-950">
										{f.value}
									</dd>
								</div>
							</div>
						))}
					</dl>
					<Button
						type="button"
						size="lg"
						onClick={scrollToRsvp}
						className="mt-6 w-full rounded-full bg-rose-400 text-white hover:bg-rose-500"
					>
						{COPY.rsvpTitle}
						<ArrowRight aria-hidden />
					</Button>
				</div>
			</section>

			<section className="mx-auto max-w-xl px-4 py-16 text-center">
				<Badge
					variant="secondary"
					className="rounded-full bg-amber-100 text-amber-700"
				>
					Exhibit A
				</Badge>
				<h2 className="display-title mt-3 text-3xl italic text-rose-950">
					The littlest suspect
				</h2>
				<div className="mx-auto mt-8 w-52 overflow-hidden rounded-t-full shadow-xl shadow-rose-100 ring-4 ring-white sm:w-60">
					<img
						src={ASSETS.ultrasound}
						alt="Exhibit A: the littlest suspect"
						className="aspect-[3/4] w-full object-cover"
					/>
				</div>
				<p className="mx-auto mt-4 max-w-xs text-sm text-amber-950/60">
					One photo, zero answers. The file stays sealed until the party.
				</p>
			</section>

			<section className="mx-auto max-w-3xl px-4 py-4">
				<div className="text-center">
					<Badge
						variant="secondary"
						className="rounded-full bg-amber-100 text-amber-700"
					>
						{STORY_BEATS[2].kicker}
					</Badge>
					<h2 className="display-title mt-3 text-3xl italic text-rose-950">
						{STORY_BEATS[2].title}
					</h2>
					<p className="mx-auto mt-3 max-w-md text-amber-950/70">
						{STORY_BEATS[2].body}
					</p>
				</div>
				<div className="mt-8 grid gap-4 sm:grid-cols-3">
					{WITNESSES.map((w, i) => {
						const meta = WITNESS_META[i % WITNESS_META.length];
						const Icon = meta.Icon;
						return (
							<Card
								key={w.id}
								className={`rounded-3xl border-0 bg-white/80 text-center shadow-xl shadow-rose-100 ring-rose-100 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:fill-mode-both ${STAGGER[i % STAGGER.length]}`}
							>
								<CardContent className="space-y-3">
									<Avatar className="mx-auto size-16 shadow-lg shadow-rose-100 ring-4 ring-white">
										<AvatarFallback className={meta.disc}>
											<Icon aria-hidden className="size-7" />
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="display-title text-lg italic text-rose-950">
											{w.name}
										</p>
										<Badge
											variant="secondary"
											className="mt-1 rounded-full bg-amber-100 text-amber-700"
										>
											{w.role}
										</Badge>
									</div>
									<p className="text-sm leading-relaxed text-amber-950/70">
										{w.detail}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			<section className="mx-auto max-w-2xl px-4 py-16">
				<div className="overflow-hidden rounded-3xl shadow-xl shadow-rose-100 ring-4 ring-white">
					<img
						src={ASSETS.secondary}
						alt={EVENT.parents}
						className="h-56 w-full object-cover sm:h-72"
					/>
				</div>
			</section>

			<section ref={rsvpRef} className="mx-auto max-w-xl scroll-mt-6 px-4">
				<div className="mb-6 text-center">
					<Badge
						variant="outline"
						className="rounded-full border-amber-200 bg-white/70 px-3 py-1 text-amber-600"
					>
						{COPY.rsvpKicker}
					</Badge>
					<h2 className="display-title mt-3 text-3xl italic text-rose-950 sm:text-4xl">
						{COPY.rsvpTitle}
					</h2>
				</div>

				<Card className="rounded-3xl border-0 bg-[#fffaf0] shadow-xl shadow-rose-100 ring-amber-100">
					<CardContent className="space-y-6">
						{phase === "confirmed" && rsvp ? (
							<Reveal rsvp={rsvp} />
						) : phase === "declined" ? (
							<DeclinedNote />
						) : phase === "already-confirmed" && rsvp ? (
							<AlreadyConfirmed
								rsvp={rsvp}
								error={error}
								onChange={handleChangeRsvp}
							/>
						) : null}

						{showForm ? (
							<>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="space-y-2">
										<Label htmlFor="casebook-name" className="text-amber-950">
											{COPY.nameLabel}
										</Label>
										<Input
											id="casebook-name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder={COPY.namePlaceholder}
											autoComplete="name"
											required
											minLength={2}
											maxLength={80}
											disabled={busy}
											className="rounded-full border-amber-200 bg-white/80"
										/>
										<p className="text-xs text-amber-950/50">
											So we know who is on the case.
										</p>
									</div>

									<input
										type="text"
										name="website"
										value={website}
										onChange={(e) => setWebsite(e.target.value)}
										className="hidden"
										aria-hidden="true"
										tabIndex={-1}
										autoComplete="off"
									/>

									<div className="space-y-2">
										<p
											id="casebook-attending-label"
											className="text-sm leading-none font-medium text-amber-950"
										>
											{COPY.attendingLabel}
										</p>
										<RadioGroup
											aria-labelledby="casebook-attending-label"
											value={attending === null ? "" : attending ? "yes" : "no"}
											onValueChange={(v) => setAttending(v === "yes")}
											disabled={busy}
											className="grid gap-2 sm:grid-cols-2"
										>
											<div
												className={`flex items-center gap-3 rounded-2xl border px-4 py-3 motion-safe:transition-colors ${
													attending === true
														? "border-rose-300 bg-rose-50"
														: "border-amber-200 bg-white/70 hover:border-rose-200"
												}`}
											>
												<RadioGroupItem
													type="button"
													id="casebook-attending-yes"
													value="yes"
													className="data-checked:border-rose-400 data-checked:bg-rose-400"
												/>
												<Label
													htmlFor="casebook-attending-yes"
													className="flex-1 cursor-pointer text-sm font-normal text-amber-950/80"
												>
													{COPY.attendingYes}
												</Label>
											</div>
											<div
												className={`flex items-center gap-3 rounded-2xl border px-4 py-3 motion-safe:transition-colors ${
													attending === false
														? "border-rose-300 bg-rose-50"
														: "border-amber-200 bg-white/70 hover:border-rose-200"
												}`}
											>
												<RadioGroupItem
													type="button"
													id="casebook-attending-no"
													value="no"
													className="data-checked:border-rose-400 data-checked:bg-rose-400"
												/>
												<Label
													htmlFor="casebook-attending-no"
													className="flex-1 cursor-pointer text-sm font-normal text-amber-950/80"
												>
													{COPY.attendingNo}
												</Label>
											</div>
										</RadioGroup>
									</div>

									<div className="space-y-2">
										<p
											id="casebook-party-size-label"
											className="text-sm leading-none font-medium text-amber-950"
										>
											{COPY.partySizeLabel}
										</p>
										<ToggleGroup
											type="single"
											aria-labelledby="casebook-party-size-label"
											value={String(partySize)}
											onValueChange={(v) => {
												if (v) setPartySize(Number(v));
											}}
											disabled={busy}
											className="flex w-full flex-wrap gap-2"
										>
											{COPY.partySizeOptions.map((opt, i) => (
												<ToggleGroupItem
													key={opt}
													type="button"
													value={String(i + 1)}
													className="flex-1 rounded-full border border-amber-200 bg-white/70 px-3 whitespace-nowrap text-amber-900 data-[state=on]:border-amber-300 data-[state=on]:bg-amber-200 data-[state=on]:text-amber-950"
												>
													{opt}
												</ToggleGroupItem>
											))}
										</ToggleGroup>
										<p className="text-xs text-amber-950/50">
											Count yourself in: 1 is just you, 4 is you plus three.
										</p>
									</div>

									<div className="space-y-2">
										<p
											id="casebook-theory-label"
											className="text-sm leading-none font-medium text-amber-950"
										>
											{COPY.theoryLabel}
										</p>
										<ToggleGroup
											type="single"
											aria-labelledby="casebook-theory-label"
											value={theory ?? ""}
											onValueChange={(v) =>
												setTheory(v === "" ? null : (v as "girl" | "boy"))
											}
											disabled={busy}
											className="flex w-full gap-2"
										>
											<ToggleGroupItem
												type="button"
												value="girl"
												className="flex-1 rounded-full border border-rose-200 bg-white/70 data-[state=on]:border-rose-300 data-[state=on]:bg-rose-200 data-[state=on]:text-rose-900"
											>
												{COPY.theoryGirl}
											</ToggleGroupItem>
											<ToggleGroupItem
												type="button"
												value="boy"
												className="flex-1 rounded-full border border-sky-200 bg-white/70 data-[state=on]:border-sky-300 data-[state=on]:bg-sky-200 data-[state=on]:text-sky-900"
											>
												{COPY.theoryBoy}
											</ToggleGroupItem>
										</ToggleGroup>
										<p className="text-xs text-amber-950/50">
											Tap again to take it back. No pressure, detective.
										</p>
									</div>

									{error && error !== "not-found" ? (
										<p
											role="alert"
											className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600"
										>
											{COPY.errorGeneric}
										</p>
									) : null}

									<Button
										type="submit"
										size="lg"
										disabled={
											busy || attending === null || name.trim().length < 2
										}
										className="w-full rounded-full bg-rose-400 text-white hover:bg-rose-500"
									>
										{busy ? COPY.submitting : rsvp ? COPY.update : COPY.submit}
									</Button>
								</form>

								<Separator className="bg-amber-100" />

								<div className="space-y-3">
									<button
										type="button"
										onClick={() => setShowRetrieval((s) => !s)}
										className="rounded text-sm font-medium text-rose-500 underline underline-offset-4 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
									>
										{COPY.retrievalLink}
									</button>
									{showRetrieval ? (
										<div className="flex flex-col gap-2 sm:flex-row">
											<Input
												value={retrievalName}
												onChange={(e) => setRetrievalName(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleRetrieve();
													}
												}}
												placeholder={COPY.retrievalLabel}
												aria-label={COPY.retrievalLabel}
												disabled={busy}
												className="rounded-full border-amber-200 bg-white/80"
											/>
											<Button
												type="button"
												variant="outline"
												onClick={handleRetrieve}
												disabled={busy || retrievalName.trim().length < 2}
												className="rounded-full border-rose-200 text-rose-500 hover:bg-rose-50"
											>
												{COPY.retrievalSubmit}
											</Button>
										</div>
									) : null}
									{showRetrieval && error === "not-found" ? (
										<p role="alert" className="text-sm text-rose-600">
											{COPY.retrievalNotFound}
										</p>
									) : null}
								</div>
							</>
						) : null}
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
