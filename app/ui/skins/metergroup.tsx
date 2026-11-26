import { MeterGroup as MeterGroupHeadless } from "@/ui";
import type { MeterGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const rootClasses = "flex w-full min-w-0 flex-col gap-2";

const trackClasses = "flex h-2 w-full rounded-pill bg-border";

const segmentClasses =
  "group/meter relative h-full transition-[width] duration-md ease-out first-of-type:rounded-l-pill last-of-type:rounded-r-pill";

const tipClasses =
  "pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md " +
  "border-frame border-border bg-surface-raised px-2 py-0.5 text-xs text-surface-raised-fg " +
  "opacity-0 transition-opacity duration-sm group-hover/meter:opacity-100";

const legendClasses = "flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground";

const legendItemClasses = "inline-flex items-center gap-1";

const swatchClasses = "size-1.5 rounded-pill";

const percentClasses = "font-label tracking-label";

export const metergroupPartClasses = {
  track: trackClasses,
  segment: segmentClasses,
  tip: tipClasses,
  legend: legendClasses,
  legendItem: legendItemClasses,
  swatch: swatchClasses,
  percent: percentClasses,
};

export function MeterGroup({ className, classNames, ...props }: MeterGroupProps) {
  return (
    <MeterGroupHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ ...metergroupPartClasses }, classNames)}
    />
  );
}
