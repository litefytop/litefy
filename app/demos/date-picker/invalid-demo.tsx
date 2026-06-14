"use client";

import { DatePicker } from "@/components/ui/date-picker";

export default function DatePickerInvalidDemo() {
  return (
    <div className="flex flex-col gap-3">
      <DatePicker placeholder="Select date" invalid />
      <DatePicker type="time" placeholder="Select time" invalid />
    </div>
  );
}
