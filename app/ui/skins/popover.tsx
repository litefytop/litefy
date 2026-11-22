import { Popover as PopoverHeadless } from "@/ui";
import type { PopoverProps } from "@/ui";
import { buttonVariants } from "./button";
import { cn, mergeSlots } from "../utils/cn";


const triggerClasses = buttonVariants.outline;

const panelClasses =
  "min-w-32 max-h-96 rounded-md border-frame border-border " +
  "bg-surface-raised text-foreground text-base leading-relaxed shadow-elevated";

const contentClasses = cn(panelClasses, "overflow-auto");

const shellClasses = cn(panelClasses, "overflow-hidden");

const viewportClasses = "max-h-[inherit] overflow-auto";

export const popoverClasses = {
  trigger: triggerClasses,
  content: contentClasses,
};

export function Popover({ classNames, children, ...props }: PopoverProps) {
  return (
    <PopoverHeadless
      {...props}
      classNames={mergeSlots(
        { trigger: triggerClasses, content: shellClasses },
        classNames,
      )}
    >
      <div className={viewportClasses}>{children}</div>
    </PopoverHeadless>
  );
}
