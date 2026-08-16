"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Separator as SeparatorPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

const separatorVariants = cva(
	"shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
	{
		variants: {
			variant: {
				default: "bg-border",
				case: "bg-stone-900/15",
				dark: "bg-amber-100/15",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	variant = "default",
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> &
	VariantProps<typeof separatorVariants>) {
	return (
		<SeparatorPrimitive.Root
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			data-variant={variant}
			className={cn(separatorVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Separator };
