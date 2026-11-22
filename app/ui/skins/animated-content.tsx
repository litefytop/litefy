import { AnimatedContent as AnimatedContentHeadless } from "@/ui";
import type { AnimatedContentProps } from "@/ui";
import { cn } from "../utils/cn";

const outBaseClasses =
  "transition-[translate,opacity] ease-frame duration-lg " +
  "data-[duration=sm]:duration-sm data-[duration=md]:duration-md " +
  "data-[state=out]:opacity-0";
const outUpClasses =
  "data-[direction=up]:data-[state=out]:translate-y-(--animated-content-distance)";
const outDownClasses =
  "data-[direction=down]:data-[state=out]:-translate-y-(--animated-content-distance)";
const outLeftClasses =
  "data-[direction=left]:data-[state=out]:translate-x-(--animated-content-distance)";
const outRightClasses =
  "data-[direction=right]:data-[state=out]:-translate-x-(--animated-content-distance)";

export function AnimatedContent({ className, ...props }: AnimatedContentProps) {
  return (
    <AnimatedContentHeadless
      {...props}
      className={cn(outBaseClasses, outUpClasses, outDownClasses, outLeftClasses, outRightClasses, className)}
    />
  );
}