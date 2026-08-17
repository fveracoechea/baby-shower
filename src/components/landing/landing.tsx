import { useCallback, useEffect, useState } from "react";
import { GuestNavigation } from "#/components/GuestNavigation";
import { LAMP_GLOW } from "#/components/landing/case-ui";
import { EnvelopeIntro } from "#/components/landing/envelope-intro";
import { Invitation, Witnesses } from "#/components/landing/invitation";
import { StoryReel } from "#/components/landing/story-reel";

type Stage = "envelope" | "story" | "invite";
export type LandingView = "case" | "invitation";

/**
 * The Detective's Desk: the Secret Envelope opens on load, the story
 * plays as auto-advancing scenes, and the guest lands on the invitation
 * and then lands the Guest on the Invitation.
 */
export function Landing({
	view = "case",
	guestName,
}: {
	view?: LandingView;
	guestName: string | null;
}) {
	const [stage, setStage] = useState<Stage>(
		view === "invitation" ? "invite" : "envelope",
	);
	const [envelopeStep, setEnvelopeStep] = useState(0);

	useEffect(() => {
		if (view === "invitation") {
			setStage("invite");
			return;
		}
		setEnvelopeStep(0);
		setStage("envelope");
	}, [view]);

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

	const completeStory = useCallback(() => setStage("invite"), []);

	return (
		<main className="relative min-h-svh overflow-x-clip">
			<div aria-hidden className={LAMP_GLOW} />
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]"
			/>

			<GuestNavigation
				active={stage === "invite" ? "invitation" : "case"}
				onCase={() => {
					setEnvelopeStep(0);
					setStage("envelope");
				}}
				onInvitation={() => setStage("invite")}
			/>

			{stage === "envelope" ? <EnvelopeIntro step={envelopeStep} /> : null}

			{stage === "story" ? <StoryReel onComplete={completeStory} /> : null}

			{stage === "invite" ? (
				<div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-16 px-4 pt-20 pb-16 sm:py-24">
					<Invitation guestName={guestName} />
					<Witnesses />
				</div>
			) : null}
		</main>
	);
}
