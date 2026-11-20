import { Timeline as TimelineHeadless } from "@/ui";
import type { TimelineProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootVerticalClasses = "m-0 list-none p-0 flex flex-col pb-6";

const itemVerticalClasses = "m-0 flex gap-x-3 pb-6 last:pb-0";

const spineVerticalClasses = "flex flex-none flex-col items-center";

const connectorVerticalClasses = "w-px flex-1 bg-border -mb-6";

const rootHorizontalClasses = "m-0 list-none p-0 flex flex-row items-start";

const itemHorizontalClasses = "m-0 flex flex-col gap-y-1 pr-6 last:pr-0";

const spineHorizontalClasses = "flex flex-none flex-row items-center";

const connectorHorizontalClasses = "h-px w-auto flex-1 bg-border -mr-6";


const markerClasses =
  "z-10 flex size-3 shrink-0 items-center justify-center rounded-pill border-control border-border bg-primary text-primary-fg " +
  "has-[svg]:size-5 has-[svg]:border-frame ";

const contentClasses = "flex flex-1 flex-col";

const timeClasses =
  "text-xs tabular-nums font-label leading-body tracking-label case-label text-surface-fg";

const headingClasses = "text-sm font-strong leading-body text-foreground";

const descriptionClasses = "text-sm font-label leading-body text-surface-fg";

const timelineSlots = (orientation: "vertical" | "horizontal" = "vertical") => ({
  item: orientation === "horizontal" ? itemHorizontalClasses : itemVerticalClasses,
  spine: orientation === "horizontal" ? spineHorizontalClasses : spineVerticalClasses,
  marker: markerClasses,
  connector: orientation === "horizontal" ? connectorHorizontalClasses : connectorVerticalClasses,
  content: contentClasses,
  time: timeClasses,
  heading: headingClasses,
  description: descriptionClasses,
});

export interface TimelineSkinProps extends TimelineProps {
  orientation?: "vertical" | "horizontal";
}

export function Timeline({ orientation = "vertical", className, classNames, ...props }: TimelineSkinProps) {
  return (
    <TimelineHeadless
      {...props}
      orientation={orientation}
      className={cn(orientation === "horizontal" ? rootHorizontalClasses : rootVerticalClasses, className)}
      classNames={mergeSlots(timelineSlots(orientation), classNames)}
    />
  );
}
