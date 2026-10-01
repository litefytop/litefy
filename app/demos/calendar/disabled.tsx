"use client";

import { useState } from "react";
import { Calendar } from "@/ui";
import { compareDates, currentDate } from "@/ui/utils/date-math";

export default function Demo() {
  const [visibleMonth, setVisibleMonth] = useState(() => currentDate());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const isDateDisabled = (date: Date) => {
    const today = currentDate();
    const weekday = date.getDay();
    return compareDates(date, today) < 0 || weekday === 0 || weekday === 6;
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
