import { cva, type VariantProps } from "class-variance-authority";
import { Label as LabelPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

const labelVariants = cva(
	"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "",
				case: "font-mono leading-relaxed text-stone-600",
				field: "text-xs font-bold uppercase tracking-[0.16em] text-stone-300",
				choice:
					"min-h-12 cursor-pointer gap-3 rounded-md border border-stone-900/20 bg-amber-50/60 px-4 py-3 font-mono text-sm text-stone-700 has-data-checked:border-stone-900 has-data-checked:bg-amber-200/80 has-data-checked:text-case-ink",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

function Label({
	className,
	variant = "default",
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
	VariantProps<typeof labelVariants>) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			data-variant={variant}
			className={cn(labelVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Label };
