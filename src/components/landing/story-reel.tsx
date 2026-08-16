import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";

import { MANILA_CARD, PRIMARY_BUTTON } from "#/components/landing/case-ui";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { m } from "#/paraglide/messages";

const FADE_MS = 150;

/**
 * The short film: five story beats typed onto the case file. Case tabs and
 * arrow controls move between scenes; continuing from the last scene lands
 * the guest on the invitation.
 */
export function StoryReel({ onComplete }: { onComplete: () => void }) {
	const [index, setIndex] = useState(0);
	const [pendingIndex, setPendingIndex] = useState<number | null>(null);
	const [finishing, setFinishing] = useState(false);

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
		if (pendingIndex === null && !finishing) return;
		const nextIndex = pendingIndex;
		const id = window.setTimeout(() => {
			if (finishing) {
				onComplete();
				return;
			}
			if (nextIndex !== null) {
				setIndex(nextIndex);
				setPendingIndex(null);
			}
		}, FADE_MS);
		return () => window.clearTimeout(id);
	}, [pendingIndex, finishing, onComplete]);

	const beat = beats[index];
	const showSecondaryPhoto = index < 4;
	const fadingOut = pendingIndex !== null || finishing;

	return (
		<section
			aria-live="polite"
			className="relative z-10 mx-auto flex min-h-svh w-full max-w-3xl flex-col items-center gap-2 px-4 pt-20 pb-16 sm:pt-24"
		>
			<div className="flex w-full items-end justify-between gap-2">
				<div className="flex items-end gap-1">
					{beats.map((storyBeat, beatIndex) => (
						<button
							key={storyBeat.kicker}
							type="button"
							onClick={() => {
								if (!fadingOut && beatIndex !== index) {
									setPendingIndex(beatIndex);
								}
							}}
							disabled={fadingOut}
							aria-current={beatIndex === index}
							aria-label={m.story_scene_aria({
								number: beatIndex + 1,
								title: storyBeat.title,
							})}
							className={`rounded-t-md border border-stone-700 px-3 py-1.5 font-mono text-[11px] tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-lamp-deep ${
								beatIndex === index
									? "bg-case-paper text-case-ink"
									: "bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-amber-100"
							}`}
						>
							{String(beatIndex + 1).padStart(2, "0")}
						</button>
					))}
				</div>
			</div>

			<Card
				key={index}
				className={`w-full ${MANILA_CARD} motion-safe:transition-opacity motion-safe:duration-150 ${fadingOut ? "motion-safe:opacity-0" : "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150"}`}
			>
				<CardHeader>
					<div className="flex items-center gap-2 font-mono text-sm leading-relaxed text-stone-500">
						<FolderOpen className="size-3.5" aria-hidden />
						{beat.kicker}
					</div>
					<p className="font-mono text-xs leading-relaxed text-stone-500">
						{m.story_sealed_note()}
					</p>
					<CardTitle className="display-title text-3xl text-case-ink sm:text-4xl">
						{beat.title}
					</CardTitle>
					<CardDescription className="max-w-prose font-mono text-sm leading-relaxed text-stone-700">
						{beat.body}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex items-end justify-between gap-4">
					{showSecondaryPhoto ? (
						<span className="font-mono text-sm leading-relaxed text-stone-500">
							{m.event_parents()}
						</span>
					) : null}
					<figure
						className={`relative w-36 rotate-3 bg-stone-100 p-1.5 shadow-lg sm:w-44 ${showSecondaryPhoto ? "ml-auto" : "mx-auto pb-6"}`}
					>
						<div
							aria-hidden
							className="absolute -top-2 left-1/2 z-10 h-4 w-14 -translate-x-1/2 -rotate-3 bg-lamp/80"
						/>
						{showSecondaryPhoto ? (
							<img
								src="/assets/secondary-landscape-512.webp"
								srcSet="/assets/secondary-landscape-512.webp 512w, /assets/secondary-landscape-1024.webp 1024w"
								sizes="(min-width: 640px) 176px, 144px"
								alt={m.alt_couple()}
								width={512}
								height={341}
								className="w-full grayscale contrast-125"
							/>
						) : (
							<img
								src="/assets/baby-ultrasound-384.webp"
								alt={m.alt_ultrasound()}
								width={384}
								height={288}
								className="w-full grayscale contrast-125"
							/>
						)}
						{showSecondaryPhoto ? null : (
							<figcaption className="mt-1.5 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-stone-500">
								{m.exhibit_a()}
							</figcaption>
						)}
					</figure>
				</CardContent>
				<CardFooter className="justify-between gap-3">
					<Button
						type="button"
						variant="outline"
						size="icon-sm"
						onClick={() => setPendingIndex(index - 1)}
						disabled={index === 0 || fadingOut}
						aria-label={m.story_previous()}
						className="rounded-md border-stone-900/30 bg-transparent text-case-ink hover:bg-amber-200/70 hover:text-case-ink"
					>
						<ChevronLeft aria-hidden />
					</Button>
					{index === beats.length - 1 ? (
						<Button
							type="button"
							size="sm"
							onClick={() => setFinishing(true)}
							disabled={fadingOut}
							className={`${PRIMARY_BUTTON} h-8 px-2.5 text-[10px] tracking-[0.12em]`}
						>
							{m.story_continue()}
							<ChevronRight aria-hidden />
						</Button>
					) : (
						<Button
							type="button"
							variant="outline"
							size="icon-sm"
							onClick={() => setPendingIndex(index + 1)}
							disabled={fadingOut}
							aria-label={m.story_next()}
							className="rounded-md border-stone-900/30 bg-transparent text-case-ink hover:bg-amber-200/70 hover:text-case-ink"
						>
							<ChevronRight aria-hidden />
						</Button>
					)}
				</CardFooter>
			</Card>
		</section>
	);
}
