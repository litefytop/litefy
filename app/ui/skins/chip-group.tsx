import { ChipGroup as ChipGroupHeadless } from "@/ui";
import type { ChipGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "max-w-full overflow-hidden";

const rowClasses = "flex min-w-0 items-center gap-x-1.5";

const measureClasses =
  "flex min-w-0 items-center gap-x-1.5 pointer-events-none absolute -top-[9999px] -left-[9999px]";

const moreClasses = "inline-flex shrink-0";

export const chipClasses =
  "inline-flex min-h-5 items-center gap-1 rounded-sm border-control border-border px-2 text-xs leading-4 tracking-label case-label " +
  "whitespace-nowrap no-underline bg-surface text-surface-fg [&:is(a,button)]:min-h-control " +
  "[&:is(a,button)]:[&:is(a,button)]:" +
  "data-[variant=primary]:bg-primary data-[variant=primary]:text-primary-fg " +
  "data-[variant=outline]:bg-transparent data-[variant=outline]:text-foreground " +
  "data-[variant=success]:bg-success data-[variant=success]:text-success-fg " +
  "data-[variant=warning]:bg-warning data-[variant=warning]:text-warning-fg " +
  "data-[variant=danger]:bg-danger data-[variant=danger]:text-danger-fg " +
  "data-[variant=info]:bg-info data-[variant=info]:text-info-fg ";

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
