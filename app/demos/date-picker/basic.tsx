"use client";

import { useState } from "react";
import { DatePicker } from "@/ui";

export default function DatePickerBasicDemo() {
  const [date, setDate] = useState<Temporal.PlainDate | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <DatePicker
        placeholder="Select or type a date"
        firstDayOfWeek={1}
        onValueChange={setDate}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {date?.toString() ?? "-"}
      </p>
    </div>
  );
}
