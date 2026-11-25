import { Popover as PopoverHeadless } from "@/ui";
import type { PopoverProps } from "@/ui";
import { buttonVariants } from "./button";
import { cn, mergeSlots } from "../utils/cn";


const triggerClasses = cn(buttonVariants.outline, "pure-icon");
const triggerDisabledClasses = cn(buttonVariants.disabled, "pure-icon");

export const popoverWidthClasses =
  "w-fit min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))]";

const panelClasses =
  "max-h-96 rounded-md border-frame border-border " +
  "bg-surface-raised text-surface-raised-fg text-base leading-relaxed shadow-elevated";

const contentClasses = cn(popoverWidthClasses, panelClasses, "overflow-auto");

const shellClasses = cn(popoverWidthClasses, panelClasses, "overflow-hidden");

const viewportClasses = "max-h-[inherit] overflow-auto";

export const popoverClasses = {
  trigger: triggerClasses,
  content: contentClasses,
};

export const popoverTriggerDisabledClasses = triggerDisabledClasses;

export function Popover({ classNames, children, disabled, ...props }: PopoverProps) {
  return (
    <PopoverHeadless
      {...props}
      disabled={disabled}
      classNames={mergeSlots(
        { trigger: disabled ? triggerDisabledClasses : triggerClasses, content: shellClasses },
        classNames,
      )}
    >
      <div className={viewportClasses}>{children}</div>
    </PopoverHeadless>
  );
}
