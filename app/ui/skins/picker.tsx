import { Picker as PickerHeadless } from "@/ui";
import type { PickerProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses = "relative w-full min-w-0 max-w-[20rem] text-foreground";
const rootDisabledClasses = "relative w-full min-w-0 max-w-[20rem] text-foreground";

const inputBaseClasses =
  "w-full min-h-field px-control-x py-2 leading-5 font-field outline-none";
const inputFaceClasses = "rounded-md border-frame border-border shadow-base";
const inputTrailingClasses = "data-[trailing=true]:pr-9";

const inputClasses = cn(
  inputBaseClasses,
  inputFaceClasses,
  inputTrailingClasses,
  "field-invalid cursor-pointer placeholder:text-foreground focus-visible:focus-ring aria-invalid:text-danger-independent",
);

const inputDisabledClasses = cn(
  inputBaseClasses,
  inputFaceClasses,
  inputTrailingClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg placeholder:text-disabled-fg",
);

const trailingClasses =
  "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ";

export const pickerContentLayoutClasses =
  "rounded-md border-frame border-border bg-surface-raised text-surface-raised-fg shadow-elevated p-[var(--radius-md)] " +
  "[&>div:has(ol)]:max-h-64 [&>div:has(ul)]:max-h-64";

const contentClasses = cn(
  "w-fit min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))]",
  pickerContentLayoutClasses,
);

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

export const pickerRootDisabledClasses = rootDisabledClasses;
export const pickerInputDisabledClasses = inputDisabledClasses;

export function Picker({ className, classNames, disabled, ...props }: PickerProps) {
  return (
    <PickerHeadless
      {...props}
      disabled={disabled}
      className={cn(disabled ? rootDisabledClasses : rootClasses, className)}
      classNames={mergeSlots(
        { input: disabled ? inputDisabledClasses : inputClasses, trailing: trailingClasses, popover: contentClasses },
        classNames,
      )}
    />
  );
}
