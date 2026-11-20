import { DatePicker as DatePickerHeadless } from "@/ui";
import type { DatePickerProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { pickerClasses } from "./picker";
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
  popover: cn(pickerClasses.content, calendarPopoverWidthClasses, "p-3"),
  panel: cn(calendarInPanelClasses, calendarPanelWidthClasses),
};

export function DatePicker({ classNames, ...props }: DatePickerProps) {
  const { calendar: calendarOverride, ...field } = classNames ?? {};
  return (
    <DatePickerHeadless
      {...props}
      classNames={{
        ...mergeSlots(skin, field),
        calendar: mergeSlots(calendarClasses, calendarOverride),
      }}
    />
  );
}
