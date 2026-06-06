import { DatePicker } from "@/component/ui/date-picker";

export function DatePickerType() {
  return (
    <div className="flex flex-col gap-4">
      <DatePicker type="date" placeholder="Select date" />
      <DatePicker type="time" placeholder="Select time" />
      <DatePicker type="datetime-local" placeholder="Select date time" />
      <DatePicker type="month" placeholder="Select month" />
      <DatePicker type="week" placeholder="Select week" />
    </div>
  );
}
