import { DatePicker } from "@/component/ui/date-picker";

export function DatePickerDisabled() {
  return (
    <DatePicker
      label="Select Date"
      description="Disabled date picker"
      disabled
    />
  );
}
