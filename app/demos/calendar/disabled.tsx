"use client";

import { useState } from "react";
import { Calendar } from "@/ui";

export default function Demo() {
  const [visibleMonth, setVisibleMonth] = useState(() => Temporal.Now.plainDateISO());
  const [selectedDate, setSelectedDate] = useState<Temporal.PlainDate | null>(null);

  const isDateDisabled = (date: Temporal.PlainDate) => {
    const today = Temporal.Now.plainDateISO();
    return Temporal.PlainDate.compare(date, today) < 0 || date.dayOfWeek > 5;
  };

  return (
    <div className="flex flex-col gap-3">
      <Calendar
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
        value={selectedDate}
        onChange={setSelectedDate}
        isDateDisabled={isDateDisabled}
      />
      <p className="text-sm text-muted-foreground">
        Past dates and weekends are disabled
      </p>
    </div>
  );
}
