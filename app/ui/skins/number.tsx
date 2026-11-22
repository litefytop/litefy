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


const valueLayoutClasses =
  "peer w-full min-w-0 flex-1 self-stretch border-0 bg-well px-3 text-left";
const valueFaceClasses =
  "rounded-[max(0px,calc(var(--radius-md)-var(--border-width-frame)))] shadow-well " +
  "text-sm leading-5 font-field text-inherit outline-none";
const valueStateClasses =
  "placeholder:text-surface-fg selection:bg-primary selection:text-primary-fg " +
  "focus:outline-none aria-invalid:text-danger-fg";

const valueClasses = cn(valueLayoutClasses, valueFaceClasses, valueStateClasses);

const suffixClasses = "text-sm leading-5 font-field text-surface-fg";

const indicatorClasses =
  "pointer-events-none flex shrink-0 flex-col items-center justify-center " +
  "leading-none select-none";


const indicatorIconClasses = "size-3 first:-mb-0.5";

const indicatorSlotClasses =
  "inline-flex w-control shrink-0 self-stretch items-center justify-center";

export const numberInputPartClasses: NonNullable<NumberInputProps["classNames"]> = {
  root: valueClasses,
  indicator: indicatorClasses,
  indicatorIcon: indicatorIconClasses,
  trailing: fieldAddonClasses,
  hint: fieldHintClasses,
};

export const numberInputShellClasses = cn(
  fieldGroupClasses,
  "data-[invalid=true]:[&:not(:focus-within)_input]:text-danger-fg",
  "relative [&>*]:m-0",
);

const shellLayoutClasses =
  "relative inline-flex min-h-[calc(var(--height-field)+2px)] w-fit max-w-full items-center p-well";
const shellFaceClasses =
  "rounded-md border-frame border-border bg-background text-foreground shadow-base focus-within:focus-ring";
const shellInvalidClasses =
  "data-[invalid=true]:border-danger-fg data-[invalid=true]:focus-within:border-danger-fg " +
  "data-[invalid=true]:[&:not(:focus-within)_input]:text-danger-fg";

const fieldShellClasses = cn(shellLayoutClasses, shellFaceClasses, shellInvalidClasses);


const stepperBaseClasses =
  "inline-flex w-control self-stretch shrink-0 items-center justify-center " +
  "cursor-pointer border-control border-border bg-transparent text-foreground";
const stepperCornerSSClasses =
  "first-of-type:rounded-ss-[max(0px,calc(var(--radius-md)-var(--padding-well)-var(--border-width-frame)))]";
const stepperCornerESClasses =
  "first-of-type:rounded-es-[max(0px,calc(var(--radius-md)-var(--padding-well)-var(--border-width-frame)))]";
const stepperCornerSEClasses =
  "last-of-type:rounded-se-[max(0px,calc(var(--radius-md)-var(--padding-well)-var(--border-width-frame)))]";
const stepperCornerEEClasses =
  "last-of-type:rounded-ee-[max(0px,calc(var(--radius-md)-var(--padding-well)-var(--border-width-frame)))]";
const stepperStateClasses =
  "hover:bg-accent hover:text-accent-fg active:crush focus:outline-none focus:shadow-none";

const stepperClasses = cn(
  stepperBaseClasses,
  stepperCornerSSClasses,
  stepperCornerESClasses,
  stepperCornerSEClasses,
  stepperCornerEEClasses,
  stepperStateClasses,
);


const stepperIconClasses = "size-4";

const fieldValueBaseClasses =
  "w-control self-stretch border-0 bg-well text-center rounded-none shadow-well";
const fieldValueTextClasses =
  "text-sm leading-5 font-field tabular-nums outline-none peer";
const fieldValueStateClasses =
  "placeholder:text-surface-fg selection:bg-primary selection:text-primary-fg " +
  "focus:outline-none aria-invalid:text-danger-fg";

const fieldInputValueClasses = cn(fieldValueBaseClasses, fieldValueTextClasses, fieldValueStateClasses);

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
  indicator,
  ...props
}: NumberInputProps) {
  const basePartClasses = prefix
    ? { ...numberInputPartClasses, leading: fieldAddonClasses }
    : numberInputPartClasses;
  return (
    <NumberInputHeadless
      {...props}
      prefix={prefix}
      suffix={
        typeof suffix === "string" && suffix
          ? <span className={suffixClasses}>{suffix}</span>
          : suffix
      }
      indicator={indicator}
      fieldClassNames={fieldChromeClasses}
      className={cn(numberInputShellClasses, className)}
      classNames={mergeSlots(
        !suffix && indicator !== false
          ? { ...basePartClasses, trailing: indicatorSlotClasses }
          : basePartClasses,
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
