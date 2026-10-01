"use client";

import { useState } from "react";
import {
  type CalendarView,
  CalendarGrid,
  CalendarHeader,
  CalendarMonthGrid,
  CalendarNavButton,
  CalendarRoot,
  CalendarTitleButton,
  CalendarYearGrid,
  calendarMonthLabels,
} from "@/ui";
import {
  addDays,
  addMonths,
  addYears,
  currentDate,
  dateFromParts,
  daysInMonth,
  startOfMonth,
} from "@/ui/utils/date-math";

export default function Demo() {
  const [view, setView] = useState<CalendarView>("days");
  const [visibleMonth, setVisibleMonth] = useState(() => currentDate());
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => currentDate());

  const firstOfMonth = startOfMonth(visibleMonth);
  const offset = firstOfMonth.getDay();
  const start = addDays(firstOfMonth, -offset);
  const weekCount = Math.ceil(
    (offset + daysInMonth(visibleMonth.getFullYear(), visibleMonth.getMonth())) / 7,
  );
  const weeks = Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => addDays(start, weekIndex * 7 + dayIndex)),
  );

  const handleSelect = (date: Date) => {
    if (
      date.getFullYear() !== visibleMonth.getFullYear() ||
      date.getMonth() !== visibleMonth.getMonth()
    )
      return;
    setSelectedDate(date);
  };

  const handleMonthSelect = (month: Date) => {
    setVisibleMonth(month);
    setView("days");
  };

  const handleYearSelect = (year: Date) => {
    setVisibleMonth(dateFromParts(year.getFullYear(), visibleMonth.getMonth(), 1));
    setView("months");
  };

  const handlePrevious = () => {
    if (view === "days") setVisibleMonth(addMonths(visibleMonth, -1));
    else if (view === "months") setVisibleMonth(addYears(visibleMonth, -1));
    else setVisibleMonth(addYears(visibleMonth, -12));
  };

  const handleNext = () => {
    if (view === "days") setVisibleMonth(addMonths(visibleMonth, 1));
    else if (view === "months") setVisibleMonth(addYears(visibleMonth, 1));
    else setVisibleMonth(addYears(visibleMonth, 12));
  };

  const navUnit = view === "days" ? "month" : view === "months" ? "year" : "years";

  return (
    <CalendarRoot className="rounded-md border-2 border-primary p-4">
      <CalendarHeader>
        <CalendarNavButton
          direction="previous"
          label={`Previous ${navUnit}`}
          onClick={handlePrevious}
        />
        <div className="flex flex-1 items-center justify-center gap-1">
          <CalendarTitleButton
            data-active={view === "years" || undefined}
            onClick={() => setView("years")}
          >
            {visibleMonth.getFullYear()}
          </CalendarTitleButton>
          <CalendarTitleButton
            data-active={view === "months" || undefined}
            onClick={() => setView("months")}
          >
            {calendarMonthLabels[visibleMonth.getMonth()]}
          </CalendarTitleButton>
        </div>
        <CalendarNavButton direction="next" label={`Next ${navUnit}`} onClick={handleNext} />
      </CalendarHeader>
      {view === "days" && (
        <CalendarGrid
          weeks={weeks}
          visibleMonth={visibleMonth}
          value={selectedDate}
          onSelect={handleSelect}
          firstDayOfWeek={0}
        />
      )}
      {view === "months" && (
        <CalendarMonthGrid
          visibleMonth={visibleMonth}
          value={selectedDate}
          onSelect={handleMonthSelect}
        />
      )}
      {view === "years" && (
        <CalendarYearGrid
          visibleMonth={visibleMonth}
          value={selectedDate}
          onSelect={handleYearSelect}
        />
      )}
    </CalendarRoot>
  );
}
