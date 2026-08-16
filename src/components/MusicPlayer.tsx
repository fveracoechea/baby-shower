import { useLocation } from "@tanstack/react-router";
import { Music2, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "#/components/ui/button";
import { m } from "#/paraglide/messages";

const DEFAULT_VOLUME = 0.8;

/** Guest-controlled background score that persists across Guest page navigation. */
export function MusicPlayer() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [volume, setVolume] = useState(DEFAULT_VOLUME);
	const isAdmin = /(^|\/)admin(?:\/|$)/.test(pathname);

	useEffect(() => {
		if (audioRef.current) audioRef.current.volume = volume;
	}, [volume]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !isPlaying || isAdmin) return;

		function removeUnlockListeners() {
			document.removeEventListener("pointerdown", startPlayback);
			document.removeEventListener("keydown", startPlayback);
		}

		async function startPlayback() {
			try {
				await audio?.play();
				removeUnlockListeners();
			} catch {
				// Browsers can require a Guest interaction before unmuted playback.
			}
		}

		void startPlayback();
		document.addEventListener("pointerdown", startPlayback);
		document.addEventListener("keydown", startPlayback);

		return removeUnlockListeners;
	}, [isAdmin, isPlaying]);

	useEffect(() => {
		if (!isAdmin) return;
		audioRef.current?.pause();
		setIsPlaying(false);
	}, [isAdmin]);

	async function togglePlayback() {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
			setIsPlaying(false);
			return;
		}

		try {
			await audio.play();
			setIsPlaying(true);
		} catch {
			setIsPlaying(false);
		}
	}

	if (isAdmin) return null;

	return (
		<aside className="pointer-events-auto fixed right-3 bottom-3 z-50 flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-md border border-stone-700 bg-stone-950/90 p-1.5 text-amber-100 shadow-2xl backdrop-blur-md sm:right-4 sm:bottom-4">
			{/* biome-ignore lint/a11y/useMediaCaption: This soundtrack is instrumental and has no speech to caption. */}
			<audio
				ref={audioRef}
				src="/assets/mystery-soundtrack.mp3"
				preload="none"
				autoPlay
				loop
				onPause={() => setIsPlaying(false)}
			/>
			<Button
				type="button"
				size="icon"
				onClick={togglePlayback}
				aria-label={isPlaying ? m.music_pause() : m.music_play()}
				aria-pressed={isPlaying}
			>
				{isPlaying ? (
					<Pause className="size-4" aria-hidden />
				) : (
					<Play className="size-4 translate-x-px" aria-hidden />
				)}
			</Button>
			<div className="min-w-0 pr-1">
				<div className="flex items-center gap-1.5">
					<Music2 className="size-3 shrink-0 text-lamp" aria-hidden />
					<p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-stone-300">
						{m.music_title()}
					</p>
				</div>
				{isPlaying ? (
					<label className="mt-1 flex items-center gap-2">
						<Volume2 className="size-3 shrink-0 text-stone-500" aria-hidden />
						<span className="sr-only">{m.music_volume()}</span>
						<input
							type="range"
							min="0"
							max="1"
							step="0.05"
							value={volume}
							onChange={(event) => setVolume(Number(event.target.value))}
							className="h-1 w-28 cursor-pointer accent-amber-300"
						/>
					</label>
				) : (
					<p className="font-mono text-[9px] text-stone-500">
						{m.music_play_hint()}
					</p>
				)}
			</div>
		</aside>
	);
}
