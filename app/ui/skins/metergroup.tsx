import { MeterGroup as MeterGroupHeadless } from "@/ui";
import type { MeterGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const rootClasses = "flex w-full flex-col gap-2";

const trackClasses = "flex h-2 w-full rounded-pill bg-surface";

const segmentBaseClasses =
  "relative h-full transition-[width] duration-md ease-out first-of-type:rounded-l-pill last-of-type:rounded-r-pill";
const segmentTipBoxClasses =
  "after:pointer-events-none after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 " +
  "after:mb-1.5 after:whitespace-nowrap after:rounded-md";
const segmentTipFaceClasses =
  "after:border-frame after:border-border after:bg-surface-raised after:px-2 after:py-0.5 " +
  "after:text-xs after:text-foreground after:content-[attr(data-tip)]";
const segmentTipShowClasses =
  "after:opacity-0 after:transition-opacity after:duration-sm hover:after:opacity-100";

const segmentClasses = cn(segmentBaseClasses, segmentTipBoxClasses, segmentTipFaceClasses, segmentTipShowClasses);

const legendClasses = "flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-fg";

const legendItemClasses = "inline-flex items-center gap-1";

const swatchClasses = "size-1.5 rounded-pill";

const percentClasses = "font-label tracking-label";

export const metergroupPartClasses = {
  track: trackClasses,
  segment: segmentClasses,
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
