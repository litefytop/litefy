"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/ui";

const labels = [
  "一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月",
];

export default function CalendarI18nDemo() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const previous = Calendar.calendarMonthLabels;
    Calendar.calendarMonthLabels = labels;
    setReady(true);
    return () => {
      Calendar.calendarMonthLabels = previous;
    };
  }, []);

  if (!ready) return null;
  return <CalendarI18nCalendar />;
}

function CalendarI18nCalendar() {
  const [visibleMonth, setVisibleMonth] = useState(() => Temporal.Now.plainDateISO());
  const [selectedDate, setSelectedDate] = useState<Temporal.PlainDate | null>(null);

  return (
    <Calendar
      visibleMonth={visibleMonth}
      onVisibleMonthChange={setVisibleMonth}
      value={selectedDate}
      onChange={setSelectedDate}
      firstDayOfWeek={1}
    />
  );
}
