import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-center font-mono text-xs leading-none",
	{
		variants: {
			variant: {
				default: "border border-lamp/40 bg-lamp/10 px-2 py-1 text-lamp",
				step: "size-7 rounded-full bg-case-ink text-case-paper",
				awaiting: "text-stone-400",
				attending: "text-lamp",
				declined: "text-red-300",
				stamp:
					"border-[3px] border-stamp px-2 py-1 text-[10px] tracking-[0.3em] text-stamp",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

function Badge({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return (
		<span
			data-slot="badge"
			data-variant={variant}
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge };
