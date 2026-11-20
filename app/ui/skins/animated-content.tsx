import { AnimatedContent as AnimatedContentHeadless } from "@/ui";
import type { AnimatedContentProps } from "@/ui";
import { cn } from "../utils/cn";

export function AnimatedContent({ className, ...props }: AnimatedContentProps) {
  return (
    <AnimatedContentHeadless
      {...props}
      className={cn(
        "transition-[translate,opacity] ease-frame duration-lg",
        "data-[duration=sm]:duration-sm data-[duration=md]:duration-md",
        "data-[state=out]:opacity-0",
        "data-[direction=up]:data-[state=out]:translate-y-(--animated-content-distance)",
        "data-[direction=down]:data-[state=out]:-translate-y-(--animated-content-distance)",
        "data-[direction=left]:data-[state=out]:translate-x-(--animated-content-distance)",
        "data-[direction=right]:data-[state=out]:-translate-x-(--animated-content-distance)",
        className,
      )}
    />
  );
}