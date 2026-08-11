import { FileText, FolderOpen, Search } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import {
	INPUT_MANILA,
	MANILA_CARD,
	MONO_LABEL,
	PRIMARY_BUTTON,
	Stamp,
	THEORY_ITEM,
	TOGGLE_ITEM,
} from "#/components/landing/case-ui";
import { RevealDocument } from "#/components/landing/reveal-document";
import { useRsvpFlow } from "#/components/landing/use-rsvp-flow";
import { Button } from "#/components/ui/button";
import {
	Card,
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
import { m } from "#/paraglide/messages";

/**
 * The RSVP, typed onto the manila case file. Drives the real flow:
 * idle form, submitting, confirmed (Reveal), declined (no Reveal),
 * already-confirmed (stored response + change), and the retrieval path.
 */
export function RsvpSection() {
	const { phase, rsvp, error, submit, update, retrieve, changeRsvp } =
		useRsvpFlow();

	const [name, setName] = useState("");
	const [attending, setAttending] = useState<"yes" | "no" | null>(null);
	const [partySize, setPartySize] = useState("1");
	const [theory, setTheory] = useState<"girl" | "boy" | null>(null);
	const [website, setWebsite] = useState("");
	const [showRetrieval, setShowRetrieval] = useState(false);
	const [retrievalName, setRetrievalName] = useState("");

	// Returning to the form pre-fills the stored response.
	useEffect(() => {
		if (phase === "idle" && rsvp) {
			setName(rsvp.name);
			setAttending(rsvp.attending ? "yes" : "no");
			setPartySize(String(rsvp.partySize));
			setTheory(rsvp.theory);
		}
	}, [phase, rsvp]);

	const submitting = phase === "submitting";
	const canSubmit =
		name.trim().length >= 2 && attending !== null && !submitting;

	const partySizeOptions = [
		m.rsvp_party_size_1(),
		m.rsvp_party_size_2(),
		m.rsvp_party_size_3(),
		m.rsvp_party_size_4(),
	];

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
		// editing a stored response updates instead of submitting anew
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
		<section
			id="rsvp"
			className="scroll-mt-20 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-500 motion-safe:fill-mode-backwards motion-safe:duration-500"
		>
			{phase === "confirmed" && rsvp ? (
				<RevealDocument />
			) : phase === "declined" ? (
				<Card className={MANILA_CARD}>
					<CardHeader>
						<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
							<FileText className="size-3.5" aria-hidden />
							{m.envelope_case_number()}
						</div>
						<CardTitle className="display-title text-3xl text-case-ink sm:text-4xl">
							{m.declined_title()}
						</CardTitle>
						<CardDescription className="font-mono text-sm leading-relaxed text-stone-700">
							{m.declined_body()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Stamp className="-rotate-6 border-stone-500/60 text-stone-500">
							{m.stamp_filed()}
						</Stamp>
					</CardContent>
				</Card>
			) : phase === "already-confirmed" && rsvp ? (
				<Card className={MANILA_CARD}>
					<CardHeader>
						<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
							<FolderOpen className="size-3.5" aria-hidden />
							{m.envelope_case_number()}
						</div>
						<CardTitle className="display-title text-3xl text-case-ink sm:text-4xl">
							{m.already_title()}
						</CardTitle>
						<CardDescription className="font-mono text-sm leading-relaxed text-stone-700">
							{m.already_body()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-sm text-stone-800">
							<dt className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
								{m.rsvp_name_label()}
							</dt>
							<dd>{rsvp.name}</dd>
							<dt className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
								{m.rsvp_attending_label()}
							</dt>
							<dd>
								{rsvp.attending
									? m.rsvp_attending_yes()
									: m.rsvp_attending_no()}
							</dd>
							<dt className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
								{m.rsvp_party_size_label()}
							</dt>
							<dd>{partySizeOptions[rsvp.partySize - 1]}</dd>
							{rsvp.theory ? (
								<>
									<dt className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
										{m.rsvp_theory_label()}
									</dt>
									<dd>
										{rsvp.theory === "girl"
											? m.rsvp_theory_girl()
											: m.rsvp_theory_boy()}
									</dd>
								</>
							) : null}
						</dl>
					</CardContent>
					<CardFooter>
						<Button
							type="button"
							onClick={changeRsvp}
							className={PRIMARY_BUTTON}
						>
							{m.already_change()}
						</Button>
					</CardFooter>
				</Card>
			) : (
				<Card className={`rotate-1 ${MANILA_CARD}`}>
					<CardHeader>
						<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
							<FileText className="size-3.5" aria-hidden />
							{m.rsvp_kicker()}
						</div>
						<CardTitle className="display-title text-3xl text-case-ink sm:text-4xl">
							{m.rsvp_title()}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit}>
							<fieldset
								disabled={submitting}
								className="flex min-w-0 flex-col gap-5"
							>
								<div className="flex flex-col gap-2">
									<Label htmlFor="rsvp-name" className={MONO_LABEL}>
										{m.rsvp_name_label()}
									</Label>
									<Input
										id="rsvp-name"
										value={name}
										onChange={(event) => setName(event.target.value)}
										placeholder={m.rsvp_name_placeholder()}
										autoComplete="name"
										className={INPUT_MANILA}
									/>
								</div>

								<div className="flex flex-col gap-2">
									<span className={MONO_LABEL}>{m.rsvp_attending_label()}</span>
									<RadioGroup
										value={attending ?? ""}
										onValueChange={(value) =>
											setAttending(value as "yes" | "no")
										}
										className="grid gap-2 sm:grid-cols-2"
									>
										{(
											[
												["yes", m.rsvp_attending_yes()],
												["no", m.rsvp_attending_no()],
											] as const
										).map(([value, label]) => (
											<Label
												key={value}
												className={`cursor-pointer gap-3 rounded-md border px-3 py-2.5 font-mono text-xs tracking-wide transition-colors ${
													attending === value
														? "border-stone-900/60 bg-amber-200/70 text-case-ink"
														: "border-stone-900/20 bg-amber-50/60 text-stone-600 hover:border-stone-900/40"
												}`}
											>
												<RadioGroupItem
													value={value}
													aria-label={label}
													className="border-stone-900/50 data-checked:border-stamp data-checked:bg-stamp dark:data-checked:border-stamp dark:data-checked:bg-stamp [&_[data-slot='radio-group-indicator']>span]:bg-amber-50"
												/>
												{label}
											</Label>
										))}
									</RadioGroup>
								</div>

								<div className="flex flex-col gap-2">
									<span className={MONO_LABEL}>
										{m.rsvp_party_size_label()}
									</span>
									<ToggleGroup
										type="single"
										value={partySize}
										onValueChange={(value) => {
											if (value) setPartySize(value);
										}}
										className="flex-wrap"
									>
										{partySizeOptions.map((label, index) => (
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
									<span className={MONO_LABEL}>{m.rsvp_theory_label()}</span>
									<ToggleGroup
										type="single"
										value={theory ?? ""}
										onValueChange={(value) =>
											setTheory(
												value === "girl" || value === "boy" ? value : null,
											)
										}
										className="flex-wrap"
									>
										<ToggleGroupItem
											value="girl"
											className={`${THEORY_ITEM} data-[state=on]:bg-pink-300 aria-pressed:bg-pink-300`}
										>
											{m.rsvp_theory_girl()}
										</ToggleGroupItem>
										<ToggleGroupItem
											value="boy"
											className={`${THEORY_ITEM} data-[state=on]:bg-sky-300 aria-pressed:bg-sky-300`}
										>
											{m.rsvp_theory_boy()}
										</ToggleGroupItem>
									</ToggleGroup>
								</div>

								{/* honeypot: real guests never fill this in */}
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
									<p role="alert" className="font-mono text-xs text-stamp">
										{error}
									</p>
								) : null}

								<Button
									type="submit"
									disabled={!canSubmit}
									className={`w-full ${PRIMARY_BUTTON}`}
								>
									{submitting
										? m.rsvp_submitting()
										: rsvp
											? m.rsvp_update()
											: m.rsvp_submit()}
								</Button>
							</fieldset>
						</form>
					</CardContent>
					<CardFooter className="flex-col items-stretch gap-3">
						<Separator className="bg-stone-900/20" />
						{showRetrieval ? (
							<form onSubmit={handleRetrieve} className="flex flex-col gap-2">
								<Label htmlFor="rsvp-retrieval" className={MONO_LABEL}>
									{m.retrieval_label()}
								</Label>
								<div className="flex flex-col gap-2 sm:flex-row">
									<Input
										id="rsvp-retrieval"
										value={retrievalName}
										onChange={(event) => setRetrievalName(event.target.value)}
										autoComplete="name"
										className={INPUT_MANILA}
									/>
									<Button
										type="submit"
										variant="outline"
										disabled={submitting || retrievalName.trim().length < 2}
										className="rounded-md border-stone-900/40 bg-transparent font-mono text-xs uppercase tracking-[0.15em] text-stone-800 hover:bg-amber-200/70 hover:text-case-ink"
									>
										<Search aria-hidden />
										{m.retrieval_submit()}
									</Button>
								</div>
								{error === "not-found" ? (
									<p role="alert" className="font-mono text-xs text-stamp">
										{m.retrieval_not_found()}
									</p>
								) : null}
							</form>
						) : (
							<button
								type="button"
								onClick={() => setShowRetrieval(true)}
								className="self-start font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 underline underline-offset-4 transition-colors hover:text-stamp focus-visible:outline-2 focus-visible:outline-stamp"
							>
								{m.retrieval_link()}
							</button>
						)}
					</CardFooter>
				</Card>
			)}
		</section>
	);
}
