import { Donut as DonutHeadless } from "@/ui";
import type { DonutProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { chartLegendClasses, chartLegendPartClasses } from "./chart-legend";


const rootClasses = "w-full min-w-0";

const svgClasses = "relative mt-2 w-full max-w-64 mx-auto";

const svgInnerClasses = "size-full overflow-visible";

const segmentClasses =
  "cursor-pointer stroke-0 stroke-border transition-opacity duration-sm data-[dimmed=true]:opacity-35";

const centerClasses =
  "pointer-events-none flex flex-col items-center justify-center text-center " +
  "data-[variant=donut]:absolute data-[variant=donut]:inset-0 " +
  "data-[variant=pie]:h-12";

const centerLabelClasses =
  "max-w-20 truncate text-xs leading-4 control-label text-foreground";

const centerValueClasses = "text-h3 leading-head font-strong text-foreground";

const legendClasses = {
  root: cn(chartLegendClasses, "justify-center"),
  ...chartLegendPartClasses,
};

export function Donut({ className, classNames, ...props }: DonutProps) {
  const { root: rootOverride, ...slots } = classNames ?? {};
  return (
    <DonutHeadless
      {...props}
      className={cn(rootClasses, rootOverride, className)}
      classNames={{
        ...mergeSlots(
          {
            svg: svgClasses,
            svgInner: svgInnerClasses,
            segment: segmentClasses,
            center: centerClasses,
            centerLabel: centerLabelClasses,
            centerValue: centerValueClasses,
          },
          slots,
        ),
        legend: mergeSlots(legendClasses, classNames?.legend),
      }}
    />
  );
}
