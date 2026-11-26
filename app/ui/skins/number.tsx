import {
  NumberField as NumberFieldHeadless,
  NumberInput as NumberInputHeadless,
  type NumberFieldProps,
  type NumberInputProps,
} from "@/ui";
import { cn, mergeStateSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";
import { fieldAddonClasses, fieldGroupClasses, fieldGroupDisabledClasses } from "./input";

export type { NumberFieldProps, NumberInputProps } from "@/ui";


const valueLayoutClasses =
  "peer min-w-0 flex-1 self-stretch border-0 bg-surface px-3 text-left text-surface-fg";
const valueFaceClasses =
  "rounded-(--radius-field-inner) shadow-recess " +
  "text-sm leading-5 font-field text-inherit outline-none";
const valueStateClasses =
  "placeholder:text-surface-fg selection:bg-primary selection:text-primary-fg " +
  "aria-invalid:text-danger-independent";

const valueClasses = cn(valueLayoutClasses, valueFaceClasses, valueStateClasses);
const valueDisabledClasses = cn(
  valueLayoutClasses,
  valueFaceClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg placeholder:text-disabled-fg",
);

const suffixClasses = "text-sm leading-5 font-field text-foreground";
const suffixDisabledClasses = "text-sm leading-5 font-field text-disabled-fg";

const hintShellClasses =
  "pointer-events-none absolute -top-7 right-0 z-10 hidden pointer-fine:min-sm:flex items-center gap-x-1 opacity-0 peer-focus-visible:opacity-100";

const indicatorClasses =
  "pointer-events-none flex shrink-0 flex-col items-center justify-center " +
  "leading-none select-none";


const indicatorIconClasses = "size-3 first:-mb-0.5";

const indicatorSlotClasses =
  "inline-flex w-control shrink-0 self-stretch items-center justify-center";

export const numberInputPartClasses: NonNullable<NumberInputProps["classNames"]> = {
  root: ({ disabled }) => disabled ? valueDisabledClasses : valueClasses,
  indicator: ({ disabled }) => cn(indicatorClasses, disabled ? suffixDisabledClasses : suffixClasses),
  indicatorIcon: indicatorIconClasses,
  trailing: fieldAddonClasses,
  hint: hintShellClasses,
  hintKey: "kbd",
};

const numberInputShellLayoutClasses = "relative [&>*]:m-0";

export const numberInputShellClasses = cn(fieldGroupClasses, numberInputShellLayoutClasses);
export const numberInputShellDisabledClasses = cn(fieldGroupDisabledClasses, numberInputShellLayoutClasses);

const numberInputShellClassesByState = (disabled: boolean | undefined) =>
  disabled ? numberInputShellDisabledClasses : numberInputShellClasses;

const shellLayoutClasses =
  "relative inline-flex min-h-[calc(var(--height-field)+2px)] w-fit max-w-full items-stretch";
const shellFaceClasses =
  "rounded-md border-frame border-border bg-surface-raised text-surface-raised-fg shadow-base focus-within:focus-ring";
const shellInvalidClasses = "field-invalid";

const fieldShellClasses = cn(shellLayoutClasses, shellFaceClasses, shellInvalidClasses);
const fieldShellDisabledClasses = cn(
  shellLayoutClasses,
  "rounded-md border-frame border-border bg-disabled text-disabled-fg shadow-base",
);


const stepperLayoutClasses = cn(
  "inline-flex w-control self-stretch shrink-0 items-center justify-center border-control",
  "first-of-type:rounded-s-(--radius-field-inner)",
  "last-of-type:rounded-e-(--radius-field-inner)",
);

const stepperClasses = cn(
  stepperLayoutClasses,
  "cursor-pointer bg-transparent text-inherit hover:bg-accent hover:text-accent-fg active:crush focus:outline-none",
);

const stepperDisabledClasses = cn(
  stepperLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);


const stepperIconClasses = "size-4";

const fieldValueBaseClasses =
  "w-control border-0 bg-surface text-center text-surface-fg rounded-none shadow-recess";
const fieldValueTextClasses =
  "text-sm leading-5 font-field tabular-nums outline-none peer";
const fieldValueStateClasses =
  "placeholder:text-surface-fg selection:bg-primary selection:text-primary-fg " +
  "aria-invalid:text-danger-independent focus:text-inherit dark:focus:text-inherit";

const fieldInputValueClasses = cn(fieldValueBaseClasses, fieldValueTextClasses, fieldValueStateClasses);
const fieldInputValueDisabledClasses = cn(
  fieldValueBaseClasses,
  fieldValueTextClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg placeholder:text-disabled-fg",
);

export const numberFieldShellClasses = fieldShellClasses;
export const numberFieldShellDisabledClasses = fieldShellDisabledClasses;

const numberFieldShellClassesByState = (disabled: boolean | undefined) =>
  disabled ? numberFieldShellDisabledClasses : numberFieldShellClasses;

export const numberFieldPartClasses: NonNullable<NumberFieldProps["classNames"]> = {
  root: ({ disabled }) => disabled ? fieldInputValueDisabledClasses : fieldInputValueClasses,
  stepper: ({ disabled }) => disabled ? stepperDisabledClasses : stepperClasses,
  stepperIcon: stepperIconClasses,
  hint: hintShellClasses,
  hintKey: "kbd",
};

export function NumberInput({
  className,
  classNames,
  prefix,
  suffix,
  indicator,
  disabled,
  ...props
}: NumberInputProps) {
  const basePartClasses = prefix
    ? { ...numberInputPartClasses, leading: fieldAddonClasses }
    : numberInputPartClasses;
  return (
    <NumberInputHeadless
      {...props}
      disabled={disabled}
      prefix={prefix}
      suffix={
        typeof suffix === "string" && suffix
          ? <span className={disabled ? suffixDisabledClasses : suffixClasses}>{suffix}</span>
          : suffix
      }
      indicator={indicator}
      fieldClassNames={fieldChromeClasses}
      className={cn(numberInputShellClassesByState(disabled), className)}
      classNames={mergeStateSlots(
        {
          ...basePartClasses,
          ...(!suffix && indicator !== false ? { trailing: indicatorSlotClasses } : {}),
        },
        classNames,
      )}
    />
  );
}

export function NumberField({
  className,
  classNames,
  disabled,
  ...props
}: NumberFieldProps) {
  return (
    <NumberFieldHeadless
      {...props}
      disabled={disabled}
      className={cn(numberFieldShellClassesByState(disabled), className)}
      classNames={mergeStateSlots(numberFieldPartClasses, classNames)}
    />
  );
}
