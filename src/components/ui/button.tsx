import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm leading-[normal] font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "bg-lamp font-bold text-case-ink hover:bg-lamp-deep",
				case: "bg-case-ink font-mono text-xs uppercase tracking-[0.2em] text-case-paper hover:bg-stone-800",
				outline:
					"border-stone-600 bg-transparent text-stone-200 hover:border-lamp hover:text-case-paper aria-expanded:border-lamp",
				"case-outline":
					"border-stone-900/30 bg-transparent text-case-ink hover:bg-amber-200/70 hover:text-case-ink",
				"dark-outline":
					"border-amber-100/30 bg-transparent font-mono text-amber-100 hover:bg-stone-800 hover:text-amber-50",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
				ghost:
					"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
				destructive:
					"bg-stamp font-bold text-white hover:bg-red-800 focus-visible:border-red-300 focus-visible:ring-red-500/30",
				text: "h-auto border-0 bg-transparent p-0 font-bold text-lamp hover:text-lamp-deep",
				dangerText:
					"h-auto border-0 bg-transparent p-0 font-bold text-red-300 hover:text-red-200",
				nav: "rounded-none border-b border-transparent bg-transparent font-mono text-xs uppercase tracking-[0.06em] text-stone-400 hover:text-amber-100 data-[active=true]:border-b-lamp data-[active=true]:text-amber-100 data-[state=on]:border-lamp data-[state=on]:text-amber-100 sm:text-[10px]",
				folder:
					"rounded-b-none rounded-t-md border-stone-700 bg-stone-900 font-mono text-[11px] tracking-widest text-stone-300 hover:bg-stone-800 hover:text-amber-100 aria-current:border-case-paper aria-current:bg-case-paper aria-current:text-case-ink",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default:
					"h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
				xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
				lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
				xl: "h-12 gap-2 px-5",
				icon: "size-9",
				"icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button };
