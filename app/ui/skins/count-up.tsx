import { CountUp as CountUpHeadless } from "@/ui";
import type { CountUpProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";

const rootClasses = "relative tabular-nums";

const finalClasses = "pointer-events-none absolute size-px opacity-0";

const skinClassNames = {
  final: finalClasses,
};

export function CountUp({ className, classNames, ...props }: CountUpProps) {
  return (
    <CountUpHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(skinClassNames, classNames)}
    />
  );
}
