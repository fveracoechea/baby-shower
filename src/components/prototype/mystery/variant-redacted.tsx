import {
	ArrowRight,
	Calendar,
	Clock,
	ExternalLink,
	Gift,
	type LucideIcon,
	MapPin,
	Shirt,
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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { Separator } from "#/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import type { RsvpDto, RsvpInput } from "#/lib/rsvp";
import { cn } from "#/lib/utils.ts";

/**
 * PROTOTYPE (throwaway). Direction: "redacted".
 * A freshly declassified government document on clean paper: black ink,
 * hairline rules, mono case metadata, and redaction bars that slide away
 * section by section. The only color in the file is the theory pair
 * (rose-500 / sky-600) and one DECLASSIFIED stamp.
 */

type RsvpFlow = ReturnType<typeof useRsvpFlow>;

const BEAT_MS = 2500;

const REVEAL_DELAYS = [
	"motion-safe:delay-0",
	"motion-safe:delay-150",
	"motion-safe:delay-300",
	"motion-safe:delay-500",
] as const;

const WITNESS_PHOTOS = [
	ASSETS.ultrasound,
	ASSETS.secondary,
	ASSETS.venueInterior,
] as const;

const monoMeta = "font-mono text-[10px] uppercase tracking-widest";
const inkButton =
	"rounded-sm bg-neutral-900 font-mono text-xs uppercase tracking-widest text-neutral-50 hover:bg-neutral-700";
const paperButton =
	"rounded-sm border-neutral-900 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 hover:text-neutral-50";

/** Two animation frames, then true: lets redaction bars start closed, then snap open. */
function useRevealOnMount(dep: unknown) {
	const [revealed, setRevealed] = useState(false);
	// biome-ignore lint/correctness/useExhaustiveDependencies: `dep` intentionally re-arms the reveal when the section changes
	useEffect(() => {
		setRevealed(false);
		const frame = requestAnimationFrame(() =>
			requestAnimationFrame(() => setRevealed(true)),
		);
		return () => cancelAnimationFrame(frame);
	}, [dep]);
	return revealed;
}

/**
 * Signature element: a black redaction bar over content. It collapses
 * (origin-left, 300ms, sharp ease) once `revealed` flips. With reduced
 * motion there is no transition, so the text simply appears.
 */
function Redact({
	revealed,
	delay = REVEAL_DELAYS[0],
	className,
	children,
}: {
	revealed: boolean;
	delay?: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<span className={cn("relative inline-block", className)}>
			{children}
			<span
				aria-hidden="true"
				className={cn(
					"absolute -inset-x-1 -inset-y-0.5 origin-left rounded-sm bg-neutral-900",
					"motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out",
					delay,
					revealed ? "scale-x-0" : "scale-x-100",
				)}
			/>
		</span>
	);
}

/** A word that stays redacted: a solid black box the size of the word. */
function Sealed({ children }: { children: ReactNode }) {
	return (
		<span className="inline-block rounded-sm bg-neutral-900 px-1.5 align-baseline font-mono text-[0.72em] font-semibold uppercase tracking-widest text-transparent select-none">
			{children}
		</span>
	);
}

function MetaBar({ declassified }: { declassified: boolean }) {
	return (
		<header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur">
			<div
				className={cn(
					"mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-2.5 text-neutral-500 sm:px-8",
					monoMeta,
				)}
			>
				<span>{EVENT.caseNumber}</span>
				<span className="hidden sm:inline">
					Classification: {declassified ? "Declassified" : "Sealed"}
				</span>
				<span>{EVENT.city}</span>
			</div>
		</header>
	);
}

/** Progress indicator as document section numbers: 01 - 02 - 03 … */
function SectionNav({ current }: { current: number }) {
	return (
		<ol
			className={cn("flex items-center gap-2 text-neutral-400", monoMeta)}
			aria-label="Document sections"
		>
			{STORY_BEATS.map((beat, i) => {
				const n = String(i + 1).padStart(2, "0");
				const state =
					i < current ? "past" : i === current ? "current" : "future";
				return (
					<li key={beat.kicker} className="flex items-center gap-2">
						{i > 0 ? (
							<span aria-hidden="true" className="h-px w-3 bg-neutral-300" />
						) : null}
						<span
							aria-current={state === "current" ? "step" : undefined}
							className={cn(
								"px-1.5 py-0.5",
								state === "current" && "bg-neutral-900 text-neutral-50",
								state === "past" && "line-through",
							)}
						>
							{n}
						</span>
					</li>
				);
			})}
		</ol>
	);
}

/** The three witnesses as a numbered evidence list. */
function WitnessList({ declassified }: { declassified: boolean }) {
	return (
		<ol className="divide-y divide-neutral-200 border-y border-neutral-200">
			{WITNESSES.map((witness, i) => (
				<li key={witness.id} className="flex items-start gap-4 py-4">
					<span className={cn("mt-0.5 shrink-0 text-neutral-400", monoMeta)}>
						W-{String(i + 1).padStart(2, "0")}
					</span>
					<img
						src={WITNESS_PHOTOS[i]}
						alt={`Evidence photo, ${witness.name}`}
						className={cn(
							"size-12 shrink-0 rounded-sm border border-neutral-200 object-cover",
							declassified ? "grayscale-0" : "grayscale",
							"motion-safe:transition-[filter] motion-safe:duration-500",
						)}
					/>
					<div className="min-w-0">
						<p className="text-sm font-semibold tracking-wide uppercase">
							{witness.name}
							<span
								className={cn("ml-2 font-normal text-neutral-400", monoMeta)}
							>
								{witness.role}
							</span>
						</p>
						<p className="mt-1 text-sm leading-relaxed text-neutral-600">
							{witness.detail}
						</p>
					</div>
				</li>
			))}
		</ol>
	);
}

/** Intro: the document declassifies line by line, one section every beat. */
function IntroView({ beat, onSkip }: { beat: number; onSkip: () => void }) {
	const revealed = useRevealOnMount(beat);
	const current = STORY_BEATS[beat];

	return (
		<section className="mx-auto flex min-h-[75vh] w-full max-w-5xl flex-col px-4 py-8 sm:px-8">
			<div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-3">
				<SectionNav current={beat} />
				<span className={cn("shrink-0 text-neutral-500", monoMeta)}>
					Section {String(beat + 1).padStart(2, "0")} of{" "}
					{String(STORY_BEATS.length).padStart(2, "0")}
				</span>
			</div>

			{/* Sections already released: condensed mono rows. */}
			{beat > 0 ? (
				<div className="mt-5 space-y-1.5">
					{STORY_BEATS.slice(0, beat).map((past, i) => (
						<p
							key={past.kicker}
							className={cn(
								"flex items-baseline gap-3 text-neutral-400",
								monoMeta,
							)}
						>
							<span className="shrink-0">
								Sec {String(i + 1).padStart(2, "0")}
							</span>
							<span className="min-w-0 flex-1 truncate">{past.title}</span>
							<span className="shrink-0">Released</span>
						</p>
					))}
				</div>
			) : null}

			{/* The section currently being declassified. */}
			<article key={beat} className="mt-10 max-w-3xl">
				<p className={cn("text-neutral-500", monoMeta)}>
					<Redact revealed={revealed}>
						Sec {String(beat + 1).padStart(2, "0")} — {current.kicker}
					</Redact>
				</p>
				<h1 className="display-title mt-4 text-4xl leading-tight font-medium text-balance sm:text-5xl">
					<Redact revealed={revealed} delay={REVEAL_DELAYS[1]}>
						{current.title}
					</Redact>
				</h1>
				<p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700 sm:text-lg">
					<Redact
						revealed={revealed}
						delay={REVEAL_DELAYS[2]}
						className="block"
					>
						{current.body}
					</Redact>
				</p>
				{beat === 2 ? (
					<Redact
						revealed={revealed}
						delay={REVEAL_DELAYS[3]}
						className="mt-8 block"
					>
						<WitnessList declassified={false} />
					</Redact>
				) : null}
			</article>

			{/* Sections still sealed: solid redaction blocks. */}
			{beat < STORY_BEATS.length - 1 ? (
				<div aria-hidden="true" className="mt-10 space-y-3">
					{STORY_BEATS.slice(beat + 1).map((future, i) => (
						<div key={future.kicker} className="flex items-center gap-3">
							<span className={cn("shrink-0 text-neutral-400", monoMeta)}>
								Sec {String(beat + 2 + i).padStart(2, "0")}
							</span>
							<span className="h-3.5 w-full max-w-md rounded-sm bg-neutral-900" />
						</div>
					))}
				</div>
			) : null}

			<div className="mt-auto pt-12">
				<Button
					type="button"
					variant="outline"
					onClick={onSkip}
					className={paperButton}
				>
					Skip to RSVP
					<ArrowRight />
				</Button>
			</div>
		</section>
	);
}

function FactBox({
	icon: Icon,
	label,
	children,
}: {
	icon?: LucideIcon;
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="flex items-start gap-3 border border-neutral-200 bg-white p-3">
			{Icon ? (
				<Icon
					aria-hidden="true"
					className="mt-0.5 size-4 shrink-0 text-neutral-400"
				/>
			) : null}
			<div className="min-w-0">
				<p className={cn("text-neutral-500", monoMeta)}>{label}</p>
				<div className="mt-1 text-sm font-medium break-words">{children}</div>
			</div>
		</div>
	);
}

/** Landing after the last section: facts (city only) + CTA to the form. */
function InviteView({ onFile }: { onFile: () => void }) {
	const revealed = useRevealOnMount("invite");

	return (
		<section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-12">
			<aside className="mb-10 md:mb-0">
				<dl
					className={cn(
						"space-y-3 text-neutral-500 md:sticky md:top-16",
						monoMeta,
					)}
				>
					<div>
						<dt className="text-neutral-400">Document</dt>
						<dd className="mt-0.5 text-neutral-900">Invitation</dd>
					</div>
					<Separator className="bg-neutral-200" />
					<div>
						<dt className="text-neutral-400">Section</dt>
						<dd className="mt-0.5">06 — Final</dd>
					</div>
					<Separator className="bg-neutral-200" />
					<div>
						<dt className="text-neutral-400">Filed under</dt>
						<dd className="mt-0.5">{EVENT.caseNumber}</dd>
					</div>
				</dl>
			</aside>

			<div>
				<p className={cn("text-neutral-500", monoMeta)}>
					<Redact revealed={revealed}>Sec 06 — Invitation released</Redact>
				</p>
				<h1 className="display-title mt-4 text-4xl leading-tight font-medium sm:text-5xl">
					<Redact revealed={revealed} delay={REVEAL_DELAYS[1]}>
						{EVENT.parents}
					</Redact>
				</h1>
				<p className="mt-4 max-w-lg text-lg leading-relaxed text-neutral-700">
					<Redact
						revealed={revealed}
						delay={REVEAL_DELAYS[2]}
						className="block"
					>
						You are invited.
					</Redact>
				</p>

				<div className="mt-8 grid gap-2 sm:grid-cols-2">
					<FactBox icon={Calendar} label={COPY.dateLabel}>
						{EVENT.dateLong}
					</FactBox>
					<FactBox icon={Clock} label={COPY.timeLabel}>
						{EVENT.timeRange}
					</FactBox>
					<FactBox icon={MapPin} label="City">
						{EVENT.city}
					</FactBox>
					<FactBox label={COPY.venueLabel}>
						<Sealed>{EVENT.venue}</Sealed>
					</FactBox>
				</div>

				<figure className="mt-8 max-w-md">
					<div className="border border-neutral-200 bg-white p-2">
						<img
							src={ASSETS.hero}
							alt="Nancy and Francisco, the parents-to-be"
							className="aspect-[4/5] w-full rounded-sm object-cover grayscale"
						/>
					</div>
					<figcaption className={cn("mt-2 text-neutral-500", monoMeta)}>
						Exhibit A — The parents-to-be
					</figcaption>
				</figure>

				<div className="mt-8">
					<Button type="button" onClick={onFile} className={inkButton}>
						Open Form SS-2026
						<ArrowRight />
					</Button>
				</div>
			</div>
		</section>
	);
}

function Field({
	index,
	label,
	htmlFor,
	children,
}: {
	index: string;
	label: string;
	htmlFor?: string;
	children: ReactNode;
}) {
	return (
		<div className="p-4 sm:p-5">
			{htmlFor ? (
				<Label
					htmlFor={htmlFor}
					className={cn("mb-3 text-neutral-500", monoMeta)}
				>
					Field {index} — {label}
				</Label>
			) : (
				<p className={cn("mb-3 text-neutral-500", monoMeta)}>
					Field {index} — {label}
				</p>
			)}
			{children}
		</div>
	);
}

function RadioBox({
	id,
	value,
	label,
}: {
	id: string;
	value: string;
	label: string;
}) {
	return (
		<label
			htmlFor={id}
			className="flex cursor-pointer items-center gap-3 border border-neutral-300 bg-white px-3 py-2.5 text-sm transition-colors has-aria-checked:border-neutral-900 has-aria-checked:bg-neutral-50"
		>
			<RadioGroupItem
				id={id}
				value={value}
				className="border-neutral-400 data-[state=checked]:border-neutral-900! data-[state=checked]:bg-neutral-900!"
			/>
			<span>{label}</span>
		</label>
	);
}

/** Form SS-2026: boxed fields, mono labels, official submit. */
function RsvpForm({
	initial,
	busy,
	error,
	onSubmit,
	onRetrieve,
}: {
	initial: RsvpDto | null;
	busy: boolean;
	error: string | null;
	onSubmit: (input: RsvpInput, isUpdate: boolean) => void;
	onRetrieve: (name: string) => void;
}) {
	const [name, setName] = useState(initial?.name ?? "");
	const [attending, setAttending] = useState<"yes" | "no" | null>(
		initial ? (initial.attending ? "yes" : "no") : null,
	);
	const [partySize, setPartySize] = useState(String(initial?.partySize ?? 1));
	const [theory, setTheory] = useState<"girl" | "boy" | null>(
		initial?.theory ?? null,
	);
	const [website, setWebsite] = useState("");
	const [lookupName, setLookupName] = useState("");

	const canSubmit = name.trim().length >= 2 && attending !== null && !busy;

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!canSubmit || attending === null) return;
		onSubmit(
			{
				name: name.trim(),
				attending: attending === "yes",
				partySize: attending === "yes" ? Number(partySize) : 1,
				theory,
				website,
			},
			initial !== null,
		);
	}

	return (
		<div>
			<p className={cn("text-neutral-500", monoMeta)}>{COPY.rsvpKicker}</p>
			<h1 className="display-title mt-2 text-3xl font-medium sm:text-4xl">
				{COPY.rsvpTitle}
			</h1>

			<div className="mt-6 border border-neutral-900 bg-white">
				<div
					className={cn(
						"flex flex-wrap items-center justify-between gap-2 border-b border-neutral-900 px-4 py-3",
						monoMeta,
					)}
				>
					<span>Form SS-2026</span>
					<span className="text-neutral-500">
						Response sheet — one per party
					</span>
				</div>

				<form onSubmit={handleSubmit} className="divide-y divide-neutral-200">
					{/* Honeypot: real guests never see or fill this field. */}
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

					<Field index="01" label={COPY.nameLabel} htmlFor="rsvp-name">
						<Input
							id="rsvp-name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder={COPY.namePlaceholder}
							required
							minLength={2}
							maxLength={80}
							autoComplete="name"
							className="rounded-sm border-neutral-300 bg-white"
						/>
					</Field>

					<Field index="02" label={COPY.attendingLabel}>
						<RadioGroup
							value={attending ?? ""}
							onValueChange={(value) => setAttending(value as "yes" | "no")}
							aria-label={COPY.attendingLabel}
							className="gap-2"
						>
							<RadioBox id="att-yes" value="yes" label={COPY.attendingYes} />
							<RadioBox id="att-no" value="no" label={COPY.attendingNo} />
						</RadioGroup>
					</Field>

					{attending === "yes" ? (
						<Field index="03" label={COPY.partySizeLabel}>
							<RadioGroup
								value={partySize}
								onValueChange={setPartySize}
								aria-label={COPY.partySizeLabel}
								className="grid grid-cols-2 gap-2 sm:grid-cols-4"
							>
								{COPY.partySizeOptions.map((option, i) => (
									<RadioBox
										key={option}
										id={`ps-${i + 1}`}
										value={String(i + 1)}
										label={option}
									/>
								))}
							</RadioGroup>
						</Field>
					) : null}

					<Field index="04" label={COPY.theoryLabel}>
						<ToggleGroup
							type="single"
							value={theory ?? ""}
							onValueChange={(value) =>
								setTheory(value === "" ? null : (value as "girl" | "boy"))
							}
							aria-label={COPY.theoryLabel}
							className="gap-2"
						>
							<ToggleGroupItem
								value="girl"
								variant="outline"
								className="rounded-sm border-neutral-300 px-4 font-mono text-xs tracking-widest uppercase data-[state=on]:border-rose-500 data-[state=on]:bg-rose-50 data-[state=on]:text-rose-600"
							>
								{COPY.theoryGirl}
							</ToggleGroupItem>
							<ToggleGroupItem
								value="boy"
								variant="outline"
								className="rounded-sm border-neutral-300 px-4 font-mono text-xs tracking-widest uppercase data-[state=on]:border-sky-600 data-[state=on]:bg-sky-50 data-[state=on]:text-sky-600"
							>
								{COPY.theoryBoy}
							</ToggleGroupItem>
						</ToggleGroup>
					</Field>

					{error && error !== "not-found" ? (
						<p
							role="alert"
							className={cn(
								"border-l-2 border-neutral-900 bg-neutral-100 px-3 py-2",
								monoMeta,
							)}
						>
							{COPY.errorGeneric}
						</p>
					) : null}

					<div className="p-4 sm:p-5">
						<Button
							type="submit"
							disabled={!canSubmit}
							className={cn("w-full", inkButton)}
						>
							{busy ? COPY.submitting : initial ? COPY.update : COPY.submit}
						</Button>
					</div>
				</form>

				<Accordion
					type="single"
					collapsible
					className="rounded-none border-t border-neutral-200"
				>
					<AccordionItem value="retrieve" className="not-last:border-b-0">
						<AccordionTrigger className={cn("px-4", monoMeta)}>
							{COPY.retrievalLink}
						</AccordionTrigger>
						<AccordionContent className="px-4">
							<Label
								htmlFor="lookup-name"
								className={cn("text-neutral-500", monoMeta)}
							>
								{COPY.retrievalLabel}
							</Label>
							<div className="mt-2 flex gap-2">
								<Input
									id="lookup-name"
									value={lookupName}
									onChange={(event) => setLookupName(event.target.value)}
									autoComplete="name"
									className="rounded-sm border-neutral-300 bg-white"
								/>
								<Button
									type="button"
									variant="outline"
									disabled={busy || lookupName.trim().length < 2}
									onClick={() => onRetrieve(lookupName.trim())}
									className={cn("shrink-0", paperButton)}
								>
									{COPY.retrievalSubmit}
								</Button>
							</div>
							{error === "not-found" ? (
								<p
									role="alert"
									className={cn(
										"mt-3 border-l-2 border-neutral-900 bg-neutral-100 px-3 py-2",
										monoMeta,
									)}
								>
									{COPY.retrievalNotFound}
								</p>
							) : null}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	);
}

