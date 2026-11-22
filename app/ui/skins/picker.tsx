import { Picker as PickerHeadless } from "@/ui";
import type { PickerProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "relative w-55 max-w-full min-w-0 inert:dim";

const inputBaseClasses =
  "w-full min-h-field px-control-x py-2 leading-5 font-field text-foreground cursor-pointer outline-none";
const inputFaceClasses = "rounded-md border-frame border-border shadow-base focus-visible:focus-ring";
const inputStateClasses =
  "placeholder:text-surface-fg data-[trailing=true]:pr-9 " +
  "aria-invalid:border-danger-fg aria-invalid:text-danger-fg aria-invalid:focus-visible:focus-ring-danger";

const inputClasses = cn(inputBaseClasses, inputFaceClasses, inputStateClasses);

const trailingClasses =
  "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ";

const contentClasses =
  "rounded-md border-frame border-border bg-surface-raised text-foreground shadow-elevated p-[var(--radius-md)] " +
  "[&>div:has(ol)]:max-h-64 [&>div:has(ul)]:max-h-64";

export const pickerRootClasses = rootClasses;

export const pickerPartClasses = {
  input: inputClasses,
  trailing: trailingClasses,
  popover: contentClasses,
};

export const pickerClasses = {
  root: rootClasses,
  input: inputClasses,
  trailing: trailingClasses,
  content: contentClasses,
};

export function Picker({ className, classNames, ...props }: PickerProps) {
  return (
    <PickerHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots(
        { input: inputClasses, trailing: trailingClasses, popover: contentClasses },
        classNames,
      )}
    />
  );
}
