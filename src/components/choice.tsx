import type { ComponentProps } from "preact";
import { Check, type LucideIcon } from "lucide-preact";
import { cn, tv, type VariantProps } from "tailwind-variants";
import { labelStyles } from "./typography";

export const choiceStyles = tv({
  slots: {
    root: "relative block cursor-pointer",
    input: "peer sr-only",
    card: "flex items-center gap-3 border border-overlay bg-surface p-3 [--choice:var(--color-subtle)] transition-colors hover:border-mauve-400 peer-checked:border-(--choice) peer-checked:bg-(--choice)/5 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 motion-reduce:transition-none",
    tile: "grid size-9 shrink-0 place-items-center bg-(--choice)/10 text-(--choice) transition-colors motion-reduce:transition-none",
    badge:
      "absolute -top-2 -right-2 grid size-5 -rotate-6 scale-50 place-items-center rounded-full bg-(--choice) text-mauve-950 opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100 motion-reduce:transition-none",
    title: "text-sm font-semibold text-text",
  },
  variants: {
    accent: {
      primary: { card: "peer-checked:[--choice:var(--color-primary)]" },
      secondary: { card: "peer-checked:[--choice:var(--color-secondary)]" },
      neutral: { badge: "text-white" },
    },
  },
  defaultVariants: { accent: "primary" },
});

export type ChoiceControlProps = VariantProps<typeof choiceStyles> &
  Omit<ComponentProps<"input">, "type"> & {
    icon: LucideIcon;
    label: string;
  };

function ChoiceControl({
  type,
  accent,
  icon: Icon,
  label,
  className,
  ...props
}: ChoiceControlProps & { type: "radio" | "checkbox" }) {
  const s = choiceStyles({ accent });

  return (
    <label className={s.root({ className })}>
      <input {...props} type={type} className={s.input()} />
      <span className={s.card()}>
        <span className={s.tile()}>
          <Icon size={18} aria-hidden="true" />
        </span>
        <span className={s.title()}>{label}</span>
      </span>
      <span className={s.badge()}>
        <Check size={12} strokeWidth={3} aria-hidden="true" />
      </span>
    </label>
  );
}

export type RadioProps = ChoiceControlProps;

export function Radio(props: RadioProps) {
  return <ChoiceControl {...props} type="radio" />;
}

export type CheckboxProps = ChoiceControlProps;

export function Checkbox(props: CheckboxProps) {
  return <ChoiceControl {...props} type="checkbox" />;
}

export type ChoiceGroupProps = ComponentProps<"fieldset"> & {
  legend: string;
  error?: string;
};

export function ChoiceGroup({ legend, error, className, children, ...props }: ChoiceGroupProps) {
  return (
    <fieldset {...props} className={cn("flex min-w-0 flex-col gap-2", className)}>
      <legend className={labelStyles}>{legend}</legend>
      <div className="grid grid-cols-2 gap-3">{children}</div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </fieldset>
  );
}
