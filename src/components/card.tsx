import type { ComponentProps } from "preact";
import { cn } from "tailwind-variants";

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn("flex flex-col gap-4 border border-overlay bg-surface p-6", className)}
    />
  );
}
