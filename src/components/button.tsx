import type { ComponentProps } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonStyles = tv({
  base: "px-4 py-2 font-semibold transition-colors disabled:opacity-60",
  variants: {
    intent: {
      primary: "bg-primary text-mauve-950 hover:bg-primary/90",
      ghost: "bg-transparent text-emerald-700 hover:text-emerald-700/80",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button">;

export function Button({ intent, className, ...props }: ButtonProps) {
  return <button {...props} className={buttonStyles({ intent, className })} />;
}
