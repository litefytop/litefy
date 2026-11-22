import { ChipGroup as ChipGroupHeadless } from "@/ui";
import type { ChipGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "max-w-full overflow-hidden";

const rowClasses = "flex min-w-0 items-center gap-x-1.5";

const measureClasses =
  "flex min-w-0 items-center gap-x-1.5 pointer-events-none absolute -top-[9999px] -left-[9999px]";

const moreClasses = "inline-flex shrink-0";

const chipLayoutClasses =
  "inline-flex min-h-5 items-center gap-1 rounded-sm border-control border-border px-2";
const chipTextClasses =
  "text-xs leading-4 tracking-label case-label whitespace-nowrap no-underline";
const chipSurfaceClasses =
  "bg-surface text-surface-fg [&:is(a,button)]:min-h-control";
const chipVariantClasses =
  "[&:is(a,button)]:data-[variant=primary]:bg-primary data-[variant=primary]:text-primary-fg " +
  "data-[variant=outline]:bg-transparent data-[variant=outline]:text-foreground";
const chipSuccessClasses =
  "data-[variant=success]:bg-success data-[variant=success]:text-success-fg";
const chipWarningClasses =
  "data-[variant=warning]:bg-warning data-[variant=warning]:text-warning-fg";
const chipDangerClasses =
  "data-[variant=danger]:bg-danger data-[variant=danger]:text-danger-fg";
const chipInfoClasses = "data-[variant=info]:bg-info data-[variant=info]:text-info-fg";

export const chipClasses = cn(
  chipLayoutClasses,
  chipTextClasses,
  chipSurfaceClasses,
  chipVariantClasses,
  chipSuccessClasses,
  chipWarningClasses,
  chipDangerClasses,
  chipInfoClasses,
);

const chipPartClasses = "max-w-40 shrink-0 overflow-hidden text-ellipsis " + chipClasses;

export function ChipGroup({ className, classNames, ...props }: ChipGroupProps) {
  return (
    <ChipGroupHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(
        {
          row: rowClasses,
          chip: chipPartClasses,
          more: moreClasses,
          measure: measureClasses,
        },
        classNames,
      )}
    />
  );
}
