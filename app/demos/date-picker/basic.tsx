"use client";

import { DatePicker } from "@/ui/skins";

export default function DatePickerBasicDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <DatePicker placeholder="Select or type a date" firstDayOfWeek={1} classNames={{ root: "w-77 min-w-33" }} />
    </div>
  );
}