/** already-confirmed: the stored response, filed under the case number. */
function FiledScreen({
	rsvp,
	onChange,
}: {
	rsvp: RsvpDto;
	onChange: () => void;
}) {
	return (
		<div className="border border-neutral-900 bg-white">
			<div
				className={cn(
					"flex flex-wrap items-center justify-between gap-2 border-b border-neutral-900 px-4 py-3 sm:px-6",
					monoMeta,
				)}
			>
				<span>Record on file</span>
				<span className="text-neutral-500">{EVENT.caseNumber}</span>
			</div>
			<div className="p-4 sm:p-6">
				<h1 className="display-title text-3xl font-medium sm:text-4xl">
					{COPY.alreadyConfirmedTitle}
				</h1>
				<p className="mt-3 max-w-lg leading-relaxed text-neutral-700">
					{COPY.alreadyConfirmedBody}
				</p>

				<dl className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
					<div className="flex items-baseline justify-between gap-4 py-3">
						<dt className={cn("text-neutral-500", monoMeta)}>Name</dt>
						<dd className="text-right text-sm font-medium">{rsvp.name}</dd>
					</div>
					<div className="flex items-baseline justify-between gap-4 py-3">
						<dt className={cn("text-neutral-500", monoMeta)}>Response</dt>
						<dd className="text-right text-sm font-medium">
							{rsvp.attending ? COPY.attendingYes : COPY.attendingNo}
						</dd>
					</div>
					<div className="flex items-baseline justify-between gap-4 py-3">
						<dt className={cn("text-neutral-500", monoMeta)}>Party</dt>
						<dd className="text-right text-sm font-medium">
							{COPY.partySizeOptions[rsvp.partySize - 1]}
						</dd>
					</div>
					<div className="flex items-baseline justify-between gap-4 py-3">
						<dt className={cn("text-neutral-500", monoMeta)}>Theory</dt>
						<dd className="text-right text-sm font-medium">
							{rsvp.theory ? (
								<Badge
									variant="outline"
									className={cn(
										"rounded-sm font-mono tracking-widest uppercase",
										rsvp.theory === "girl"
											? "border-rose-500 text-rose-600"
											: "border-sky-600 text-sky-600",
									)}
								>
									{rsvp.theory === "girl" ? COPY.theoryGirl : COPY.theoryBoy}
								</Badge>
							) : (
								"No theory on file"
							)}
						</dd>
					</div>
				</dl>

				<div className="mt-6">
					<Button
						type="button"
						variant="outline"
						onClick={onChange}
						className={paperButton}
					>
						{COPY.changeRsvp}
					</Button>
				</div>
			</div>
		</div>
	);
}

