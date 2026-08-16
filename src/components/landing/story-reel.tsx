import { FolderOpen, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { MANILA_CARD, Stamp } from "#/components/landing/case-ui";
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
import { m } from "#/paraglide/messages";

const BEAT_MS = 3200;

/**
 * The short film: the five story beats typed onto the case file,
 * auto-advancing under the lamp. Case tabs jump to a scene (and pause
 * the reel); the play/pause control resumes. When the last beat ends,
 * onComplete lands the guest on the invitation.
 */
export function StoryReel({ onComplete }: { onComplete: () => void }) {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	const beats = [
		{
			kicker: m.envelope_case_number(),
			title: m.beat1_title(),
			body: m.beat1_body(),
		},
		{
			kicker: m.beat2_kicker(),
			title: m.beat2_title(),
			body: m.beat2_body(),
		},
		{
			kicker: m.beat3_kicker(),
			title: m.beat3_title(),
			body: m.beat3_body(),
		},
		{
			kicker: m.beat4_kicker(),
			title: m.beat4_title(),
			body: m.beat4_body(),
		},
		{
			kicker: m.beat5_kicker(),
			title: m.beat5_title(),
			body: m.beat5_body({
				date: m.event_date_long(),
				time: m.event_time(),
				city: m.event_city(),
			}),
		},
	];

	useEffect(() => {
		if (paused) return;
		const id = window.setTimeout(() => {
			if (index < beats.length - 1) {
				setIndex(index + 1);
			} else {
				onComplete();
			}
		}, BEAT_MS);
		return () => window.clearTimeout(id);
	}, [index, paused, onComplete, beats.length]);

	const beat = beats[index];

	return (
		<section
			aria-live="polite"
			className="relative z-10 mx-auto flex min-h-svh w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16"
		>
			<div className="flex w-full items-end justify-between gap-2">
				<div className="flex items-end gap-1">
					{beats.map((storyBeat, beatIndex) => (
						<button
							key={storyBeat.kicker}
							type="button"
							onClick={() => {
								setIndex(beatIndex);
								setPaused(true);
							}}
							aria-current={beatIndex === index}
							aria-label={m.story_scene_aria({
								number: beatIndex + 1,
								title: storyBeat.title,
							})}
							className={`rounded-t-md px-3 py-1.5 font-mono text-[11px] tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-lamp-deep ${
								beatIndex === index
									? "bg-case-paper text-case-ink"
									: "bg-stone-800/80 text-stone-500 hover:bg-stone-700 hover:text-stone-200"
							}`}
						>
							{String(beatIndex + 1).padStart(2, "0")}
						</button>
					))}
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					onClick={() => setPaused((value) => !value)}
					aria-label={paused ? m.story_play() : m.story_pause()}
					className="mb-0.5 rounded-md text-stone-500 hover:bg-stone-800 hover:text-lamp"
				>
					{paused ? <Play aria-hidden /> : <Pause aria-hidden />}
				</Button>
			</div>

			<Card
				key={index}
				className={`w-full -rotate-1 ${MANILA_CARD} motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500`}
			>
				<CardHeader>
					<div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-stone-500">
						<FolderOpen className="size-3.5" aria-hidden />
						{beat.kicker}
					</div>
					<CardTitle className="display-title text-3xl text-case-ink sm:text-4xl">
						{beat.title}
					</CardTitle>
					<CardAction>
						<Stamp className="rotate-12 border-stamp/70 text-stamp/70">
							{m.stamp_confidencial()}
						</Stamp>
					</CardAction>
					<CardDescription className="max-w-prose font-mono text-sm leading-relaxed text-stone-700">
						{beat.body}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-end">
					<figure className="relative w-28 rotate-3 bg-stone-100 p-1.5 pb-6 shadow-lg sm:w-36">
						<div
							aria-hidden
							className="absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 -rotate-3 bg-lamp/80"
						/>
						<img
							src="/assets/baby-ultrasound-384.webp"
							alt={m.alt_ultrasound()}
							width={384}
							height={288}
							className="w-full grayscale contrast-125"
						/>
						<figcaption className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-stone-500">
							{m.exhibit_a()}
						</figcaption>
					</figure>
				</CardContent>
				<CardFooter className="justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-stone-500">
					<span>
						{m.story_scene_counter({
							current: index + 1,
							total: beats.length,
						})}
					</span>
					<span>{m.story_sealed_note()}</span>
				</CardFooter>
			</Card>
		</section>
	);
}
