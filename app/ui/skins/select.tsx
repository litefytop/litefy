import { Select as SelectHeadless } from "@/ui";
import type { SelectProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { fieldChromeClasses } from "./field";

export type SelectVariant = "default" | "cell";

const triggerBaseClasses =
  "inline-flex min-h-control w-55 min-w-0 max-w-full cursor-pointer items-center justify-between gap-x-2";
const cellTriggerBaseClasses = "flex min-h-control w-55 min-w-0 max-w-full cursor-pointer items-center";
const triggerFaceClasses =
  "rounded-md border-frame border-border bg-background text-foreground px-control-x py-1 text-sm leading-5 font-field shadow-base";
const triggerStateClasses =
  "motion-frame focus-visible:focus-ring " +
  "borderless:border-0 bordered:border-frame bordered:border-border " +
  "data-[placeholder-shown=true]:text-surface-fg";

const triggerClasses = cn(triggerBaseClasses, triggerFaceClasses, triggerStateClasses);
const cellTriggerClasses = cn(cellTriggerBaseClasses, triggerFaceClasses, triggerStateClasses);

const valueClasses = "truncate";

const cellTriggerLabelClasses = "mr-auto truncate";

const cellValueClasses = "ml-auto mr-2 truncate";

const chevronClasses = "size-4 shrink-0 transition-transform duration-sm data-[open=true]:rotate-180";

const panelClasses =
  "max-h-64 overflow-y-auto rounded-md border-frame border-border bg-surface-raised " +
  "text-foreground shadow-elevated p-[var(--radius-md)]";

const labelClasses = "flex h-control items-center px-3 text-label leading-label font-label tracking-label case-label text-surface-fg";

const emptyClasses = "px-3 py-2 text-sm leading-5 text-surface-fg";

const optionBaseClasses = "flex h-control items-center cursor-pointer select-none px-3 text-sm leading-5";
const optionHoverClasses = "hover:bg-accent hover:text-accent-fg";
const optionStateClasses =
  "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-fg " +
  "data-[selected=true]:font-strong data-[disabled=true]:opacity-50";

const optionClasses = cn(optionBaseClasses, optionHoverClasses, optionStateClasses);

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

export function Select({ className, classNames, label, ...props }: SelectProps & { "data-variant"?: SelectVariant }) {
  const isCell = props["data-variant"] === "cell";
  const slots = isCell ? cellSlots : defaultSlots;
  return (
    <SelectHeadless
      {...props}
      fieldClassNames={fieldChromeClasses}
      className={cn(slots.trigger, className)}
      label={label !== null && label !== undefined ? <span className={isCell ? cellTriggerLabelClasses : undefined}>{label}</span> : undefined}
      classNames={mergeSlots(slots, classNames)}
    />
  );
}