function DeclinedScreen({ onChange }: { onChange: () => void }) {
	return (
		<div className="border border-neutral-200 bg-white p-4 sm:p-6">
			<p className={cn("text-neutral-500", monoMeta)}>
				Response filed — {EVENT.caseNumber}
			</p>
			<h1 className="display-title mt-3 text-3xl font-medium sm:text-4xl">
				{COPY.declinedTitle}
			</h1>
			<p className="mt-3 max-w-lg leading-relaxed text-neutral-700">
				{COPY.declinedBody}
			</p>
			<Separator className="my-6 bg-neutral-200" />
			<Button
				type="button"
				variant="outline"
				onClick={onChange}
				className={paperButton}
			>
				{COPY.changeRsvp}
			</Button>
		</div>
	);
}

/** The Reveal: final page stamped DECLASSIFIED, redactions lifted. */
function RevealScreen({ rsvp }: { rsvp: RsvpDto }) {
	const revealed = useRevealOnMount("reveal");

	return (
		<div className="relative border border-neutral-900 bg-white p-4 sm:p-8">
			<Badge className="absolute top-4 right-4 h-auto rotate-6 rounded-sm border-2 border-rose-600 bg-white px-3 py-1.5 font-mono text-sm font-bold tracking-widest text-rose-600 uppercase sm:top-8 sm:right-8">
				Declassified
			</Badge>

			<p className={cn("text-neutral-500", monoMeta)}>
				{COPY.revealKicker} — {EVENT.caseNumber}
			</p>
			<h1 className="display-title mt-3 max-w-sm text-3xl font-medium sm:text-4xl">
				{COPY.revealTitle}
			</h1>
			<p className="mt-3 max-w-lg leading-relaxed text-neutral-700">
				{COPY.revealBody}
			</p>

			<Separator className="my-6 bg-neutral-200" />

			<div className="grid gap-2 sm:grid-cols-2">
				<FactBox label={COPY.venueLabel}>
					<Redact revealed={revealed}>{EVENT.venue}</Redact>
				</FactBox>
				<FactBox icon={MapPin} label={COPY.addressLabel}>
					<a
						href={EVENT.mapsUrl}
						target="_blank"
						rel="noreferrer"
						aria-label={`${COPY.openInMaps}: ${EVENT.address}`}
						className="group inline-flex items-center gap-1.5 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
					>
						<Redact revealed={revealed} delay={REVEAL_DELAYS[1]}>
							{EVENT.address}
						</Redact>
						<ExternalLink aria-hidden="true" className="size-3.5 shrink-0" />
					</a>
				</FactBox>
				<FactBox icon={Calendar} label={COPY.dateLabel}>
					{EVENT.dateLong}
				</FactBox>
				<FactBox icon={Clock} label={COPY.timeLabel}>
					{EVENT.timeRange}
				</FactBox>
				<FactBox icon={Shirt} label={COPY.dressCodeLabel}>
					{EVENT.dressCode}
				</FactBox>
				<FactBox icon={Gift} label={COPY.registryLabel}>
					<span className="block font-normal text-neutral-600">
						{EVENT.registryNote}
					</span>
					<Button asChild variant="outline" className={cn("mt-2", paperButton)}>
						<a href={EVENT.registryUrl}>{COPY.registryCta}</a>
					</Button>
				</FactBox>
			</div>

			<div className="mt-8 grid gap-4 sm:grid-cols-2">
				<figure>
					<div className="border border-neutral-200 bg-white p-2">
						<img
							src={ASSETS.venueExterior}
							alt="The venue, seen from the street"
							className={cn(
								"aspect-[4/3] w-full rounded-sm object-cover",
								revealed ? "grayscale-0" : "grayscale",
								"motion-safe:transition-[filter] motion-safe:duration-500 motion-safe:delay-300",
							)}
						/>
					</div>
					<figcaption className={cn("mt-2 text-neutral-500", monoMeta)}>
						Exhibit B — The scene
					</figcaption>
				</figure>
				<figure>
					<div className="border border-neutral-200 bg-white p-2">
						<img
							src={ASSETS.venueInterior}
							alt="Inside the venue"
							className={cn(
								"aspect-[4/3] w-full rounded-sm object-cover",
								revealed ? "grayscale-0" : "grayscale",
								"motion-safe:transition-[filter] motion-safe:duration-500 motion-safe:delay-500",
							)}
						/>
					</div>
					<figcaption className={cn("mt-2 text-neutral-500", monoMeta)}>
						Exhibit C — Interior
					</figcaption>
				</figure>
			</div>

			<div className="mt-8">
				<p className={cn("mb-3 text-neutral-500", monoMeta)}>
					The witnesses — photos cleared for release
				</p>
				<WitnessList declassified />
			</div>

			<p className={cn("mt-6 text-neutral-400", monoMeta)}>
				Respondent: {rsvp.name} — the answer itself stays sealed until{" "}
				{EVENT.dateLong}.
			</p>
		</div>
	);
}

