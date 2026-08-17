import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, FileText, Search } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { Stamp } from "#/components/landing/case-ui";
import {
	type RsvpFlowError,
	useRsvpFlow,
} from "#/components/landing/use-rsvp-flow";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { m } from "#/paraglide/messages";

function flowErrorMessage(error: RsvpFlowError) {
	switch (error) {
		case "invalid-phone":
			return m.rsvp_error_phone();
		case "not-found":
			return m.rsvp_error_not_found();
		case "rate-limited":
			return m.rsvp_error_rate_limited();
		case "generic":
			return m.rsvp_error_generic();
	}
}

export function RsvpForm({ editRsvp = false }: { editRsvp?: boolean }) {
	const navigate = useNavigate({ from: "/rsvp" });
	const restoredRsvp = useRef(false);
	const {
		phase,
		rsvp,
		invitation,
		error,
		readOnly,
		clearError,
		identify,
		submit,
		update,
		restoreRememberedRsvp,
	} = useRsvpFlow();
	const [phoneNumber, setPhoneNumber] = useState("");
	const [attending, setAttending] = useState<"yes" | "no" | null>(null);
	const [additionalGuestCount, setAdditionalGuestCount] = useState("0");
	const [theory, setTheory] = useState<"girl" | "boy" | null>(null);
	const [website, setWebsite] = useState("");
	const [attendanceError, setAttendanceError] = useState(false);
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
		if ((phase === "confirmed" || phase === "declined") && rsvp) {
			void navigate({ to: "/reveal" });
		}
	}, [navigate, phase, rsvp]);

	useEffect(() => {
		if (restoredRsvp.current) return;
		restoredRsvp.current = true;
		void restoreRememberedRsvp(editRsvp);
	}, [editRsvp, restoreRememberedRsvp]);

	function identifyInvitation(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!submitting) void identify(phoneNumber);
	}

	function fileRsvp(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!invitation || submitting || readOnly) return;
		if (attending === null) {
			setAttendanceError(true);
			return;
		}

		setAttendanceError(false);
		const input = {
			phoneNumber,
			attending: attending === "yes",
			additionalGuestCount: Number(additionalGuestCount),
			theory,
			website,
		};
		if (rsvp) void update(input);
		else void submit(input);
	}

	if ((phase === "confirmed" || phase === "declined") && rsvp) return null;

	return (
		<section className="relative mx-auto min-w-0 max-w-2xl pb-20 sm:pb-24">
			<Card
				variant="manila"
				className="relative min-w-0 px-4 py-8 sm:px-8 sm:py-10"
			>
				<div
					aria-hidden
					className="absolute top-0 right-5 h-3 w-24 -translate-y-1/2 rotate-1 bg-lamp/80 sm:right-10"
				/>
				<header className="border-b border-stone-900/20 pb-6">
					<div className="flex items-start justify-between gap-4">
						<div className="min-w-0">
							<p className="flex items-center gap-2 font-mono text-xs leading-relaxed text-stone-500 sm:text-sm">
								<FileText className="size-3.5" aria-hidden />
								{m.rsvp_kicker()}
							</p>
							<h1 className="display-title mt-2 text-4xl leading-tight text-case-ink sm:text-5xl">
								{phase === "closed" ? m.rsvp_closed_title() : m.rsvp_title()}
							</h1>
						</div>
						<Stamp className="hidden -rotate-6 border-stamp/60 text-stamp/60 sm:block">
							{m.stamp_confidencial()}
						</Stamp>
					</div>
					<p className="mt-3 max-w-prose font-mono text-sm leading-relaxed text-stone-700">
						{phase === "closed" ? m.rsvp_closed_body() : m.rsvp_intro()}
					</p>
				</header>

				<div className="flex flex-col gap-7 pt-7">
					{!invitation ? (
						<form onSubmit={identifyInvitation} noValidate>
							<div className="mb-4 flex items-center gap-3">
								<Badge variant="step">1</Badge>
								<p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-stone-700">
									{m.rsvp_phone_submit()}
								</p>
							</div>
							<Label htmlFor="rsvp-phone" variant="case">
								{m.rsvp_phone_label()}
							</Label>
							<p
								id="rsvp-phone-help"
								className="mt-1 font-mono text-xs leading-relaxed text-stone-500"
							>
								{m.rsvp_phone_help()}
							</p>
							<div className="mt-3 flex flex-col gap-3 sm:flex-row">
								<Input
									id="rsvp-phone"
									value={phoneNumber}
									onChange={(event) => {
										setPhoneNumber(event.target.value);
										clearError();
									}}
									placeholder={m.rsvp_phone_placeholder()}
									autoComplete="tel"
									inputMode="tel"
									aria-describedby="rsvp-phone-help"
									aria-invalid={
										error === "invalid-phone" || error === "not-found"
									}
									variant="manila"
									size="lg"
									className="sm:flex-1"
									disabled={submitting || readOnly}
								/>
								<Button
									type="submit"
									variant="case"
									size="xl"
									disabled={submitting || readOnly}
									className="w-full sm:w-auto"
								>
									<Search aria-hidden />
									{submitting ? m.rsvp_phone_checking() : m.rsvp_phone_submit()}
								</Button>
							</div>
						</form>
					) : null}

					{error ? (
						<div
							role="alert"
							className="flex gap-3 border-l-4 border-stamp bg-red-100/70 p-3 text-stamp"
						>
							<AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
							<p className="font-mono text-sm leading-relaxed">
								{flowErrorMessage(error)}
							</p>
						</div>
					) : null}

					{invitation ? (
						<form
							onSubmit={fileRsvp}
							noValidate
							className="border-t border-stone-900/20 pt-7"
						>
							<div className="flex items-start gap-3">
								<CheckCircle2
									className="mt-0.5 size-5 shrink-0 text-green-800"
									aria-hidden
								/>
								<div className="min-w-0">
									<p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-green-800">
										{m.rsvp_invitation_for()}
									</p>
									<h2 className="display-title mt-1 break-words text-3xl leading-tight text-case-ink sm:text-4xl">
										{invitation.name}
									</h2>
									<p className="mt-1 font-mono text-xs leading-relaxed text-stone-500">
										{m.rsvp_response_intro()}
									</p>
								</div>
							</div>

							<fieldset
								disabled={submitting || readOnly}
								className="mt-7 flex flex-col gap-7"
							>
								<div>
									<div className="mb-4 flex items-center gap-3">
										<Badge variant="step">2</Badge>
										<div>
											<p className="font-mono text-sm font-bold text-stone-800">
												{m.rsvp_attending_label()}
											</p>
											<p className="font-mono text-xs leading-relaxed text-stone-500">
												{m.rsvp_attending_help()}
											</p>
										</div>
									</div>
									<RadioGroup
										value={attending ?? ""}
										onValueChange={(value) => {
											setAttending(value as "yes" | "no");
											setAttendanceError(false);
										}}
										aria-invalid={attendanceError}
										className="grid gap-3 sm:grid-cols-2"
									>
										{(
											[
												["yes", m.rsvp_attending_yes()],
												["no", m.rsvp_attending_no()],
											] as const
										).map(([value, label]) => (
											<Label key={value} variant="choice">
												<RadioGroupItem value={value} aria-label={label} />
												{label}
											</Label>
										))}
									</RadioGroup>
									{attendanceError ? (
										<p
											role="alert"
											className="mt-2 font-mono text-xs text-stamp"
										>
											{m.rsvp_error_attending()}
										</p>
									) : null}
								</div>

								{attending === "yes" &&
								invitation.additionalGuestAllowance > 0 ? (
									<div className="border-t border-stone-900/15 pt-6">
										<p className="font-mono text-sm font-bold text-stone-800">
											{m.rsvp_additional_guests_label()}
										</p>
										<p className="mt-1 font-mono text-xs leading-relaxed text-stone-500">
											{m.rsvp_additional_guests_help({
												count: invitation.additionalGuestAllowance,
											})}
										</p>
										<ToggleGroup
											type="single"
											variant="case"
											value={additionalGuestCount}
											onValueChange={(value) =>
												value && setAdditionalGuestCount(value)
											}
											className="mt-3 grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap"
										>
											{Array.from(
												{ length: invitation.additionalGuestAllowance + 1 },
												(_, count) => String(count),
											).map((value) => (
												<ToggleGroupItem
													key={value}
													value={value}
													className="min-h-11 min-w-0 whitespace-normal px-2 text-center leading-tight"
												>
													{m.rsvp_additional_guests_count({
														count: Number(value),
													})}
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</div>
								) : null}

								<div className="border-t border-stone-900/15 pt-6">
									<p className="font-mono text-sm font-bold text-stone-800">
										{m.rsvp_theory_label()}
									</p>
									<p className="mt-1 font-mono text-xs leading-relaxed text-stone-500">
										{m.rsvp_theory_help()}
									</p>
									<ToggleGroup
										type="single"
										value={theory ?? ""}
										onValueChange={(value) =>
											setTheory(
												value === "girl" || value === "boy" ? value : null,
											)
										}
										className="mt-3 grid w-full grid-cols-2 gap-3"
									>
										<ToggleGroupItem
											value="girl"
											variant="girl"
											className="min-h-12 min-w-0"
										>
											{m.rsvp_theory_girl()}
										</ToggleGroupItem>
										<ToggleGroupItem
											value="boy"
											variant="boy"
											className="min-h-12 min-w-0"
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
									variant="case"
									size="xl"
									disabled={submitting || readOnly}
									className="w-full text-sm"
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
				</div>
			</Card>
		</section>
	);
}
