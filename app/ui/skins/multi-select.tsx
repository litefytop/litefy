import { MultiSelect as MultiSelectHeadless } from "@/ui";
import type { MultiSelectProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { buttonVariants } from "./button";
import { panelPadClass } from "./popover";


const triggerClasses =
  cn(buttonVariants.outline, "rounded-md px-control-x min-h-field border-frame w-55 max-w-full min-w-0 text-left");

const listClasses = "max-h-96 overflow-y-auto outline-none";

const groupClasses =
  "px-3 py-snug text-sm leading-5 font-label tracking-label case-label text-surface-fg";

const optionClasses =
  "flex cursor-pointer select-none items-center gap-x-2 px-3 py-snug text-sm leading-5 font-field text-foreground " +
  "hover:bg-accent hover:text-accent-fg " +
  "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-fg " +
  "data-[selected=true]:font-strong " +
  "data-[grouped=true]:ps-4 " +
  "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50";

const checkClasses = "size-4 shrink-0 text-primary";

export function MultiSelect({
  className,
  classNames,
  ...props
}: MultiSelectProps) {
  return (
    <MultiSelectHeadless
      {...props}
      className={cn(triggerClasses, className)}
      classNames={mergeSlots(
        {
          content: panelPadClass,
          list: listClasses,
          group: groupClasses,
          option: optionClasses,
          check: checkClasses,
        },
        classNames,
      )}
    />
  );
}
