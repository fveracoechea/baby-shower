import {
	Balloon,
	CakeSlice,
	Calendar,
	Clock,
	ExternalLink,
	Gift,
	KeyRound,
	MailOpen,
	MapPin,
	Shirt,
	Stethoscope,
	Users,
} from "lucide-react";
import {
	type FormEvent,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import {
	ASSETS,
	COPY,
	EVENT,
	STORY_BEATS,
	WITNESSES,
} from "#/components/prototype/mystery/content";
import { useRsvpFlow } from "#/components/prototype/mystery/use-rsvp-flow";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { Separator } from "#/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import type { RsvpDto, RsvpInput } from "#/lib/rsvp";

const BEAT_MS = 3000;
const BEAT_FADE_MS = 500;

const BRASS_TEXT =
	"bg-gradient-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent";
const DECO_FRAME =
	"border border-amber-200/40 outline outline-1 outline-amber-200/25 outline-offset-4";
const KICKER = "font-mono text-xs uppercase tracking-widest text-amber-200/70";
const SECTION_TITLE = `display-title mt-3 text-3xl uppercase tracking-widest sm:text-4xl ${BRASS_TEXT}`;

const WITNESS_ICONS = [Stethoscope, Balloon, CakeSlice] as const;
const WITNESS_TILTS = [
	"motion-safe:-rotate-2",
	"motion-safe:rotate-1",
	"motion-safe:rotate-3",
] as const;
const WITNESS_DELAYS = [
	"motion-safe:delay-150",
	"motion-safe:delay-300",
	"motion-safe:delay-500",
] as const;
const FAN_DIAMONDS = [
	"outer-left",
	"inner-left",
	"center",
	"inner-right",
	"outer-right",
] as const;
const CORNERS = [
	"-top-1 -left-1",
	"-top-1 -right-1",
	"-bottom-1 -left-1",
	"-bottom-1 -right-1",
] as const;

/** Four small rotated squares pinning the corners of a deco frame. */
function CornerDiamonds({ tone = "bg-amber-300/50" }: { tone?: string }) {
	return (
		<>
			{CORNERS.map((corner) => (
				<span
					key={corner}
					aria-hidden="true"
					className={`pointer-events-none absolute z-10 size-2 rotate-45 ${tone} ${corner}`}
				/>
			))}
		</>
	);
}

/** Fan-like divider row: hairlines with five graduated diamonds. */
function FanDivider() {
	return (
		<div aria-hidden="true" className="flex items-center justify-center gap-3">
			<span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/50" />
			{FAN_DIAMONDS.map((slot) => (
				<span
					key={slot}
					className={`rotate-45 ${slot === "center" ? "size-2 bg-amber-300/80" : "size-1.5 bg-amber-300/40"}`}
				/>
			))}
			<span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/50" />
		</div>
	);
}

function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The whodunit title sequence: STORY_BEATS dealt one card at a time,
 * fading through black, with a diamond progress row and a skip control.
 */
function TitleSequence({ onDone }: { onDone: (toRsvp: boolean) => void }) {
	const [beat, setBeat] = useState(0);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const fadeTimer = setTimeout(
			() => setVisible(false),
			BEAT_MS - BEAT_FADE_MS,
		);
		const nextTimer = setTimeout(() => {
			if (beat + 1 >= STORY_BEATS.length) {
				onDone(false);
			} else {
				setBeat(beat + 1);
				setVisible(true);
			}
		}, BEAT_MS);
		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(nextTimer);
		};
	}, [beat, onDone]);

	const current = STORY_BEATS[beat];

	return (
		<main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-6 py-16 text-amber-50">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.08),transparent_60%)]"
			/>
			<Button
				type="button"
				variant="outline"
				onClick={() => onDone(true)}
				className="absolute top-6 right-6 rounded-none border-amber-200/40 bg-transparent font-mono text-xs uppercase tracking-widest text-amber-100 hover:bg-amber-200/10 hover:text-amber-50"
			>
				Skip to RSVP
			</Button>
			<div aria-live="polite" className="w-full max-w-2xl">
				<div
					className={`relative border border-amber-200/30 bg-black/40 px-6 py-12 text-center outline outline-1 outline-amber-200/15 outline-offset-8 sm:px-12 motion-safe:transition-opacity motion-safe:duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
				>
					<CornerDiamonds />
					<p className={KICKER}>{current.kicker}</p>
					<h1
						className={`display-title mt-4 text-3xl uppercase tracking-widest sm:text-5xl ${BRASS_TEXT}`}
					>
						{current.title}
					</h1>
					<p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-amber-100/80 sm:text-base">
						{current.body}
					</p>
				</div>
				<div
					aria-hidden="true"
					className="mt-8 flex items-center justify-center gap-2"
				>
					{STORY_BEATS.map((storyBeat, index) => (
						<span
							key={storyBeat.kicker}
							className={`size-1.5 rotate-45 ${
								index < beat
									? "bg-amber-300"
									: index === beat
										? "bg-amber-300 motion-safe:animate-pulse"
										: "bg-amber-300/25"
							}`}
						/>
					))}
				</div>
				<span className="sr-only">
					Title card {beat + 1} of {STORY_BEATS.length}
				</span>
			</div>
		</main>
	);
}

/** One radio choice rendered as an engraved selectable row. */
function ChoiceRow({ value, label }: { value: string; label: string }) {
	return (
		<Label className="flex cursor-pointer items-center gap-3 border border-emerald-900/25 bg-white/50 px-3 py-2.5 text-sm font-normal text-emerald-950 has-data-[checked]:border-emerald-900 has-data-[checked]:bg-emerald-900/10">
			<RadioGroupItem
				value={value}
				className="border-emerald-900/40 data-checked:border-emerald-900 data-checked:bg-emerald-900 data-checked:text-amber-50"
			/>
			{label}
		</Label>
	);
}

function FieldLegend({ children }: { children: string }) {
	return (
		<legend className="mb-2 font-mono text-xs uppercase tracking-widest text-emerald-900/80">
			{children}
		</legend>
	);
}

/** The RSVP form as an engraved invitation card laid on the table. */
function EngravedForm({
	initial,
	submitting,
	error,
	onSubmit,
	onUpdate,
	onRetrieve,
}: {
	initial: RsvpDto | null;
	submitting: boolean;
	error: string | null;
	onSubmit: (input: RsvpInput) => void;
	onUpdate: (input: RsvpInput) => void;
	onRetrieve: (name: string) => void;
}) {
	const [name, setName] = useState(initial?.name ?? "");
	const [attending, setAttending] = useState<"yes" | "no" | "">(
		initial ? (initial.attending ? "yes" : "no") : "",
	);
	const [partySize, setPartySize] = useState(String(initial?.partySize ?? 1));
	const [theory, setTheory] = useState<"girl" | "boy" | null>(
		initial?.theory ?? null,
	);
	const [website, setWebsite] = useState("");
	const [retrievalOpen, setRetrievalOpen] = useState(false);
	const [retrievalName, setRetrievalName] = useState("");

	const isUpdate = initial !== null;

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (attending === "") return;
		const input: RsvpInput = {
			name,
			attending: attending === "yes",
			partySize: Number(partySize),
			theory,
			website,
		};
		if (isUpdate) {
			onUpdate(input);
		} else {
			onSubmit(input);
		}
	}

	function handleRetrieve(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (retrievalName.trim().length >= 2) onRetrieve(retrievalName.trim());
	}

	return (
		<Card className="relative overflow-visible rounded-none border border-amber-200/60 bg-[#f7f0dd] text-emerald-950 shadow-2xl ring-0 outline outline-1 outline-amber-200/40 outline-offset-4">
			<CornerDiamonds tone="bg-amber-600/60" />
			<CardHeader className="items-center text-center">
				<p className="font-mono text-[10px] uppercase tracking-widest text-emerald-900/60">
					{EVENT.caseNumber}
				</p>
				<h3 className="display-title text-xl uppercase tracking-widest text-emerald-950">
					{COPY.rsvpTitle}
				</h3>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label
							htmlFor="mansion-name"
							className="font-mono text-xs uppercase tracking-widest text-emerald-900/80"
						>
							{COPY.nameLabel}
						</Label>
						<Input
							id="mansion-name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder={COPY.namePlaceholder}
							required
							minLength={2}
							autoComplete="name"
							className="rounded-none border-emerald-900/30 bg-white/70 text-emerald-950 placeholder:text-emerald-900/40"
						/>
					</div>

					<fieldset>
						<FieldLegend>{COPY.attendingLabel}</FieldLegend>
						<RadioGroup
							value={attending}
							onValueChange={(value) => setAttending(value as "yes" | "no")}
							className="grid gap-2 sm:grid-cols-2"
						>
							<ChoiceRow value="yes" label={COPY.attendingYes} />
							<ChoiceRow value="no" label={COPY.attendingNo} />
						</RadioGroup>
					</fieldset>

					<fieldset>
						<FieldLegend>{COPY.partySizeLabel}</FieldLegend>
						<RadioGroup
							value={partySize}
							onValueChange={setPartySize}
							className="grid grid-cols-2 gap-2 sm:grid-cols-4"
						>
							{COPY.partySizeOptions.map((label, index) => (
								<ChoiceRow
									key={label}
									value={String(index + 1)}
									label={label}
								/>
							))}
						</RadioGroup>
					</fieldset>

					<fieldset>
						<FieldLegend>{COPY.theoryLabel}</FieldLegend>
						<ToggleGroup
							type="single"
							value={theory ?? ""}
							onValueChange={(value) =>
								setTheory(value === "girl" || value === "boy" ? value : null)
							}
							className="grid grid-cols-2 gap-2"
						>
							<ToggleGroupItem
								value="girl"
								className="rounded-none border border-emerald-900/25 bg-white/50 text-emerald-950 hover:bg-emerald-900/5 data-[state=on]:border-emerald-900 data-[state=on]:bg-emerald-900 data-[state=on]:text-amber-50"
							>
								{COPY.theoryGirl}
							</ToggleGroupItem>
							<ToggleGroupItem
								value="boy"
								className="rounded-none border border-emerald-900/25 bg-white/50 text-emerald-950 hover:bg-emerald-900/5 data-[state=on]:border-emerald-900 data-[state=on]:bg-emerald-900 data-[state=on]:text-amber-50"
							>
								{COPY.theoryBoy}
							</ToggleGroupItem>
						</ToggleGroup>
					</fieldset>

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

					{error && error !== "not-found" && (
						<p
							role="alert"
							className="border border-red-900/30 bg-red-900/10 px-3 py-2 text-sm text-red-900"
						>
							{COPY.errorGeneric}
						</p>
					)}

					<Button
						type="submit"
						disabled={submitting || attending === "" || name.trim().length < 2}
						className="w-full rounded-none bg-emerald-900 font-mono text-xs uppercase tracking-widest text-amber-100 hover:bg-emerald-800"
					>
						{submitting
							? COPY.submitting
							: isUpdate
								? COPY.update
								: COPY.submit}
					</Button>
				</form>

				{!isUpdate && (
					<>
						<Separator className="my-6 bg-emerald-900/20" />
						{retrievalOpen ? (
							<form onSubmit={handleRetrieve} className="space-y-3">
								<Label
									htmlFor="mansion-retrieve"
									className="font-mono text-xs uppercase tracking-widest text-emerald-900/80"
								>
									{COPY.retrievalLabel}
								</Label>
								<div className="flex flex-col gap-2 sm:flex-row">
									<Input
										id="mansion-retrieve"
										value={retrievalName}
										onChange={(event) => setRetrievalName(event.target.value)}
										autoComplete="name"
										className="rounded-none border-emerald-900/30 bg-white/70 text-emerald-950 placeholder:text-emerald-900/40"
									/>
									<Button
										type="submit"
										disabled={submitting || retrievalName.trim().length < 2}
										className="rounded-none bg-emerald-900 font-mono text-xs uppercase tracking-widest text-amber-100 hover:bg-emerald-800"
									>
										{COPY.retrievalSubmit}
									</Button>
								</div>
								{error === "not-found" && (
									<p role="alert" className="text-sm text-red-900">
										{COPY.retrievalNotFound}
									</p>
								)}
							</form>
						) : (
							<Button
								type="button"
								variant="ghost"
								onClick={() => setRetrievalOpen(true)}
								className="w-full rounded-none font-mono text-xs uppercase tracking-widest text-emerald-900/80 hover:bg-emerald-900/5 hover:text-emerald-900"
							>
								<KeyRound aria-hidden="true" />
								{COPY.retrievalLink}
							</Button>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

function RevealFact({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div>
			<dt className="font-mono text-[10px] uppercase tracking-widest text-amber-200/60">
				{label}
			</dt>
			<dd className="mt-1 text-sm text-amber-100">{children}</dd>
		</div>
	);
}

/** The gilt-edged card that rises from the envelope once the RSVP is filed. */
function RevealCard({ rsvp }: { rsvp: RsvpDto }) {
	return (
		<div className="relative pt-8">
			<span
				aria-hidden="true"
				className="absolute top-0 left-1/2 z-10 grid size-12 -translate-x-1/2 rotate-45 place-items-center border border-amber-300/60 bg-emerald-900"
			>
				<MailOpen className="size-5 -rotate-45 text-amber-200" />
			</span>
			<Card className="relative overflow-visible rounded-none border border-amber-300/60 bg-emerald-950/90 text-amber-50 ring-0 outline outline-1 outline-amber-300/40 outline-offset-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-8 motion-safe:zoom-in-95 motion-safe:duration-700">
				<CornerDiamonds />
				<CardHeader className="items-center text-center">
					<p className={KICKER}>{COPY.revealKicker}</p>
					<h3
						className={`display-title text-2xl uppercase tracking-widest sm:text-3xl ${BRASS_TEXT}`}
					>
						{COPY.revealTitle}
					</h3>
					<p className="max-w-md text-sm text-amber-100/80">
						{COPY.revealBody}
					</p>
					<div className="flex flex-wrap justify-center gap-2 pt-2">
						<Badge
							variant="outline"
							className="rounded-none border-amber-200/40 bg-transparent font-mono text-xs uppercase tracking-widest text-amber-100"
						>
							{rsvp.name}
						</Badge>
						<Badge
							variant="outline"
							className="rounded-none border-amber-200/40 bg-transparent font-mono text-xs uppercase tracking-widest text-amber-100"
						>
							<Users aria-hidden="true" />
							{COPY.partySizeOptions[rsvp.partySize - 1]}
						</Badge>
						{rsvp.theory && (
							<Badge
								variant="outline"
								className="rounded-none border-amber-200/40 bg-transparent font-mono text-xs uppercase tracking-widest text-amber-100"
							>
								{rsvp.theory === "girl" ? COPY.theoryGirl : COPY.theoryBoy}
							</Badge>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					<Separator className="bg-amber-200/20" />
					<dl className="grid gap-5 sm:grid-cols-2">
						<RevealFact label={COPY.venueLabel}>
							<span className="display-title text-lg uppercase tracking-widest">
								{EVENT.venue}
							</span>
						</RevealFact>
						<RevealFact label={COPY.dateLabel}>{EVENT.dateLong}</RevealFact>
						<RevealFact label={COPY.timeLabel}>{EVENT.timeRange}</RevealFact>
						<RevealFact label={COPY.addressLabel}>
							<a
								href={EVENT.mapsUrl}
								target="_blank"
								rel="noreferrer"
								aria-label={COPY.openInMaps}
								className="inline-flex items-center gap-1.5 underline decoration-amber-300/50 underline-offset-4 motion-safe:transition-colors hover:text-amber-200"
							>
								{EVENT.address}
								<ExternalLink className="size-3.5" aria-hidden="true" />
							</a>
						</RevealFact>
					</dl>
					<div className="grid gap-5 sm:grid-cols-2">
						<div>
							<p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-200/60">
								<Shirt className="size-3.5" aria-hidden="true" />
								{COPY.dressCodeLabel}
							</p>
							<p className="mt-1 text-sm text-amber-100">{EVENT.dressCode}</p>
						</div>
						<div>
							<p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-200/60">
								<Gift className="size-3.5" aria-hidden="true" />
								{COPY.registryLabel}
							</p>
							<p className="mt-1 text-sm text-amber-100">
								{EVENT.registryNote}
							</p>
							<a
								href={EVENT.registryUrl}
								className="mt-1 inline-block text-sm underline decoration-amber-300/50 underline-offset-4 motion-safe:transition-colors hover:text-amber-200"
							>
								{COPY.registryCta}
							</a>
						</div>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<figure className={`relative bg-[#0c1f1a] p-1.5 ${DECO_FRAME}`}>
							<img
								src={ASSETS.venueExterior}
								alt="Provisions Boutique, the venue, from the street"
								className="w-full object-cover sepia-[0.25]"
							/>
						</figure>
						<figure className={`relative bg-[#0c1f1a] p-1.5 ${DECO_FRAME}`}>
							<img
								src={ASSETS.venueInterior}
								alt="Inside Provisions Boutique, set for the party"
								className="w-full object-cover sepia-[0.25]"
							/>
						</figure>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function DeclinedCard({ onChange }: { onChange: () => void }) {
	return (
		<Card className="relative overflow-visible rounded-none border border-amber-200/40 bg-emerald-950/80 text-amber-50 ring-0 outline outline-1 outline-amber-200/25 outline-offset-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
			<CornerDiamonds />
			<CardHeader className="items-center text-center">
				<h3
					className={`display-title text-2xl uppercase tracking-widest ${BRASS_TEXT}`}
				>
					{COPY.declinedTitle}
				</h3>
			</CardHeader>
			<CardContent className="space-y-6 text-center">
				<p className="mx-auto max-w-md text-sm leading-relaxed text-amber-100/80">
					{COPY.declinedBody}
				</p>
				<Button
					type="button"
					variant="outline"
					onClick={onChange}
					className="rounded-none border-amber-200/40 bg-transparent font-mono text-xs uppercase tracking-widest text-amber-100 hover:bg-amber-200/10 hover:text-amber-50"
				>
					{COPY.changeRsvp}
				</Button>
			</CardContent>
		</Card>
	);
}

function AlreadyConfirmedCard({
	rsvp,
	error,
	onChange,
}: {
	rsvp: RsvpDto;
	error: string | null;
	onChange: () => void;
}) {
	return (
		<Card className="relative overflow-visible rounded-none border border-amber-200/40 bg-emerald-950/80 text-amber-50 ring-0 outline outline-1 outline-amber-200/25 outline-offset-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
			<CornerDiamonds />
			<CardHeader className="items-center text-center">
				<h3
					className={`display-title text-2xl uppercase tracking-widest ${BRASS_TEXT}`}
				>
					{COPY.alreadyConfirmedTitle}
				</h3>
				<p className="max-w-md text-sm text-amber-100/80">
					{COPY.alreadyConfirmedBody}
				</p>
			</CardHeader>
			<CardContent className="space-y-6">
				<dl className="grid gap-4 border border-amber-200/20 bg-black/30 p-4 sm:grid-cols-2">
					<RevealFact label={COPY.nameLabel}>{rsvp.name}</RevealFact>
					<RevealFact label={COPY.attendingLabel}>
						{rsvp.attending ? COPY.attendingYes : COPY.attendingNo}
					</RevealFact>
					<RevealFact label={COPY.partySizeLabel}>
						{COPY.partySizeOptions[rsvp.partySize - 1]}
					</RevealFact>
					{rsvp.theory && (
						<RevealFact label={COPY.theoryLabel}>
							{rsvp.theory === "girl" ? COPY.theoryGirl : COPY.theoryBoy}
						</RevealFact>
					)}
				</dl>
				{error && error !== "not-found" && (
					<p role="alert" className="text-sm text-red-300">
						{COPY.errorGeneric}
					</p>
				)}
				<Button
					type="button"
					onClick={onChange}
					className="w-full rounded-none bg-gradient-to-r from-amber-200 to-yellow-600 font-mono text-xs uppercase tracking-widest text-emerald-950 hover:from-amber-100 hover:to-yellow-500"
				>
					{COPY.changeRsvp}
				</Button>
			</CardContent>
		</Card>
	);
}

export function VariantMansion() {
	const { phase, rsvp, error, submit, update, retrieve, changeRsvp } =
		useRsvpFlow();
	const [introDone, setIntroDone] = useState(false);
	const [formEpoch, setFormEpoch] = useState(0);
	const scrollTarget = useRef<"rsvp" | null>(null);
	const rsvpRef = useRef<HTMLElement | null>(null);

	const finishIntro = useCallback((toRsvp: boolean) => {
		scrollTarget.current = toRsvp ? "rsvp" : null;
		setIntroDone(true);
	}, []);

	useEffect(() => {
		if (!introDone) return;
		const landed =
			phase === "confirmed" ||
			phase === "declined" ||
			phase === "already-confirmed";
		if (scrollTarget.current === "rsvp" || landed) {
			scrollTarget.current = null;
			rsvpRef.current?.scrollIntoView({
				behavior: prefersReducedMotion() ? "auto" : "smooth",
				block: "start",
			});
		}
	}, [introDone, phase]);

	const handleChangeRsvp = () => {
		changeRsvp();
		setFormEpoch((epoch) => epoch + 1);
	};

	const scrollToRsvp = () => {
		rsvpRef.current?.scrollIntoView({
			behavior: prefersReducedMotion() ? "auto" : "smooth",
			block: "start",
		});
	};

	if (!introDone) {
		return <TitleSequence onDone={finishIntro} />;
	}

	return (
		<main className="min-h-screen bg-gradient-to-b from-emerald-950 via-[#0c1f1a] to-black text-amber-50">
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.10),transparent_60%)]"
			/>
			<div className="relative mx-auto flex w-full max-w-3xl flex-col gap-20 px-4 py-14 sm:px-6 sm:py-20 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-1000">
				<header className="text-center">
					<p className={KICKER}>{EVENT.caseNumber}</p>
					<h1
						className={`display-title mt-3 text-4xl uppercase tracking-widest sm:text-6xl ${BRASS_TEXT}`}
					>
						{EVENT.parents}
					</h1>
					<div className="mt-6">
						<FanDivider />
					</div>
					<figure
						className={`relative mx-auto mt-10 max-w-xl bg-[#0c1f1a] p-2 ${DECO_FRAME}`}
					>
						<CornerDiamonds />
						<img
							src={ASSETS.hero}
							alt="Nancy and Francisco, the parents-to-be"
							className="w-full object-cover sepia-[0.25]"
						/>
					</figure>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-widest text-amber-100/90">
						<span className="flex items-center gap-2">
							<Calendar
								className="size-4 text-amber-300/80"
								aria-hidden="true"
							/>
							{EVENT.dateLong}
						</span>
						<span className="flex items-center gap-2">
							<Clock className="size-4 text-amber-300/80" aria-hidden="true" />
							{EVENT.timeRange}
						</span>
						<span className="flex items-center gap-2">
							<MapPin className="size-4 text-amber-300/80" aria-hidden="true" />
							{EVENT.city}
						</span>
					</div>
					<Button
						type="button"
						onClick={scrollToRsvp}
						className="mt-8 rounded-none bg-gradient-to-r from-amber-200 to-yellow-600 px-8 font-mono text-xs uppercase tracking-widest text-emerald-950 hover:from-amber-100 hover:to-yellow-500"
					>
						{COPY.rsvpTitle}
					</Button>
				</header>

				<section className="text-center">
					<p className={KICKER}>{STORY_BEATS[1].kicker}</p>
					<h2
						className={`display-title mt-3 text-5xl uppercase tracking-widest sm:text-7xl ${BRASS_TEXT}`}
					>
						{STORY_BEATS[1].title}
					</h2>
					<p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-amber-100/80 sm:text-base">
						{STORY_BEATS[1].body}
					</p>
					<figure
						className={`relative mx-auto mt-10 w-52 bg-[#f7f0dd] p-2 motion-safe:-rotate-1 ${DECO_FRAME}`}
					>
						<CornerDiamonds />
						<img
							src={ASSETS.ultrasound}
							alt="The baby's first ultrasound, pinned to the case file"
							className="w-full object-cover sepia-[0.25]"
						/>
					</figure>
				</section>

				<section>
					<div className="text-center">
						<p className={KICKER}>{STORY_BEATS[2].kicker}</p>
						<h2 className={SECTION_TITLE}>{STORY_BEATS[2].title}</h2>
					</div>
					<ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-5">
						{WITNESSES.map((witness, index) => {
							const Icon = WITNESS_ICONS[index] ?? Stethoscope;
							return (
								<li
									key={witness.id}
									className={`${WITNESS_TILTS[index]} ${WITNESS_DELAYS[index]} motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700`}
								>
									<Card className="relative h-full overflow-visible rounded-none border border-amber-200/40 bg-emerald-950/70 text-amber-50 ring-0 outline outline-1 outline-amber-200/20 outline-offset-4">
										<CornerDiamonds />
										<CardHeader className="items-center gap-3 text-center">
											<span
												aria-hidden="true"
												className="grid size-12 rotate-45 place-items-center border border-amber-300/50 bg-emerald-900/60"
											>
												<Icon className="size-5 -rotate-45 text-amber-200" />
											</span>
											<p className="font-mono text-[10px] uppercase tracking-widest text-amber-200/60">
												{witness.role}
											</p>
										</CardHeader>
										<CardContent className="space-y-4 text-center">
											<p className="display-title bg-gradient-to-r from-amber-200 to-yellow-600 px-3 py-1.5 text-sm uppercase tracking-widest text-emerald-950">
												{witness.name}
											</p>
											<p className="text-sm leading-relaxed text-amber-100/75">
												{witness.detail}
											</p>
										</CardContent>
									</Card>
								</li>
							);
						})}
					</ol>
				</section>

				<section className="text-center">
					<p className={KICKER}>{STORY_BEATS[3].kicker}</p>
					<h2 className={SECTION_TITLE}>{STORY_BEATS[3].title}</h2>
					<p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-amber-100/80 sm:text-base">
						{STORY_BEATS[3].body}
					</p>
					<figure
						className={`relative mx-auto mt-10 max-w-xl bg-[#0c1f1a] p-2 ${DECO_FRAME}`}
					>
						<CornerDiamonds />
						<img
							src={ASSETS.secondary}
							alt="Nancy and Francisco, the suspects of honor"
							className="w-full object-cover sepia-[0.25]"
						/>
					</figure>
				</section>

				<section id="rsvp" ref={rsvpRef} className="scroll-mt-6">
					<div className="text-center">
						<p className={KICKER}>{COPY.rsvpKicker}</p>
						<h2 className={SECTION_TITLE}>{COPY.rsvpTitle}</h2>
						<div className="mt-6">
							<FanDivider />
						</div>
					</div>
					<div className="mt-10">
						{phase === "confirmed" && rsvp ? (
							<RevealCard rsvp={rsvp} />
						) : phase === "declined" ? (
							<DeclinedCard onChange={handleChangeRsvp} />
						) : phase === "already-confirmed" && rsvp ? (
							<AlreadyConfirmedCard
								rsvp={rsvp}
								error={error}
								onChange={handleChangeRsvp}
							/>
						) : (
							<EngravedForm
								key={formEpoch}
								initial={rsvp}
								submitting={phase === "submitting"}
								error={error}
								onSubmit={submit}
								onUpdate={update}
								onRetrieve={retrieve}
							/>
						)}
					</div>
				</section>

				<footer className="space-y-6 pb-4 text-center">
					<FanDivider />
					<p className="font-mono text-[10px] uppercase tracking-widest text-amber-200/50">
						{EVENT.caseNumber} · {EVENT.parents} · {EVENT.city}
					</p>
				</footer>
			</div>
		</main>
	);
}
