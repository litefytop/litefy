import { Separator as SeparatorHeadless } from "@/ui";
import type { SeparatorProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "gap-x-2 text-surface-fg text-label leading-label " +
  "tracking-label font-label case-label " +
  "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:my-4 " +
  "data-[orientation=vertical]:min-h-6";

const lineClasses =
  "bg-border " +
  "data-[orientation=horizontal]:h-px " +
  "data-[orientation=vertical]:min-h-6 data-[orientation=vertical]:w-px";

export function Separator({ className, classNames, ...props }: SeparatorProps) {
  const isBareLine = !props.children;
  return (
    <SeparatorHeadless
      {...props}
      className={cn(isBareLine ? lineClasses : rootClasses, className)}
      classNames={mergeSlots({ line: lineClasses }, classNames)}
    />
  );
}
