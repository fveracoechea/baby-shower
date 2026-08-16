import { useNavigate } from "@tanstack/react-router";
import { FileText, Search } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

import {
	INPUT_MANILA,
	MANILA_CARD,
	MONO_LABEL,
	PRIMARY_BUTTON,
	Stamp,
	THEORY_ITEM,
	TOGGLE_ITEM,
} from "#/components/landing/case-ui";
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

export function RsvpSection({ editRsvp = false }: { editRsvp?: boolean }) {
	const navigate = useNavigate({ from: "/" });
	const restoredEdit = useRef(false);
	const {
		phase,
		rsvp,
		invitation,
		error,
		readOnly,
		identify,
		submit,
		update,
		editRememberedRsvp,
	} = useRsvpFlow();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [attending, setAttending] = useState<"yes" | "no" | null>(null);
	const [additionalGuestCount, setAdditionalGuestCount] = useState("0");
	const [theory, setTheory] = useState<"girl" | "boy" | null>(null);
	const [website, setWebsite] = useState("");
	const [showRetrieval, setShowRetrieval] = useState(false);
	const submitting = phase === "submitting";

	useEffect(() => {
		if (phase === "idle" && rsvp) {
			setPhoneNumber(rsvp.phoneNumber);
			setAttending(rsvp.attending ? "yes" : "no");
			setAdditionalGuestCount(String(rsvp.additionalGuestCount));
			setTheory(rsvp.theory);
		}
	}, [phase, rsvp]);

	useEffect(() => {
		if (
			(phase === "confirmed" ||
				phase === "declined" ||
				phase === "already-confirmed") &&
			rsvp
		) {
			void navigate({ to: "/reveal" });
		}
	}, [navigate, phase, rsvp]);

	useEffect(() => {
		if (!editRsvp || restoredEdit.current) return;
		restoredEdit.current = true;
		void editRememberedRsvp();
	}, [editRememberedRsvp, editRsvp]);

	function identifyInvitation(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!submitting) identify(phoneNumber);
	}

	function fileRsvp(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!invitation || attending === null || submitting || readOnly) return;
		const input = {
			phoneNumber,
			attending: attending === "yes",
			additionalGuestCount: Number(additionalGuestCount),
			theory,
			website,
		};
		if (rsvp) update(input);
		else submit(input);
	}

	if (phase === "confirmed" && rsvp) return null;
	if (phase === "declined" && rsvp) {
		return (
			<Card className={MANILA_CARD}>
				<CardHeader>
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
		);
	}

	return (
		<section
			id="rsvp"
			className="scroll-mt-20 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
		>
			<Card className={MANILA_CARD}>
				<CardHeader>
					<div className="flex items-center gap-2 font-mono text-sm leading-relaxed text-stone-500">
						<FileText className="size-3.5" aria-hidden />
						{m.rsvp_kicker()}
					</div>
					<CardTitle className="display-title text-3xl text-case-ink sm:text-4xl">
						{phase === "closed" ? m.rsvp_closed_title() : m.rsvp_title()}
					</CardTitle>
					{phase === "already-confirmed" && rsvp ? (
						<CardDescription className="font-mono text-sm text-stone-700">
							{m.already_body()}
						</CardDescription>
					) : null}
					{phase === "closed" ? (
						<CardDescription className="font-mono text-sm text-stone-700">
							{m.rsvp_closed_body()}
						</CardDescription>
					) : null}
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<form onSubmit={identifyInvitation} className="flex flex-col gap-2">
						<Label htmlFor="rsvp-phone" className={MONO_LABEL}>
							{m.rsvp_phone_label()}
						</Label>
						<div className="flex flex-col gap-2 sm:flex-row">
							<Input
								id="rsvp-phone"
								value={phoneNumber}
								onChange={(event) => setPhoneNumber(event.target.value)}
								placeholder={m.rsvp_phone_placeholder()}
								autoComplete="tel"
								inputMode="tel"
								className={INPUT_MANILA}
								disabled={submitting || readOnly}
							/>
							<Button
								type="submit"
								disabled={
									submitting || readOnly || phoneNumber.trim().length < 7
								}
								className={PRIMARY_BUTTON}
							>
								<Search aria-hidden />
								{m.rsvp_phone_submit()}
							</Button>
						</div>
					</form>
					{invitation ? (
						<form
							onSubmit={fileRsvp}
							className="flex flex-col gap-5 border-t border-stone-900/20 pt-5"
						>
							<p className="font-mono text-sm text-stone-800">
								{m.rsvp_invitation_for({ name: invitation.name })}
							</p>
							<fieldset
								disabled={submitting || readOnly}
								className="flex flex-col gap-5"
							>
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
												className={`cursor-pointer gap-3 rounded-md border px-3 py-2.5 font-mono text-xs tracking-wide ${attending === value ? "border-stone-900/60 bg-amber-200/70 text-case-ink" : "border-stone-900/20 bg-amber-50/60 text-stone-600"}`}
											>
												<RadioGroupItem value={value} aria-label={label} />
												{label}
											</Label>
										))}
									</RadioGroup>
								</div>
								{attending === "yes" ? (
									<div className="flex flex-col gap-2">
										<span className={MONO_LABEL}>
											{m.rsvp_additional_guests_label()}
										</span>
										<ToggleGroup
											type="single"
											value={additionalGuestCount}
											onValueChange={(value) =>
												value && setAdditionalGuestCount(value)
											}
											className="flex-wrap"
										>
											{Array.from(
												{ length: invitation.additionalGuestAllowance + 1 },
												(_, count) => String(count),
											).map((value) => (
												<ToggleGroupItem
													key={`additional-guests-${value}`}
													value={value}
													className={TOGGLE_ITEM}
												>
													{m.rsvp_additional_guests_count({
														count: Number(value),
													})}
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</div>
								) : null}
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
											className={`${THEORY_ITEM} data-[state=on]:bg-pink-300`}
										>
											{m.rsvp_theory_girl()}
										</ToggleGroupItem>
										<ToggleGroupItem
											value="boy"
											className={`${THEORY_ITEM} data-[state=on]:bg-sky-300`}
										>
											{m.rsvp_theory_boy()}
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
								<Button
									type="submit"
									disabled={attending === null || submitting || readOnly}
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
					) : null}
					{phase === "already-confirmed" && rsvp ? (
						<p className="font-mono text-sm text-stone-700">
							{rsvp.attending ? m.rsvp_attending_yes() : m.rsvp_attending_no()}
							{rsvp.attending
								? ` · ${m.rsvp_additional_guests_count({ count: rsvp.additionalGuestCount })}`
								: ""}
						</p>
					) : null}
					{error ? (
						<p role="alert" className="font-mono text-xs text-stamp">
							{error === "not-found" ? m.retrieval_not_found() : error}
						</p>
					) : null}
				</CardContent>
				<CardFooter className="flex-col items-stretch gap-3">
					<Separator className="bg-stone-900/20" />
					{showRetrieval ? (
						<form onSubmit={identifyInvitation} className="flex flex-col gap-2">
							<Label htmlFor="rsvp-retrieval" className={MONO_LABEL}>
								{m.retrieval_label()}
							</Label>
							<Button type="submit" variant="outline">
								{m.retrieval_submit()}
							</Button>
						</form>
					) : (
						<button
							type="button"
							onClick={() => setShowRetrieval(true)}
							className="self-start font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 underline underline-offset-4 hover:text-stamp"
						>
							{m.retrieval_link()}
						</button>
					)}
				</CardFooter>
			</Card>
		</section>
	);
}
