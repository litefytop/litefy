import { DatePicker } from "@/component/ui/date-picker";

export function DatePickerBasic() {
  return (
    <DatePicker
      label="Select Date"
      description="Choose a date"
      className="w-3xs"
    />
  );
}
