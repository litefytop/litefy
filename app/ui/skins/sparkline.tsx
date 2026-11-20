import { Sparkline as SparklineHeadless } from "@/ui";
import type { SparklineProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "h-[3rem] w-[8rem]";

const barClasses = "fill-current";
const areaClasses = "fill-current [fill-opacity:0.15]";
const lineClasses = "fill-none stroke-current stroke-2 line-cap line-join";

export function Sparkline({ className, classNames, ...props }: SparklineProps) {
  return (
    <SparklineHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ bar: barClasses, area: areaClasses, line: lineClasses }, classNames)}
    />
  );
}
