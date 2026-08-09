import type { ComponentProps } from "preact";
import { useId } from "preact/hooks";
import { cn, tv, type VariantProps } from "tailwind-variants";
import { Label } from "./typography";

export const inputStyles = tv({
  base: "w-full border border-overlay bg-surface px-3 py-2 text-text transition-colors placeholder:text-subtle/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 motion-reduce:transition-none",
  variants: {
    invalid: {
      true: "border-destructive focus:border-destructive focus:ring-destructive/40",
    },
  },
});

export type InputProps = VariantProps<typeof inputStyles> & ComponentProps<"input">;

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={inputStyles({ invalid, className })}
    />
  );
}

export type TextFieldProps = InputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, className, ...props }: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...props}
        id={id}
        invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
