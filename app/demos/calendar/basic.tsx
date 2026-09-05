"use client";

import { useState } from "react";
import { Calendar } from "@/ui";

export default function Demo() {
  const [visibleMonth, setVisibleMonth] = useState(() => Temporal.Now.plainDateISO());
  const [selectedDate, setSelectedDate] = useState<Temporal.PlainDate | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <Calendar
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
        value={selectedDate}
        onChange={setSelectedDate}
        firstDayOfWeek={1}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {selectedDate ? selectedDate.toString() : "-"}
      </p>
    </div>
  );
}
