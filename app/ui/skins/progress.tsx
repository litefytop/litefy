import { Progress as ProgressHeadless } from "@/ui";
import type { ProgressProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "group flex w-full items-center gap-2 " +
  "[--litefy-arc:var(--primary)] " +
  "data-[abort=true]:[--litefy-arc:var(--danger)] " +
  "data-[complete=true]:[--litefy-arc:var(--success)] " +
  "data-[paused=true]:[--litefy-arc:var(--warning)]";


const trackClasses =
  "grow min-w-0 h-2 overflow-hidden rounded-pill bg-surface " +
  "group-data-[variant=meter]:h-3 group-data-[variant=meter]:border-frame group-data-[variant=meter]:border-border";


const fillClasses =
  "h-full rounded-pill bg-(--litefy-arc) " +
  "transition-[width] duration-md ease-out";

const valueClasses = "shrink-0 whitespace-nowrap text-xs tabular-nums text-foreground";

export function Progress({ className, classNames, ...props }: ProgressProps) {
  return (
    <ProgressHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ track: trackClasses, fill: fillClasses, value: valueClasses }, classNames)}
    />
  );
}
