import { DateRangePicker as DateRangePickerHeadless } from "@/ui";
import type { DateRangePickerProps } from "@/ui";
import { buttonVariants } from "./button";
import {
  calendarClasses,
  calendarDayBaseClasses,
  calendarInPanelClasses,
  calendarPanelWidthClasses,
  calendarPopoverWidthClasses,
} from "./calendar";
import { cn, mergeSlots } from "../utils/cn";
import { pickerClasses } from "./picker";

const rangeDayClasses =
  "data-[range=single]:bg-primary data-[range=single]:text-primary-fg " +
  "data-[range=single]:hover:bg-primary data-[range=single]:hover:text-primary-fg " +
  "data-[range=start]:bg-primary data-[range=start]:text-primary-fg " +
  "data-[range=start]:hover:bg-primary data-[range=start]:hover:text-primary-fg " +
  "data-[range=start]:rounded-l-md data-[range=start]:rounded-r-none " +
  "data-[range=end]:bg-primary data-[range=end]:text-primary-fg " +
  "data-[range=end]:hover:bg-primary data-[range=end]:hover:text-primary-fg " +
  "data-[range=end]:rounded-r-md data-[range=end]:rounded-l-none " +
  "data-[range=between]:bg-accent data-[range=between]:text-foreground " +
  "data-[range=between]:hover:bg-accent data-[range=between]:hover:text-foreground " +
  "data-[range=between]:rounded-none";

export const calendarRangeClasses = mergeSlots(calendarClasses, {
  day: cn(calendarDayBaseClasses, rangeDayClasses),
});

export const dateRangePickerClasses = {
  root: pickerClasses.root,
  input: pickerClasses.input,
  trailing: pickerClasses.trailing,
  trailingClose: cn(
    buttonVariants.text,
    "pointer-events-auto size-7 min-h-0 min-w-0 p-0 [&_svg]:size-4",
  ),
  popover: cn(pickerClasses.content, calendarPopoverWidthClasses, "p-3"),
  panel: cn(calendarInPanelClasses, calendarPanelWidthClasses, "gap-y-1"),
  invalid: "text-xs text-danger-fg",
};

export function DateRangePicker({ classNames, ...props }: DateRangePickerProps) {
  const { calendar: calendarOverride, ...field } = classNames ?? {};
  return (
    <DateRangePickerHeadless
      {...props}
      classNames={{
        ...mergeSlots(dateRangePickerClasses, field),
        calendar: mergeSlots(calendarRangeClasses, calendarOverride),
      }}
    />
  );
}
