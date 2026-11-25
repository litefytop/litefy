import { Input as InputHeadless, type InputProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";

export type { InputProps } from "@/ui";


export const fieldGroupBaseClasses =
  "flex min-h-control w-full min-w-0 max-w-[20rem] items-center rounded-md border-frame motion-frame field-seam borderless:border-0";

export const fieldGroupFaceClasses =
  "border-border bg-surface-raised p-well text-surface-raised-fg shadow-frame focus-within:focus-ring field-invalid";

export const fieldGroupClasses = cn(
  fieldGroupBaseClasses,
  "cursor-text",
  fieldGroupFaceClasses,
);

export const fieldGroupDisabledClasses = cn(
  fieldGroupBaseClasses,
  "cursor-not-allowed select-none border-border bg-disabled p-well text-disabled-fg shadow-frame",
);

const fieldGroupClassesByState = (disabled: boolean | undefined) =>
  disabled ? fieldGroupDisabledClasses : fieldGroupClasses;


const fieldInputLayoutClasses =
  "min-w-0 grow basis-0 self-stretch border-0 px-3 focus:outline-hidden " +
  "rounded-(--radius-field-inner) shadow-well font-field placeholder:font-field";

export const fieldInputClasses = cn(
  fieldInputLayoutClasses,
  "bg-well text-inherit placeholder:text-foreground",
);

export const fieldInputDisabledClasses = cn(
  fieldInputLayoutClasses,
  "pointer-events-none cursor-not-allowed select-none bg-disabled text-disabled-fg placeholder:text-disabled-fg",
);


export const fieldAddonClasses = "inline-flex shrink-0 items-center px-3 ";

/* The trailing addon yields FIRST when the row runs out of width (suffix, then
   content, never the leading icon) — shrinkable and clipping, while the input
   area holds the leftover space via grow basis-0. */
export const fieldTrailingClasses = "inline-flex min-w-0 items-center overflow-hidden px-3";


export const fieldHintClasses =
  "pointer-events-none absolute -top-7 right-0 z-10 flex items-center gap-x-1 text-nowrap " +
  "rounded-sm border-frame border-border bg-surface-raised text-surface-raised-fg px-2 py-1 text-xs/4 tracking-label case-label opacity-0 shadow-subtle " +
  "peer-focus-visible:opacity-100";


const fieldTextareaBaseClasses =
  "block w-full min-w-0 max-w-[20rem] min-h-20 resize-y rounded-md border-frame border-border py-3 motion-frame font-field";

export const fieldTextareaClasses = cn(
  fieldTextareaBaseClasses,
  "field-invalid bg-well text-foreground shadow-frame placeholder:text-foreground focus:outline-none focus:focus-ring",
);

export const fieldTextareaDisabledClasses = cn(
  fieldTextareaBaseClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg shadow-frame placeholder:text-disabled-fg",
);


export const inputPartClasses = {
  group: fieldGroupClasses,
  root: fieldInputClasses,
  leading: fieldAddonClasses,
  trailing: fieldTrailingClasses,
};

export function Input({ className, classNames, disabled, ...props }: InputProps) {
  return (
    <InputHeadless
      {...props}
      disabled={disabled}
      fieldClassNames={fieldChromeClasses}
      classNames={mergeSlots(
        {
          ...inputPartClasses,
          group: disabled ? fieldGroupDisabledClasses : fieldGroupClasses,
          root: disabled ? fieldInputDisabledClasses : fieldInputClasses,
        },
        {
          ...classNames,
          group: cn(fieldGroupClassesByState(disabled), classNames?.group, className),
        },
      )}
    />
  );
}
