import { Switch as SwitchHeadless } from "@/ui";
import type { SwitchProps } from "@/ui";
import { mergeSlots } from "../utils/cn";


const labelClasses =
  "inline-flex items-center min-h-control gap-x-2 text-base leading-6 font-label has-[:disabled]:text-surface-fg";

const trackClasses =
  "relative inline-flex shrink-0 items-center w-10 h-5 rounded-pill border-frame border-border cursor-pointer shadow-frame motion-frame " +
  "data-[checked=true]:border-primary data-[checked=true]:bg-primary " +
  "has-[:disabled]:dim " +
  "has-[:focus-visible]:focus-ring";

const thumbClasses =
  "pointer-events-none inline-block size-5 translate-x-0 rounded-pill border-frame border-border bg-background shadow-faint " +
  "transition-transform duration-frame ease-frame data-[checked=true]:translate-x-5";

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
