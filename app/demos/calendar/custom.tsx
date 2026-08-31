"use client";

import { useState } from "react";
import { CalendarGrid, CalendarHeader, CalendarRoot } from "@/ui";

export default function Demo() {
  const [visibleMonth, setVisibleMonth] = useState(() => Temporal.Now.plainDateISO());
  const [selectedDate, setSelectedDate] = useState<Temporal.PlainDate | null>(
    () => Temporal.Now.plainDateISO(),
  );

  const firstOfMonth = visibleMonth.with({ day: 1 });
  const offset = firstOfMonth.dayOfWeek % 7;
  const start = firstOfMonth.subtract({ days: offset });
  const weekCount = Math.ceil((offset + visibleMonth.daysInMonth) / 7);
  const weeks = Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) =>
      start.add({ days: weekIndex * 7 + dayIndex }),
    ),
  );

  const handleSelect = (date: Temporal.PlainDate) => {
    if (date.year !== visibleMonth.year || date.month !== visibleMonth.month) return;
    setSelectedDate(date);
  };

  return (
    <CalendarRoot className="rounded-full border-2 border-primary p-4">
      <CalendarHeader
        title={`${visibleMonth.year} / ${visibleMonth.month}`}
        onPrevious={() => setVisibleMonth(visibleMonth.subtract({ months: 1 }))}
        onNext={() => setVisibleMonth(visibleMonth.add({ months: 1 }))}
      />
      <CalendarGrid
        weeks={weeks}
        visibleMonth={visibleMonth}
        value={selectedDate}
        onSelect={handleSelect}
        firstDayOfWeek={0}
      />
    </CalendarRoot>
  );
}
