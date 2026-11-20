import { Popover as PopoverHeadless } from "@/ui";
import type { PopoverProps } from "@/ui";
import { buttonVariants } from "./button";
import { mergeSlots } from "../utils/cn";


const triggerClasses = buttonVariants.outline;

const contentClasses =
  "min-w-32 max-h-96 overflow-auto rounded-xl border-frame border-border " +
  "bg-surface-raised text-foreground text-base leading-relaxed shadow-elevated";

/* Rounded-panel padding compensation (ui/schemes.md rule 14): the panel corner
   intrudes ~0.29×radius, so rounded panels pad items clear of the curve; schemes
   answering 0 radius resolve the min() to 0 and stay edge-flush. */
export const panelPadClass = "p-[min(var(--radius-xl),var(--spacing)*2)]";

export const popoverClasses = {
  trigger: triggerClasses,
  content: contentClasses,
};

export function Popover({ classNames, ...props }: PopoverProps) {
  return (
    <PopoverHeadless
      {...props}
      classNames={mergeSlots(popoverClasses, classNames)}
    />
  );
}
