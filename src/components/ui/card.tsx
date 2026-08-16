import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

const cardVariants = cva(
	"group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-md py-(--card-spacing) text-sm ring-1 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-backwards motion-safe:duration-500 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-md *:[img:last-child]:rounded-b-md",
	{
		variants: {
			variant: {
				default: "bg-stone-900 text-case-paper ring-lamp/30 shadow-2xl",
				manila: "bg-case-paper text-case-ink ring-stone-900/30 shadow-2xl",
				paper: "bg-amber-50 text-case-ink ring-stone-900/30 shadow-2xl",
				panel:
					"bg-stone-900/80 text-case-paper ring-lamp/30 shadow-[8px_8px_0_rgba(185,28,28,0.2)]",
				destructive:
					"bg-stone-950 text-case-paper ring-stamp shadow-[10px_10px_0_rgba(185,28,28,0.35)]",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

function Card({
	className,
	size = "default",
	variant = "default",
	...props
}: React.ComponentProps<"div"> &
	VariantProps<typeof cardVariants> & { size?: "default" | "sm" }) {
	return (
		<div
			data-slot="card"
			data-size={size}
			data-variant={variant}
			className={cn(cardVariants({ variant }), className)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"group/card-header @container/card-header grid auto-rows-min items-start gap-2 rounded-t-md px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("display-title text-3xl font-medium", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn(
				"font-mono text-sm leading-relaxed text-stone-400 group-data-[variant=manila]/card:text-stone-700 group-data-[variant=paper]/card:text-stone-700",
				className,
			)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-(--card-spacing)", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"flex items-center rounded-b-md px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