/** RSVP column: Form SS-2026 plus the phase screens the flow drives. */
function RsvpSection({ flow }: { flow: RsvpFlow }) {
	const { phase, rsvp, error, submit, update, retrieve, changeRsvp } = flow;
	const [editing, setEditing] = useState(false);

	const startEdit = () => {
		changeRsvp();
		setEditing(true);
	};

	const status =
		phase === "submitting"
			? "Filing"
			: phase === "confirmed"
				? "Declassified"
				: phase === "declined"
					? "Response filed"
					: phase === "already-confirmed"
						? "Record on file"
						: "Awaiting response";

	return (
		<section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-12">
			<aside className="mb-10 md:mb-0">
				<dl
					className={cn(
						"space-y-3 text-neutral-500 md:sticky md:top-16",
						monoMeta,
					)}
				>
					<div>
						<dt className="text-neutral-400">Document</dt>
						<dd className="mt-0.5 text-neutral-900">Form SS-2026</dd>
					</div>
					<Separator className="bg-neutral-200" />
					<div>
						<dt className="text-neutral-400">Status</dt>
						<dd className="mt-0.5">{status}</dd>
					</div>
					<Separator className="bg-neutral-200" />
					<div>
						<dt className="text-neutral-400">{COPY.dateLabel}</dt>
						<dd className="mt-0.5">{EVENT.dateLong}</dd>
					</div>
					<div>
						<dt className="text-neutral-400">{COPY.timeLabel}</dt>
						<dd className="mt-0.5">{EVENT.timeRange}</dd>
					</div>
					<div>
						<dt className="text-neutral-400">City</dt>
						<dd className="mt-0.5">{EVENT.city}</dd>
					</div>
					<div>
						<dt className="text-neutral-400">{COPY.venueLabel}</dt>
						<dd className="mt-1">
							{phase === "confirmed" ? (
								EVENT.venue
							) : (
								<Sealed>{EVENT.venue}</Sealed>
							)}
						</dd>
					</div>
				</dl>
			</aside>

			<div>
				{phase === "confirmed" && rsvp ? (
					<RevealScreen rsvp={rsvp} />
				) : phase === "declined" ? (
					<DeclinedScreen onChange={startEdit} />
				) : phase === "already-confirmed" && rsvp ? (
					<FiledScreen rsvp={rsvp} onChange={startEdit} />
				) : (
					<RsvpForm
						key={editing && rsvp ? `edit-${rsvp.id}-${rsvp.updatedAt}` : "new"}
						initial={editing ? rsvp : null}
						busy={phase === "submitting"}
						error={error}
						onSubmit={(input, isUpdate) => {
							if (isUpdate) void update(input);
							else void submit(input);
						}}
						onRetrieve={(name) => void retrieve(name)}
					/>
				)}
			</div>
		</section>
	);
}

