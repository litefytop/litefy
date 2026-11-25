import {
  Radio as RadioHeadless,
  RadioGroup as RadioGroupHeadless,
} from "@/ui";
import type { RadioProps, RadioGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const inputLayoutClasses =
  "absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 opacity-0";

const inputClasses = cn(inputLayoutClasses, "cursor-pointer");
const inputDisabledClasses = cn(inputLayoutClasses, "cursor-not-allowed");

const indicatorBaseClasses =
  "group relative inline-flex size-4 shrink-0 items-center justify-center rounded-pill bg-surface-raised shadow-unchecked " +
  "border-hair motion-frame";
const indicatorStateClasses =
  "has-[:checked]:border-0 has-[:checked]:bg-primary-solid has-[:checked]:shadow-checked " +
  "has-[:focus-visible]:focus-ring";

const indicatorClasses = cn(indicatorBaseClasses, indicatorStateClasses);


const labelClasses =
  "flex min-h-control cursor-pointer select-none items-center gap-x-4 font-field text-foreground";

const labelDisabledClasses =
  "flex min-h-control cursor-not-allowed select-none items-center gap-x-4 font-field text-disabled-fg";

const indicatorDisabledClasses =
  "group relative inline-flex size-4 shrink-0 items-center justify-center rounded-pill border-hair border-border bg-disabled shadow-unchecked motion-frame";


const groupVerticalClasses = "flex flex-col";
const groupHorizontalClasses = "flex flex-row flex-wrap gap-x-4";

const groupLabelClasses =
  "block w-full ps-2 mb-1 select-none text-sm control-label";

const partClasses = {
  input: inputClasses,
  indicator: indicatorClasses,
  label: labelClasses,
};

const disabledPartClasses = {
  input: inputDisabledClasses,
  indicator: indicatorDisabledClasses,
  label: labelDisabledClasses,
};

function radioClasses(disabled: boolean | undefined, overrides?: RadioProps["classNames"]) {
  return mergeSlots(disabled ? disabledPartClasses : partClasses, overrides);
}

export function Radio({ className, classNames, disabled, ...props }: RadioProps) {
  return (
    <RadioHeadless
      {...props}
      disabled={disabled}
      classNames={radioClasses(disabled, {
        ...classNames,
        label: cn(disabled ? labelDisabledClasses : labelClasses, classNames?.label, className),
      })}
    />
  );
}

export interface RadioGroupSkinProps extends RadioGroupProps {
  orientation?: "horizontal" | "vertical";
}

export function RadioGroup({ orientation, className, common, options, classNames, disabled, ...props }: RadioGroupSkinProps) {
  return (
    <RadioGroupHeadless
      {...props}
      disabled={disabled}

      options={options.map((option) => ({
        ...option,
        classNames: radioClasses(disabled || option.disabled, {
          ...common?.classNames,
          ...option.classNames,
        }),
      }))}
      common={{ ...common, classNames: mergeSlots(partClasses, common?.classNames) }}
      classNames={mergeSlots({ root: cn(orientation === "horizontal" ? groupHorizontalClasses : groupVerticalClasses, className), groupLabel: groupLabelClasses }, classNames)}
    />
  );
}
