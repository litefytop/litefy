import { Input as InputHeadless, type InputProps } from "@/ui";
import { mergeSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";

export type { InputProps } from "@/ui";


export const fieldGroupClasses =
  "flex min-h-control w-55 max-w-full min-w-0 cursor-text items-center p-well rounded-md border-frame border-border bg-background text-foreground shadow-frame " +
  "motion-frame " +
  "[&>input:not(:first-child)]:rounded-ss-none [&>input:not(:first-child)]:rounded-es-none " +
  "[&>input:not(:last-child)]:rounded-se-none [&>input:not(:last-child)]:rounded-ee-none " +
  "borderless:border-0 bordered:border-frame bordered:border-border " +
  "focus-within:focus-ring " +
  "" +
  "data-[invalid=true]:border-danger-fg " +
  "data-[invalid=true]:focus-within:focus-ring-danger " +
  "";


export const fieldInputClasses =
  "min-w-0 grow basis-0 self-stretch border-0 bg-well px-3 outline-none " +
  "rounded-[max(0px,calc(var(--radius-md)-var(--border-width-frame)))] shadow-well " +
  "font-field text-inherit " +
  "placeholder:font-field placeholder:text-surface-fg " +
  "";


export const fieldAddonClasses = "inline-flex shrink-0 items-center px-3 ";

/* The trailing addon yields FIRST when the row runs out of width (suffix, then
   content, never the leading icon) — shrinkable and clipping, while the input
   area holds the leftover space via grow basis-0. */
export const fieldTrailingClasses = "inline-flex min-w-0 items-center overflow-hidden px-3";


export const fieldHintClasses =
  "pointer-events-none absolute -top-7 right-0 z-10 inline-flex items-center gap-x-1 whitespace-nowrap " +
  "rounded-sm border-frame border-border bg-surface-raised px-2 py-1 text-xs leading-4 tracking-label case-label opacity-0 shadow-subtle " +
  "peer-focus-visible:opacity-100";


export const fieldTextareaClasses =
  "block w-full min-h-20 resize-y rounded-md border-frame border-border bg-well shadow-frame " +
  "py-3 motion-frame " +
  "font-field " +
  "placeholder:text-surface-fg " +
  "focus:outline-none focus:focus-ring " +
  "" +
  "aria-invalid:border-danger-fg aria-invalid:focus:focus-ring-danger " +
  "";


export const inputPartClasses = {
  group: fieldGroupClasses,
  root: fieldInputClasses,
  leading: fieldAddonClasses,
  trailing: fieldTrailingClasses,
};

export function Input({ classNames, ...props }: InputProps) {
  return (
    <InputHeadless
      {...props}
      fieldClassNames={fieldChromeClasses}
      classNames={mergeSlots(inputPartClasses, classNames)}
    />
  );
}
