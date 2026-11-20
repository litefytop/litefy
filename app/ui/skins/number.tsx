import {
  NumberField as NumberFieldHeadless,
  NumberInput as NumberInputHeadless,
  type NumberFieldProps,
  type NumberInputProps,
} from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";
import { fieldAddonClasses, fieldGroupClasses, fieldHintClasses } from "./input";

export type { NumberFieldProps, NumberInputProps } from "@/ui";


const shellClasses = cn(
  fieldGroupClasses,
  "data-[invalid=true]:[&:not(:focus-within)_input]:text-danger-fg",
);

const valueClasses =
  "w-full min-w-0 flex-1 self-stretch border-0 bg-well px-3 text-left " +
  "rounded-[max(0px,calc(var(--radius-md)-var(--border-width-frame)))] shadow-well " +
  "text-sm leading-5 font-field text-inherit outline-none " +
  "placeholder:text-surface-fg selection:bg-primary selection:text-primary-fg " +
  "focus:outline-none aria-invalid:text-danger-fg";

const suffixClasses = "text-sm leading-5 font-field text-surface-fg";

const indicatorClasses =
  "pointer-events-none flex shrink-0 flex-col items-center justify-center " +
  "leading-none select-none";


const indicatorIconClasses = "size-3 first:-mb-0.5";


export const numberInputPartClasses: NonNullable<NumberInputProps["classNames"]> = {
  root: valueClasses,
  indicator: indicatorClasses,
  indicatorIcon: indicatorIconClasses,
  trailing: cn(
    fieldAddonClasses,
    "has-[>span[aria-hidden]]:gap-x-1.5 has-[>span[aria-hidden]]:pr-1",
  ),
};

export const numberInputShellClasses = shellClasses;

const fieldShellClasses =
  "relative inline-flex min-h-[calc(var(--height-field)+2px)] w-fit max-w-full items-center p-well " +
  "rounded-md border-frame border-border bg-background text-foreground shadow-base " +
  "focus-within:focus-ring " +
  "data-[invalid=true]:border-danger-fg " +
  "data-[invalid=true]:focus-within:border-danger-fg " +
  "data-[invalid=true]:[&:not(:focus-within)_input]:text-danger-fg";


const stepperClasses =
  "inline-flex w-control self-stretch shrink-0 items-center justify-center " +
  "cursor-pointer border-control border-border bg-transparent text-foreground " +
  "first-of-type:rounded-ss-[max(0px,calc(var(--radius-md)-var(--padding-well)-var(--border-width-frame)))] " +
  "first-of-type:rounded-es-[max(0px,calc(var(--radius-md)-var(--padding-well)-var(--border-width-frame)))] " +
  "last-of-type:rounded-se-[max(0px,calc(var(--radius-md)-var(--padding-well)-var(--border-width-frame)))] " +
  "last-of-type:rounded-ee-[max(0px,calc(var(--radius-md)-var(--padding-well)-var(--border-width-frame)))] " +
  "hover:bg-accent hover:text-accent-fg " +
  "active:crush " +
  "disabled:opacity-50 disabled:cursor-default " +
  "focus:outline-none focus:shadow-none";


const stepperIconClasses = "size-4";

const fieldInputValueClasses =
  "w-control self-stretch border-0 bg-well text-center rounded-none shadow-well " +
  "text-sm leading-5 font-field tabular-nums outline-none peer " +
  "placeholder:text-surface-fg selection:bg-primary selection:text-primary-fg " +
  "focus:outline-none aria-invalid:text-danger-fg";

export const numberFieldShellClasses = fieldShellClasses;

export const numberFieldPartClasses: NonNullable<NumberFieldProps["classNames"]> = {
  root: fieldInputValueClasses,
  stepper: stepperClasses,
  stepperIcon: stepperIconClasses,
  hint: fieldHintClasses,
};

export function NumberInput({
  className,
  classNames,
  prefix,
  suffix,
  ...props
}: NumberInputProps) {
  return (
    <NumberInputHeadless
      {...props}
      prefix={prefix}
      suffix={
        typeof suffix === "string" && suffix
          ? <span className={suffixClasses}>{suffix}</span>
          : suffix
      }
      fieldClassNames={fieldChromeClasses}
      className={cn(numberInputShellClasses, className)}
      classNames={mergeSlots(
        prefix ? { ...numberInputPartClasses, leading: fieldAddonClasses } : numberInputPartClasses,
        classNames,
      )}
    />
  );
}

export function NumberField({
  className,
  classNames,
  ...props
}: NumberFieldProps) {
  return (
    <NumberFieldHeadless
      {...props}
      className={cn(fieldShellClasses, className)}
      classNames={mergeSlots(numberFieldPartClasses, classNames)}
    />
  );
}
