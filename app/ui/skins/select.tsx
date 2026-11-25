import { Select as SelectHeadless } from "@/ui";
import type { SelectProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";
import { listOptionHoverClasses } from "./list";

export type SelectVariant = "default" | "cell";

const triggerLayoutClasses =
  "flex h-control w-full min-w-0 max-w-[20rem] items-center justify-between gap-x-2";
const cellTriggerLayoutClasses = "flex h-control w-full min-w-0 max-w-[20rem] items-center";
const triggerFaceClasses =
  "rounded-md border-frame border-border bg-surface-raised text-surface-raised-fg px-control-x text-sm/5 font-field shadow-base";
const triggerStateClasses = "motion-frame focus-visible:focus-ring";

const triggerClasses = cn(
  triggerLayoutClasses,
  triggerFaceClasses,
  triggerStateClasses,
  "cursor-pointer",
);
const cellTriggerClasses = cn(
  cellTriggerLayoutClasses,
  triggerFaceClasses,
  triggerStateClasses,
  "cursor-pointer",
);

const triggerDisabledClasses = cn(
  triggerLayoutClasses,
  "rounded-md border-frame border-border bg-disabled px-control-x text-sm leading-5 font-field text-disabled-fg shadow-frame cursor-not-allowed",
);
const cellTriggerDisabledClasses = cn(
  cellTriggerLayoutClasses,
  "rounded-md border-frame border-border bg-disabled px-control-x text-sm leading-5 font-field text-disabled-fg shadow-frame cursor-not-allowed",
);

const valueClasses = "truncate";

const cellTriggerLabelClasses = "mr-auto truncate";

const cellValueClasses = "ml-auto mr-2 truncate";

const chevronClasses = "size-4 shrink-0 transition-transform duration-sm data-[open=true]:rotate-180";

const panelClasses =
  "w-full min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))] max-h-64 overflow-y-auto rounded-md border-frame border-border bg-surface-raised " +
  "text-surface-raised-fg shadow-elevated p-[var(--radius-md)]";

const labelClasses = "flex h-control items-center px-3 control-text text-foreground";

const emptyClasses = "px-3 py-2 text-sm leading-5 text-foreground";

const optionBaseClasses = "flex h-control items-center cursor-pointer select-none px-3 text-sm leading-5";
const optionStateClasses = "data-[selected=true]:font-strong";

const optionClasses = cn(optionBaseClasses, listOptionHoverClasses, optionStateClasses);

const defaultSlots = {
  trigger: triggerClasses,
  value: valueClasses,
  chevron: chevronClasses,
  panel: panelClasses,
  label: labelClasses,
  option: optionClasses,
  empty: emptyClasses,
};

const cellSlots = {
  trigger: cellTriggerClasses,
  value: cellValueClasses,
  chevron: chevronClasses,
  panel: panelClasses,
  label: labelClasses,
  option: optionClasses,
  empty: emptyClasses,
};

export const selectClasses = defaultSlots;

export function Select({ className, classNames, label, disabled, ...props }: SelectProps & { "data-variant"?: SelectVariant }) {
  const isCell = props["data-variant"] === "cell";
  const slots = isCell ? cellSlots : defaultSlots;
  const trigger = disabled
    ? isCell ? cellTriggerDisabledClasses : triggerDisabledClasses
    : slots.trigger;
  return (
    <SelectHeadless
      {...props}
      fieldClassNames={fieldChromeClasses}
      disabled={disabled}
      className={cn(trigger, className)}
      label={label !== null && label !== undefined ? <span className={isCell ? cellTriggerLabelClasses : undefined}>{label}</span> : undefined}
      classNames={mergeSlots(slots, classNames)}
    />
  );
}