export function VariantRedacted() {
	const flow = useRsvpFlow();
	const [view, setView] = useState<"intro" | "invite" | "rsvp">("intro");
	const [beat, setBeat] = useState(0);

	// Auto-advance the declassification: one section every BEAT_MS,
	// then land on the invitation.
	useEffect(() => {
		if (view !== "intro") return;
		const timer = window.setTimeout(() => {
			if (beat < STORY_BEATS.length - 1) setBeat(beat + 1);
			else setView("invite");
		}, BEAT_MS);
		return () => window.clearTimeout(timer);
	}, [view, beat]);

	return (
		<main className="min-h-screen bg-gradient-to-b from-neutral-50 to-stone-100 text-neutral-900 antialiased">
			<MetaBar declassified={flow.phase === "confirmed"} />
			{view === "intro" ? (
				<IntroView beat={beat} onSkip={() => setView("rsvp")} />
			) : view === "invite" ? (
				<InviteView onFile={() => setView("rsvp")} />
			) : (
				<RsvpSection flow={flow} />
			)}
			<footer className="border-t border-neutral-200">
				<div
					className={cn(
						"mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-4 text-neutral-400 sm:px-8",
						monoMeta,
					)}
				>
					<span>{EVENT.caseNumber}</span>
					<span>Page 1 of 1</span>
				</div>
			</footer>
		</main>
	);
}
