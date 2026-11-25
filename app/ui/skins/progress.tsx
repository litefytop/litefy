import { Progress as ProgressHeadless } from "@/ui";
import type { ProgressProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "group flex w-full min-w-0 items-center gap-2";


const trackClasses =
  "grow min-w-0 h-2 overflow-hidden rounded-pill bg-well " +
  "group-data-[variant=meter]:h-3 group-data-[variant=meter]:border-frame group-data-[variant=meter]:border-border";


const fillClasses =
  "h-full rounded-pill bg-primary " +
  "group-data-[abort=true]:bg-danger group-data-[complete=true]:bg-success group-data-[paused=true]:bg-warning " +
  "transition-[width] duration-md ease-out";

const valueClasses =
  "shrink-0 min-w-11 text-right whitespace-nowrap text-xs tabular-nums text-foreground";

export function Progress({ className, classNames, ...props }: ProgressProps) {
  return (
    <ProgressHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ track: trackClasses, fill: fillClasses, value: valueClasses }, classNames)}
    />
  );
}
