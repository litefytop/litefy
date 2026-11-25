import { Radar as RadarHeadless } from "@/ui";
import type { RadarProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { chartLegendClasses, chartLegendPartClasses } from "./chart-legend";


const rootClasses = "w-full min-w-0";

const svgClasses = "mt-2 w-full max-w-72 mx-auto overflow-visible";

const gridClasses = "fill-none stroke-border";

const ringClasses =
  "stroke-0.5 data-[outer=true]:stroke-1 md:data-[outer=true]:stroke-1";

const spokeClasses = "stroke-0.5";

const labelClasses =
  "fill-foreground text-xs control-label";

const polygonClasses =
  "cursor-pointer [fill-opacity:0.14] stroke-1.5 [stroke-linejoin:round] " +
  "transition-opacity duration-sm data-[hovered=true]:[fill-opacity:0.28] " +
  "data-[dimmed=true]:opacity-35";

const legendClasses = {
  root: cn(chartLegendClasses, "justify-center"),
  ...chartLegendPartClasses,
};

export function Radar({ className, classNames, ...props }: RadarProps) {
  const { root: rootOverride, ...slots } = classNames ?? {};
  return (
    <RadarHeadless
      {...props}
      className={cn(rootClasses, rootOverride, className)}
      classNames={{
        ...mergeSlots(
          {
            svg: svgClasses,
            grid: gridClasses,
            ring: ringClasses,
            spoke: spokeClasses,
            label: labelClasses,
            polygon: polygonClasses,
          },
          slots,
        ),
        legend: mergeSlots(legendClasses, classNames?.legend),
      }}
    />
  );
}
