import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

import { Button } from "#/components/ui/button";

export interface VariantMeta {
	key: string;
	name: string;
}

/**
 * Floating prototype switcher. Dev-only (gated at the call site).
 * Cycles variants with arrows or the left/right arrow keys.
 * The parent owns navigation and keeps ?variant= in the URL.
 */
export function PrototypeSwitcher({
	variants,
	current,
	onSelect,
}: {
	variants: readonly VariantMeta[];
	current: string;
	onSelect: (key: string) => void;
}) {
	const index = Math.max(
		0,
		variants.findIndex((v) => v.key === current),
	);

	const go = (next: number) => {
		const target = variants[(next + variants.length) % variants.length];
		onSelect(target.key);
	};

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			if (target?.closest("input, textarea, select, [contenteditable]")) return;
			if (event.key === "ArrowLeft") go(index - 1);
			if (event.key === "ArrowRight") go(index + 1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	return (
		<div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/90 px-2 py-1.5 shadow-lg backdrop-blur">
			<Button
				type="button"
				size="icon"
				variant="ghost"
				aria-label="Previous variant"
				onClick={() => go(index - 1)}
			>
				<ChevronLeft />
			</Button>
			<span className="min-w-40 text-center text-xs font-medium">
				<span className="font-mono text-muted-foreground">{current}</span>
				{" · "}
				{variants[index]?.name}
			</span>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				aria-label="Next variant"
				onClick={() => go(index + 1)}
			>
				<ChevronRight />
			</Button>
		</div>
	);
}
