import { DatePicker as DatePickerHeadless } from "@/ui";
import type { DatePickerProps } from "@/ui";
import { cn, mergeSlots, mergeStateSlots } from "../utils/cn";
import { pickerClasses, pickerContentLayoutClasses, pickerInputDisabledClasses, pickerRootDisabledClasses } from "./picker";
import {
  calendarClasses,
  calendarInPanelClasses,
  calendarPanelWidthClasses,
  calendarPopoverWidthClasses,
} from "./calendar";


const skin = {
  root: pickerClasses.root,
  input: pickerClasses.input,
  trailing: pickerClasses.trailing,
  popover: cn(pickerContentLayoutClasses, calendarPopoverWidthClasses, "p-3"),
  panel: cn(calendarInPanelClasses, calendarPanelWidthClasses),
};

export function DatePicker({ classNames, disabled, ...props }: DatePickerProps) {
  const { calendar: calendarOverride, ...field } = classNames ?? {};
  const fieldSkin = disabled
    ? { ...skin, root: pickerRootDisabledClasses, input: pickerInputDisabledClasses }
    : skin;
  return (
    <DatePickerHeadless
      {...props}
      disabled={disabled}
      classNames={{
        ...mergeSlots(fieldSkin, field),
        calendar: mergeStateSlots(calendarClasses, calendarOverride),
      }}
    />
  );
}
