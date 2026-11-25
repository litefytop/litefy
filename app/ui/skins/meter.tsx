import { Meter as MeterHeadless } from "@/ui";
import type { MeterProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const rootClasses = "group/meter flex w-full min-w-0 items-center gap-2";

const trackClasses = "grow min-w-0 h-2 overflow-hidden rounded-pill bg-well";

const fillClasses =
  "h-full rounded-pill bg-success " +
  "group-data-[zone=warning]/meter:bg-warning group-data-[zone=danger]/meter:bg-danger " +
  "transition-[width] duration-md ease-out";

const valueClasses = "shrink-0 whitespace-nowrap text-xs tabular-nums text-foreground";

export function Meter({ className, classNames, ...props }: MeterProps) {
  return (
    <MeterHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ track: trackClasses, fill: fillClasses, value: valueClasses }, classNames)}
    />
  );
}
