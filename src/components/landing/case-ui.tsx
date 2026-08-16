import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "#/components/ui/badge";

/**
 * Shared noir primitives for the landing: the manila case-file surfaces,
 * typewriter labels, and the rubber stamp. Colors come from the theme
 * tokens in styles.css (case-paper, case-ink, lamp, stamp, string).
 */

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
		<Badge
			aria-hidden
			variant="stamp"
			className={`pointer-events-none ${className}`}
		>
			{children}
		</Badge>
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
					<span className="mb-0.5 block text-xs leading-relaxed text-stone-500">
						{label}
					</span>
				) : null}
				{children}
			</span>
		</li>
	);
}
