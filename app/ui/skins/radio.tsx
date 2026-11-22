import {
  Radio as RadioHeadless,
  RadioGroup as RadioGroupHeadless,
} from "@/ui";
import type { RadioProps, RadioGroupProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const inputClasses =
  "absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer";

const indicatorBaseClasses =
  "group relative inline-flex size-4 shrink-0 items-center justify-center rounded-pill shadow-frame " +
  "border-hair motion-frame";
const indicatorStateClasses =
  "has-[:checked]:border-border has-[:checked]:bg-primary has-[:checked]:shadow-checked " +
  "has-[:focus-visible]:focus-ring";

const indicatorClasses = cn(indicatorBaseClasses, indicatorStateClasses);


const labelClasses =
  "flex min-h-control cursor-pointer select-none items-center gap-x-4 " +
  "font-field " +
  "has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50 " +
  "has-[:disabled]:text-surface-fg";


const groupRootClasses =
  "flex flex-col " +
  "data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:flex-wrap data-[orientation=horizontal]:gap-x-4";

const groupLabelClasses =
  "block w-full ps-2 mb-1 select-none text-sm font-label tracking-label case-label";

const partClasses = {
  input: inputClasses,
  indicator: indicatorClasses,
  label: labelClasses,
};

export function Radio({ className, classNames, ...props }: RadioProps) {
  return (
    <RadioHeadless
      {...props}

      classNames={mergeSlots({ ...partClasses, label: cn(labelClasses, className) }, classNames)}
    />
  );
}

export function RadioGroup({ className, common, options, classNames, ...props }: RadioGroupProps) {
  return (
    <RadioGroupHeadless
      {...props}

      options={options.map((option) => ({
        ...option,
        classNames: mergeSlots(
          { ...partClasses, ...common?.classNames },
          option.classNames,
        ),
      }))}
      common={{ ...common, classNames: mergeSlots(partClasses, common?.classNames) }}
      classNames={mergeSlots({ root: cn(groupRootClasses, className), groupLabel: groupLabelClasses }, classNames)}
    />
  );
}
