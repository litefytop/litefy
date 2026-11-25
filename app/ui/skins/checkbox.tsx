import {
  Checkbox as CheckboxHeadless,
  CheckboxGroup as CheckboxGroupHeadless,
} from "@/ui";
import type { CheckboxProps, CheckboxGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const inputLayoutClasses =
  "peer absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 opacity-0";

const inputClasses = cn(inputLayoutClasses, "cursor-pointer");
const inputDisabledClasses = cn(inputLayoutClasses, "cursor-not-allowed");

const indicatorBaseClasses =
  "relative inline-flex size-4 shrink-0 items-center justify-center rounded-xs border-hair bg-surface-raised shadow-unchecked " +
  "text-foreground motion-frame";
const indicatorSelectedClasses =
  "data-selected:border-0 data-selected:bg-primary-solid data-selected:text-primary-fg data-selected:shadow-checked";
const indicatorFocusClasses = "has-[:focus-visible]:focus-ring";

const indicatorClasses = cn(
  indicatorBaseClasses,
  indicatorSelectedClasses,
  indicatorFocusClasses,
);

const iconClasses =
  "size-3 stroke-3 opacity-0 transition-opacity duration-sm ease-frame " +
  "peer-checked:opacity-100 peer-indeterminate:opacity-100";


const labelBaseClasses =
  "group/label flex min-h-control min-w-control cursor-pointer select-none items-center gap-x-4 " +
  "font-field text-foreground";

const labelClasses = labelBaseClasses;
const labelDisabledClasses = cn(
  "group/label flex min-h-control min-w-control cursor-not-allowed select-none items-center gap-x-4 " +
    "font-field text-disabled-fg",
);

const textClasses =
  "group-has-[:checked]/label:not-group-has-[:indeterminate]/label:line-through";


export const checkboxPartClasses = {
  input: inputClasses,
  indicator: indicatorClasses,
  icon: iconClasses,
  text: textClasses,
  label: labelClasses,
};

const checkboxDisabledPartClasses = {
  input: inputDisabledClasses,
  indicator:
    "relative inline-flex size-4 shrink-0 items-center justify-center rounded-xs border-hair border-border bg-disabled text-disabled-fg shadow-unchecked motion-frame",
  icon: iconClasses,
  text: textClasses,
  label: labelDisabledClasses,
};

export function checkboxClasses(disabled: boolean | undefined, overrides?: CheckboxProps["classNames"]) {
  return mergeSlots(disabled ? checkboxDisabledPartClasses : checkboxPartClasses, overrides);
}


const groupClasses = {
  root: "flex flex-col",
  groupLabel:
    "block w-full ps-2 mb-1 select-none text-sm control-label",
  section:
    "flex flex-col text-sm control-label text-foreground",
  label:
    "px-2 text-sm leading-5 control-label text-foreground",
};

export const checkboxGroupClasses = groupClasses;

export function Checkbox({ className, classNames, disabled, ...props }: CheckboxProps) {
  return (
    <CheckboxHeadless
      {...props}
      disabled={disabled}
      classNames={checkboxClasses(disabled, {
        ...classNames,
        label: cn(disabled ? labelDisabledClasses : labelClasses, classNames?.label, className),
      })}
    />
  );
}

export function CheckboxGroup({
  className,
  common,
  options,
  classNames,
  disabled,
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupHeadless
      {...props}
      disabled={disabled}

      classNames={mergeSlots(
        { ...groupClasses, root: cn(groupClasses.root, className) },
        classNames,
      )}

      options={options.map((option) =>
        "group" in option
          ? {
              ...option,
              options: option.options.map((child) => ({
                ...child,
                classNames: checkboxClasses(disabled || child.disabled, {
                  ...common?.classNames,
                  ...child.classNames,
                }),
              })),
            }
          : {
              ...option,
              classNames: checkboxClasses(disabled || option.disabled, {
                ...common?.classNames,
                ...option.classNames,
              }),
            },
      )}
      common={{
        ...common,
        classNames: mergeSlots(checkboxPartClasses, common?.classNames),
      }}
    />
  );
}

export { CheckboxHeadless as CheckboxBase };
