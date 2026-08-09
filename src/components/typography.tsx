import type { ComponentProps } from "preact";
import { cn } from "tailwind-variants";

export function H1({ className, ...props }: ComponentProps<"h1">) {
  return <h1 {...props} className={cn("font-display text-4xl font-bold text-emerald-600", className)} />;
}

export function H2({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2 {...props} className={cn("font-display text-2xl font-semibold text-rose-500", className)} />
  );
}

export function H3({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 {...props} className={cn("font-display text-xl font-semibold text-text", className)} />
  );
}

export function H4({ className, ...props }: ComponentProps<"h4">) {
  return (
    <h4 {...props} className={cn("font-display text-lg font-semibold text-text", className)} />
  );
}

export function P({ className, ...props }: ComponentProps<"p">) {
  return <p {...props} className={cn("leading-relaxed", className)} />;
}

export const labelStyles = "text-sm font-medium text-subtle";

export function Label({
  htmlFor,
  className,
  children,
  ...props
}: ComponentProps<"label"> & { htmlFor: string }) {
  return (
    <label {...props} htmlFor={htmlFor} className={cn(labelStyles, className)}>
      {children}
    </label>
  );
}
