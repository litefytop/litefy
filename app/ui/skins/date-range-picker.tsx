import { DateRangePicker as DateRangePickerHeadless } from "@/ui";
import type { DateRangePickerProps } from "@/ui";
import { buttonInlineClasses } from "./button";
import {
  calendarClasses,
  calendarInPanelClasses,
  calendarPanelWidthClasses,
  calendarPopoverWidthClasses,
} from "./calendar";
import { cn, mergeSlots, mergeStateSlots } from "../utils/cn";
import { pickerClasses, pickerContentLayoutClasses, pickerInputDisabledClasses, pickerRootDisabledClasses } from "./picker";

export const dateRangePickerClasses = {
  root: pickerClasses.root,
  input: pickerClasses.input,
  trailing: pickerClasses.trailing,
  trailingClose: cn(
    buttonInlineClasses,
    "cursor-pointer text-foreground p-0 focus-visible:focus-ring",
    "pointer-events-auto size-7 min-h-0 min-w-0",
  ),
  popover: cn(pickerContentLayoutClasses, calendarPopoverWidthClasses, "p-3"),
  panel: cn(calendarInPanelClasses, calendarPanelWidthClasses, "gap-y-1"),
  invalid: "text-xs text-danger-independent",
};

const trailingCloseDisabledClasses = cn(
  buttonInlineClasses,
  "cursor-not-allowed text-disabled-fg p-0",
  "pointer-events-auto size-7 min-h-0 min-w-0",
);

export function DateRangePicker({ className, classNames, disabled, ...props }: DateRangePickerProps) {
  const { calendar: calendarOverride, root: rootOverride, ...field } = classNames ?? {};
  const fieldSkin = disabled
    ? {
        ...dateRangePickerClasses,
        root: pickerRootDisabledClasses,
        input: pickerInputDisabledClasses,
        trailingClose: trailingCloseDisabledClasses,
      }
    : dateRangePickerClasses;
  return (
    <DateRangePickerHeadless
      {...props}
      disabled={disabled}
      classNames={{
        ...mergeSlots(fieldSkin, { ...field, root: cn(fieldSkin.root, rootOverride, className) }),
        calendar: mergeStateSlots(calendarClasses, calendarOverride),
      }}
    />
  );
}
