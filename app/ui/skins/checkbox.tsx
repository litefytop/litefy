import {
  Checkbox as CheckboxHeadless,
  CheckboxGroup as CheckboxGroupHeadless,
} from "@/ui";
import type { CheckboxProps, CheckboxGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const inputClasses =
  "peer absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-0";

const indicatorClasses =
  "relative inline-flex size-4 shrink-0 items-center justify-center rounded-sm border-hair shadow-frame " +
  "text-foreground motion-frame " +
  "has-[:checked]:border-border has-[:checked]:bg-primary has-[:checked]:text-primary-fg has-[:checked]:shadow-checked " +
  "has-[:indeterminate]:border-border has-[:indeterminate]:bg-primary has-[:indeterminate]:text-primary-fg has-[:indeterminate]:shadow-checked " +
  "has-[:focus-visible]:focus-ring";

const iconClasses =
  "size-3 stroke-3 opacity-0 transition-opacity duration-sm ease-frame " +
  "peer-checked:opacity-100 peer-indeterminate:opacity-100";


const labelClasses =
  "flex min-h-control min-w-control cursor-pointer select-none items-center gap-x-4 " +
  "font-field text-foreground " +
  "has-[:checked]:not-has-[:indeterminate]:[&_[data-line]]:line-through " +
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 " +
  "has-[:disabled]:text-surface-fg";


export const checkboxPartClasses = {
  input: inputClasses,
  indicator: indicatorClasses,
  icon: iconClasses,
  label: labelClasses,
};


const groupClasses = {
  root: "flex flex-col",
  section:
    "flex flex-col text-sm font-label case-label tracking-label text-foreground",
  label:
    "px-2 text-sm leading-5 font-label case-label tracking-label text-surface-fg",
};

export const checkboxGroupClasses = groupClasses;

export function Checkbox({ className, classNames, ...props }: CheckboxProps) {
  return (
    <CheckboxHeadless
      {...props}

      classNames={mergeSlots(
        { ...checkboxPartClasses, label: cn(labelClasses, className) },
        classNames,
      )}
    />
  );
}

export function CheckboxGroup({
  className,
  common,
  options,
  classNames,
  ...props
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupHeadless
      {...props}

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
                classNames: mergeSlots(
                  { ...checkboxPartClasses, ...common?.classNames },
                  child.classNames,
                ),
              })),
            }
          : {
              ...option,
              classNames: mergeSlots(
                { ...checkboxPartClasses, ...common?.classNames },
                option.classNames,
              ),
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
