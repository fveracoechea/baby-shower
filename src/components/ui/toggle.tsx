import { cva } from "class-variance-authority";

const toggleVariants = cva(
	"group/toggle inline-flex items-center justify-center gap-1 rounded-md text-sm leading-[normal] font-medium whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					"bg-transparent hover:bg-muted hover:text-foreground aria-pressed:bg-muted",
				outline: "border border-input bg-transparent hover:bg-muted",
				case: "border border-stone-900/30 bg-amber-50/70 font-mono text-xs text-stone-700 hover:bg-amber-200/70 data-[state=on]:border-stone-900 data-[state=on]:bg-case-ink data-[state=on]:text-case-paper aria-pressed:border-stone-900 aria-pressed:bg-case-ink aria-pressed:text-case-paper",
				theory:
					"border border-stone-900/30 bg-amber-50/70 font-mono text-xs text-stone-700 hover:bg-amber-200/70 data-[state=on]:border-stone-900 data-[state=on]:text-case-ink aria-pressed:text-case-ink",
				girl: "border border-stone-900/30 bg-amber-50/70 font-mono text-xs text-stone-700 hover:bg-amber-200/70 data-[state=on]:border-stone-900 data-[state=on]:bg-pink-300 data-[state=on]:text-case-ink aria-pressed:bg-pink-300 aria-pressed:text-case-ink",
				boy: "border border-stone-900/30 bg-amber-50/70 font-mono text-xs text-stone-700 hover:bg-amber-200/70 data-[state=on]:border-stone-900 data-[state=on]:bg-sky-300 data-[state=on]:text-case-ink aria-pressed:bg-sky-300 aria-pressed:text-case-ink",
				nav: "rounded-none border-b border-transparent bg-transparent font-mono text-xs uppercase tracking-[0.06em] text-stone-400 hover:text-amber-100 data-[state=on]:border-lamp data-[state=on]:text-amber-100 aria-pressed:border-lamp aria-pressed:text-amber-100 md:h-10 md:min-w-10 md:px-3 md:text-sm",
			},
			size: {
				default:
					"h-9 min-w-9 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
				sm: "h-8 min-w-8 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
				lg: "h-10 min-w-10 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export { toggleVariants };
