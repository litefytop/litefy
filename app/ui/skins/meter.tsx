import { Meter as MeterHeadless } from "@/ui";
import type { MeterProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const meterBaseClasses = "flex w-full items-center gap-2 [--litefy-arc:var(--success)]";
const meterZoneClasses =
  "data-[zone=success]:[--litefy-arc:var(--success)] data-[zone=warning]:[--litefy-arc:var(--warning)] " +
  "data-[zone=danger]:[--litefy-arc:var(--danger)]";

const rootClasses = cn(meterBaseClasses, meterZoneClasses);

const trackClasses = "grow min-w-0 h-2 overflow-hidden rounded-pill bg-surface";

const fillClasses =
  "h-full rounded-pill bg-(--litefy-arc) " +
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
