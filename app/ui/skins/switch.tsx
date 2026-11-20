import { Switch as SwitchHeadless } from "@/ui";
import type { SwitchProps } from "@/ui";
import { mergeSlots } from "../utils/cn";


const labelClasses =
  "inline-flex items-center min-h-control gap-x-2 text-base leading-6 font-label";

const trackClasses =
  "relative inline-flex shrink-0 items-center w-[2.5rem] h-[1.25rem] rounded-pill border-frame border-border cursor-pointer shadow-frame motion-frame " +
  "data-[checked=true]:border-primary data-[checked=true]:bg-primary " +
  "has-[:focus-visible]:focus-ring";

const thumbClasses =
  "pointer-events-none inline-block size-[1.25rem] translate-x-0 rounded-pill border-frame border-border bg-background shadow-faint " +
  "transition-transform duration-frame ease-frame data-[checked=true]:translate-x-[1.25rem]";

const inputClasses =
  "absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer";

export function Switch({ classNames, ...props }: SwitchProps) {
  return (
    <SwitchHeadless
      {...props}
      classNames={mergeSlots(
        { label: labelClasses, track: trackClasses, thumb: thumbClasses, input: inputClasses },
        classNames,
      )}
    />
  );
}
