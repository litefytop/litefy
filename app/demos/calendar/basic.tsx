"use client";

import { useState } from "react";
import { Calendar } from "@/ui";
import { currentDate, toISODate } from "@/ui/utils/date-math";

export default function Demo() {
  const [visibleMonth, setVisibleMonth] = useState(() => currentDate());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
        Selected: {selectedDate ? toISODate(selectedDate) : "-"}
      </p>
    </div>
  );
}
