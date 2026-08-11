import { useCallback, useEffect, useState } from "react";
import LocaleSwitcher from "#/components/LocaleSwitcher";
import { LAMP_GLOW } from "#/components/landing/case-ui";
import { EnvelopeIntro } from "#/components/landing/envelope-intro";
import { Invitation } from "#/components/landing/invitation";
import { RsvpSection } from "#/components/landing/rsvp-section";
import { StoryReel } from "#/components/landing/story-reel";
import { Button } from "#/components/ui/button";
import { m } from "#/paraglide/messages";

type Stage = "envelope" | "story" | "invite";

/**
 * The Detective's Desk: the Secret Envelope opens on load, the story
 * plays as auto-advancing scenes, and the guest lands on the invitation
 * with the RSVP typed onto the case file.
 */
export function Landing() {
	const [stage, setStage] = useState<Stage>("envelope");
	const [envelopeStep, setEnvelopeStep] = useState(0);

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

	return (
		<main className="relative min-h-svh overflow-x-clip">
			<div aria-hidden className={LAMP_GLOW} />
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]"
			/>

			<LocaleSwitcher />

			{stage === "envelope" ? <EnvelopeIntro step={envelopeStep} /> : null}

			{stage === "story" ? <StoryReel onComplete={completeStory} /> : null}

			{stage === "invite" ? (
				<div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-24 px-4 py-16 sm:py-24">
					<Invitation onCta={scrollToRsvp} />
					<RsvpSection />
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
						{m.story_skip()}
					</Button>
				</div>
			) : null}
		</main>
	);
}
