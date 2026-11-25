import { Toggle as ToggleHeadless, ToggleGroup as ToggleGroupHeadless } from "@/ui";
import type { ToggleProps, ToggleGroupProps } from "@/ui";
import { cn } from "../utils/cn";

const toggleLayoutClasses =
  "inline-flex min-h-control min-w-0 select-none items-center justify-center gap-x-2 " +
  "text-nowrap rounded-sm px-3";
const toggleTextClasses = "text-sm control-label text-foreground motion-frame";
const togglePressedClasses =
  "aria-pressed:bg-primary aria-pressed:text-primary-fg";

const toggleClasses = cn(
  toggleLayoutClasses,
  "cursor-pointer",
  toggleTextClasses,
  togglePressedClasses,
);

const toggleDisabledClasses = cn(
  toggleLayoutClasses,
  "cursor-not-allowed text-disabled-fg",
);

const toggleClassesByState = (disabled: boolean | undefined) =>
  disabled ? toggleDisabledClasses : toggleClasses;

const groupClasses =
  "grid w-full grid-flow-col auto-cols-fr overflow-hidden rounded-pill border-hair border-border bg-surface-raised text-surface-raised-fg select-none text-nowrap";

const itemLayoutClasses =
  "flex min-h-control min-w-control items-center justify-center gap-x-2 " +
  "rounded-none px-3 motion-frame " +
  "not-first:border-l-hair";

const groupItemClasses = cn(
  itemLayoutClasses,
  "cursor-pointer text-foreground hover:bg-accent hover:text-accent-fg " +
    "active:crush aria-pressed:bg-primary aria-pressed:text-primary-fg aria-pressed:hover:bg-primary-accent",
);
const groupItemDisabledClasses = cn(
  itemLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);
const groupItemClassesByState = (disabled: boolean) =>
  disabled ? groupItemDisabledClasses : groupItemClasses;

function withDisabledOptions(
  options: ToggleGroupProps["options"],
  disabled: boolean | undefined,
  itemClassName: string | undefined,
) {
  return options.map((option) => ({
    ...option,
    className: cn(
      groupItemClassesByState(Boolean(disabled || option.disabled)),
      itemClassName,
      option.className,
    ),
  }));
}

export function Toggle({ className, disabled, ...props }: ToggleProps) {
  return <ToggleHeadless {...props} disabled={disabled} className={cn(toggleClassesByState(disabled), className)} />;
}

export function ToggleGroup({ className, itemClassName, options, disabled, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupHeadless
      {...props}
      className={cn(groupClasses, className)}
      options={withDisabledOptions(options, disabled, itemClassName)}
    />
  );
}
