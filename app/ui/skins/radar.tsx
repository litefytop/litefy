import { Radar as RadarHeadless } from "@/ui";
import type { RadarProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { chartLegendClasses, chartLegendPartClasses } from "./chart-legend";


const rootClasses = "w-full";

const svgClasses = "mt-2 w-full max-w-72 mx-auto overflow-visible";

const gridClasses = "fill-none stroke-border";

const ringClasses =
  "stroke-[0.5px] data-[outer=true]:stroke-1 md:data-[outer=true]:stroke-1";

const spokeClasses = "stroke-[0.5px]";

const labelClasses =
  "fill-surface-fg text-xs font-label tracking-label case-label";

const polygonClasses =
  "cursor-pointer [fill-opacity:0.14] stroke-[1.5px] [stroke-linejoin:round] " +
  "transition-opacity duration-sm data-[hovered=true]:[fill-opacity:0.28] " +
  "data-[dimmed=true]:opacity-35";

const legendClasses = {
  root: cn(chartLegendClasses, "justify-center"),
  ...chartLegendPartClasses,
};

export function Radar({ className, classNames, ...props }: RadarProps) {
  return (
    <RadarHeadless
      {...props}
      className={cn(rootClasses, className)}
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
          classNames,
        ),
        legend: mergeSlots(legendClasses, classNames?.legend),
      }}
    />
  );
}
