import { MeterGroup as MeterGroupHeadless } from "@/ui";
import type { MeterGroupProps } from "@/ui";
import { cn } from "../utils/cn";

const rootClasses =
  "flex w-full flex-col gap-2 " +
  "[&_[data-track]]:flex [&_[data-track]]:h-2 [&_[data-track]]:w-full [&_[data-track]]:rounded-pill [&_[data-track]]:bg-surface " +
  "[&_[data-item]:first-of-type]:rounded-l-pill [&_[data-item]:last-of-type]:rounded-r-pill " +
  "[&_[data-item]]:relative [&_[data-item]]:h-full [&_[data-item]]:transition-[width] [&_[data-item]]:duration-md [&_[data-item]]:ease-out " +
  "[&_[data-item]]:after:pointer-events-none [&_[data-item]]:after:absolute [&_[data-item]]:after:bottom-full [&_[data-item]]:after:left-1/2 [&_[data-item]]:after:-translate-x-1/2 [&_[data-item]]:after:mb-1.5 [&_[data-item]]:after:whitespace-nowrap [&_[data-item]]:after:rounded-md [&_[data-item]]:after:border-frame [&_[data-item]]:after:border-border [&_[data-item]]:after:bg-surface-raised [&_[data-item]]:after:px-2 [&_[data-item]]:after:py-0.5 [&_[data-item]]:after:text-xs [&_[data-item]]:after:text-foreground [&_[data-item]]:after:content-[attr(data-tip)] " +
  "[&_[data-item]]:after:opacity-0 [&_[data-item]]:after:transition-opacity [&_[data-item]]:after:duration-sm [&_[data-item]]:hover:after:opacity-100 " +
  "[&_[data-legend]]:flex [&_[data-legend]]:flex-wrap [&_[data-legend]]:gap-x-4 [&_[data-legend]]:gap-y-1 [&_[data-legend]]:text-xs [&_[data-legend]]:text-surface-fg " +
  "[&_[data-legend-item]]:inline-flex [&_[data-legend-item]]:items-center [&_[data-legend-item]]:gap-1 " +
  "[&_[data-swatch]]:size-1.5 [&_[data-swatch]]:rounded-pill " +
  "[&_[data-percent]]:font-label [&_[data-percent]]:tracking-label";

export function MeterGroup({ className, ...props }: MeterGroupProps) {
  return <MeterGroupHeadless {...props} className={cn(rootClasses, className)} />;
}
