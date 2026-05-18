import { DatePicker } from "@/component/ui/date-picker";

export function DatePickerType() {
  return (
    <div className="flex flex-col gap-4">
      <DatePicker
        label="Date"
        type="date"
        placeholder="Select date"
      />
      <DatePicker
        label="Time"
        type="time"
        placeholder="Select time"
      />
      <DatePicker
        label="Date Time"
        type="datetime-local"
        placeholder="Select date time"
      />
      <DatePicker
        label="Month"
        type="month"
        placeholder="Select month"
      />
      <DatePicker
        label="Week"
        type="week"
        placeholder="Select week"
      />
    </div>
  );
}
