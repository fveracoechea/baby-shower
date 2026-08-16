import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

const inputVariants = cva(
	"w-full min-w-0 rounded-md border px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm",
	{
		variants: {
			variant: {
				default:
					"border-stone-600 bg-stone-950 text-case-paper focus-visible:border-lamp focus-visible:ring-lamp/30",
				manila:
					"border-stone-900/30 bg-amber-50/80 font-mono text-case-ink placeholder:text-stone-500 focus-visible:border-stamp focus-visible:ring-stamp/30",
			},
			size: { default: "h-11", lg: "h-12 text-base" },
		},
		defaultVariants: { variant: "default", size: "default" },
	},
);

function Input({
	className,
	type,
	variant = "default",
	size = "default",
	...props
}: Omit<React.ComponentProps<"input">, "size"> &
	VariantProps<typeof inputVariants>) {
	return (
		<input
			type={type}
			data-slot="input"
			data-variant={variant}
			data-size={size}
			className={cn(inputVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Input };
