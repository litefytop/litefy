"use client";

import { DatePicker } from "@/components/ui/date-picker";

export default function DatePickerBasicDemo() {
  return (
    <div className="flex flex-col gap-3">
      <DatePicker placeholder="Select date" />
      <DatePicker type="time" placeholder="Select time" />
      <DatePicker type="datetime-local" placeholder="Select date & time" />
    </div>
  );
}
