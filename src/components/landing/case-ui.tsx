import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Shared noir primitives for the landing: the manila case-file surfaces,
 * typewriter labels, and the rubber stamp. Colors come from the theme
 * tokens in styles.css (case-paper, case-ink, lamp, stamp, string).
 */

export const MANILA_CARD =
	"rounded-md bg-case-paper text-case-ink shadow-2xl ring-stone-900/30";

export const INPUT_MANILA =
	"rounded-md border-stone-900/30 bg-amber-50/80 font-mono text-case-ink placeholder:text-stone-500 focus-visible:border-stamp focus-visible:ring-stamp/30";

export const MONO_LABEL =
	"font-mono text-[11px] uppercase tracking-[0.2em] text-stone-600";

export const PRIMARY_BUTTON =
	"rounded-md bg-case-ink font-mono text-xs uppercase tracking-[0.2em] text-case-paper hover:bg-stone-800";

export const TOGGLE_ITEM =
	"rounded-md border-stone-900/30 bg-amber-50/70 font-mono text-xs text-stone-700 hover:bg-amber-200/70 data-[state=on]:border-stone-900 data-[state=on]:bg-case-ink data-[state=on]:text-case-paper aria-pressed:bg-case-ink aria-pressed:text-case-paper";

export const THEORY_ITEM =
	"rounded-md border-stone-900/30 bg-amber-50/70 font-mono text-xs text-stone-700 hover:bg-amber-200/70 data-[state=on]:border-stone-900 data-[state=on]:text-case-ink aria-pressed:text-case-ink";

/** The lamp pool that lights the desk from above. */
export const LAMP_GLOW =
	"pointer-events-none absolute inset-x-0 top-0 h-[75vh] bg-[radial-gradient(ellipse_65%_55%_at_50%_0%,rgba(251,191,36,0.22),rgba(251,191,36,0.05)_45%,transparent_72%)]";

/** Rubber stamp, hit at an angle. Children are the ink text. */
export function Stamp({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			aria-hidden
			className={`pointer-events-none w-fit border-[3px] px-2 py-1 font-mono text-[10px] tracking-[0.3em] ${className}`}
		>
			{children}
		</div>
	);
}

/** One line of case facts: icon medallion plus typewriter text. */
export function FactItem({
	icon: Icon,
	label,
	children,
}: {
	icon: LucideIcon;
	label?: string;
	children: ReactNode;
}) {
	return (
		<li className="flex items-center gap-3">
			<span className="grid size-9 shrink-0 place-items-center rounded-full border border-stone-900/20 bg-amber-50/70 text-stamp">
				<Icon className="size-4" aria-hidden />
			</span>
			<span className="font-mono text-sm text-stone-800">
				{label ? (
					<span className="mb-0.5 block text-[10px] uppercase tracking-[0.25em] text-stone-500">
						{label}
					</span>
				) : null}
				{children}
			</span>
		</li>
	);
}
