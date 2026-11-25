import { MultiSelect as MultiSelectHeadless } from "@/ui";
import type { MultiSelectProps } from "@/ui";
import { cn, mergeStateSlots, type SlotState } from "../utils/cn";
import { fieldGroupBaseClasses, fieldGroupDisabledClasses, fieldGroupFaceClasses } from "./input";
import { listOptionHoverClasses } from "./list";


const triggerLayoutClasses = "min-h-field flex-wrap gap-1 px-2";

const triggerClasses = cn(
  fieldGroupBaseClasses,
  fieldGroupFaceClasses,
  triggerLayoutClasses,
  "cursor-pointer",
);

const triggerDisabledClasses = cn(
  fieldGroupDisabledClasses,
  triggerLayoutClasses,
);

const triggerClassesByState = (disabled: boolean | undefined) =>
  disabled ? triggerDisabledClasses : triggerClasses;

const listClasses = "max-h-96 overflow-y-auto outline-none";

const groupClasses =
  "px-3 py-snug text-sm leading-5 control-label text-foreground";

const optionLayoutClasses =
  "flex select-none items-center gap-x-2 px-3 py-snug text-sm leading-5 font-field data-[grouped]:ps-4";

const optionClasses = cn(
  optionLayoutClasses,
  "cursor-pointer text-foreground",
  listOptionHoverClasses,
  "data-[selected]:font-strong",
);

const optionDisabledClasses = cn(
  optionLayoutClasses,
  "cursor-not-allowed bg-disabled text-disabled-fg",
);

const optionClassesByState = ({ disabled }: SlotState) =>
  disabled ? optionDisabledClasses : optionClasses;

const checkClasses = "size-4 shrink-0 text-primary";
const checkDisabledClasses = "size-4 shrink-0 text-disabled-fg";

export function MultiSelect({
  className,
  classNames,
  disabled,
  ...props
}: MultiSelectProps) {
  return (
    <MultiSelectHeadless
      {...props}
      disabled={disabled}
      className={cn(triggerClassesByState(disabled), className)}
      classNames={mergeStateSlots(
        {
          content:
            "w-fit min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))] rounded-md border-frame border-border bg-surface-raised text-surface-raised-fg shadow-elevated p-[var(--radius-md)]",
          list: listClasses,
          group: groupClasses,
          option: optionClassesByState,
          check: ({ disabled: isDisabled }) => isDisabled ? checkDisabledClasses : checkClasses,
        },
        classNames,
      )}
    />
  );
}
