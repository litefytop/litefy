import { Separator as SeparatorHeadless } from "@/ui";
import type { SeparatorProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const rootHorizontalClasses = "gap-x-2 text-foreground control-text w-full my-4";
const rootVerticalClasses = "gap-x-2 text-foreground control-text min-h-6";
const lineHorizontalClasses = "bg-border h-px";
const lineVerticalClasses = "bg-border min-h-6 w-px";

export function Separator({ orientation = "horizontal", className, classNames, ...props }: SeparatorProps) {
  const vertical = orientation === "vertical";
  const lineClasses = vertical ? lineVerticalClasses : lineHorizontalClasses;
  const rootClasses = vertical ? rootVerticalClasses : rootHorizontalClasses;
  const isBareLine = !props.children;
  return (
    <SeparatorHeadless
      {...props}
      orientation={orientation}
      className={cn(isBareLine ? lineClasses : rootClasses, className)}
      classNames={mergeSlots({ line: lineClasses }, classNames)}
    />
  );
}