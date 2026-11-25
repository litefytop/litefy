import {
  Tooltip as TooltipHeadless,
  TooltipTrigger as TooltipTriggerHeadless,
  TooltipContent as TooltipContentHeadless,
} from "@/ui";
import type { TooltipProps, TooltipTriggerProps, TooltipContentProps } from "@/ui";
import { cn } from "../utils/cn";


const triggerClasses =
  "inline-flex items-center justify-center px-2 rounded-md text-sm leading-5 font-emphasis";

const contentClasses =
  "w-max min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))] px-4 py-2 border-frame border-border rounded-xl bg-surface-raised " +
  "text-surface-raised-fg text-sm font-field leading-5 shadow-hint";

export function Tooltip(props: TooltipProps) {
  return <TooltipHeadless {...props} />;
}

export function TooltipTrigger({ className, ...props }: TooltipTriggerProps) {
  return <TooltipTriggerHeadless {...props} className={cn(triggerClasses, className)} />;
}

export function TooltipContent({ className, ...props }: TooltipContentProps) {
  return <TooltipContentHeadless {...props} className={cn(contentClasses, className)} />;
}
