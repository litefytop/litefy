import { Chart as ChartHeadless } from "@/ui";
import type { ChartProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { chartLegendClasses, chartLegendPartClasses } from "./chart-legend";


const rootClasses = "group/chart w-full";

const bodyClasses = "relative mt-2 mb-2";

const canvasWrapClasses = "w-full";

const canvasClasses = "w-full cursor-crosshair touch-none select-none";

const tooltipClasses =
  "pointer-events-none absolute top-0 left-0 hidden rounded-xl border-frame border-border bg-surface-raised " +
  "px-2 py-1.5 text-xs leading-4 text-foreground shadow-elevated";

const tooltipHeaderClasses = "mb-1 text-xs font-semibold tracking-label case-label";

const tooltipRowClasses = "flex items-center gap-x-1.5 min-w-[7.5rem] font-field";

const tooltipSwatchClasses = "w-2.5 h-0.5 rounded-sm border-control border-border flex-none";

const tooltipValueClasses = "ml-auto font-strong tabular-nums";

const hintClasses = "invisible group-hover/chart:visible group-focus-within/chart:visible mt-1 text-center text-xs text-foreground";

const defaultHint = "Drag to zoom · double-click to reset";

export function Chart({ className, classNames, zoomHint, ...props }: ChartProps) {
  const hint =
    zoomHint === undefined ? (
      <p className={hintClasses}>{defaultHint}</p>
    ) : typeof zoomHint === "string" && zoomHint ? (
      <p className={hintClasses}>{zoomHint}</p>
    ) : (
      zoomHint
    );
  return (
    <ChartHeadless
      {...props}
      zoomHint={hint}
      className={cn(rootClasses, className)}
      classNames={{
        ...mergeSlots(
          {
            body: bodyClasses,
            canvasWrap: canvasWrapClasses,
            canvas: canvasClasses,
            tooltip: tooltipClasses,
            tooltipHeader: tooltipHeaderClasses,
            tooltipRow: tooltipRowClasses,
            tooltipSwatch: tooltipSwatchClasses,
            tooltipValue: tooltipValueClasses,
          },
          classNames,
        ),
        legend: mergeSlots(
          { root: chartLegendClasses, ...chartLegendPartClasses },
          classNames?.legend,
        ),
      }}
    />
  );
}
