import { ChartLegend as ChartLegendHeadless } from "@/ui";
import type { ChartLegendProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


export const chartLegendClasses =
  "flex flex-wrap items-center justify-center gap-x-4 text-xs leading-body control-label";

const itemClasses =
  "flex min-h-control cursor-pointer items-center gap-x-1.5 p-0 text-foreground " +
  "hover:underline underline-offset-4 " +
  "data-[hidden=true]:line-through";


export const chartLegendPartClasses = {
  item: itemClasses,
  swatch:
    "data-[shape=line]:h-0.5 data-[shape=line]:w-3 data-[shape=line]:rounded-pill " +
    "data-[shape=square]:size-2.5 data-[shape=square]:rounded-sm",
};

export function ChartLegend({ className, classNames, ...props }: ChartLegendProps) {
  const { root: rootOverride, ...slots } = classNames ?? {};
  return (
    <ChartLegendHeadless
      {...props}
      className={cn(chartLegendClasses, rootOverride, className)}
      classNames={mergeSlots(chartLegendPartClasses, slots)}
    />
  );
}
