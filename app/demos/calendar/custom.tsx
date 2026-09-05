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

export default function Demo() {
  const [view, setView] = useState<CalendarView>("days");
  const [visibleMonth, setVisibleMonth] = useState(() => Temporal.Now.plainDateISO());
  const [selectedDate, setSelectedDate] = useState<Temporal.PlainDate | null>(() =>
    Temporal.Now.plainDateISO(),
  );

  const firstOfMonth = visibleMonth.with({ day: 1 });
  const offset = firstOfMonth.dayOfWeek % 7;
  const start = firstOfMonth.subtract({ days: offset });
  const weekCount = Math.ceil((offset + visibleMonth.daysInMonth) / 7);
  const weeks = Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => start.add({ days: weekIndex * 7 + dayIndex })),
  );

  const handleSelect = (date: Temporal.PlainDate) => {
    if (date.year !== visibleMonth.year || date.month !== visibleMonth.month) return;
    setSelectedDate(date);
  };

  const handleMonthSelect = (month: Temporal.PlainDate) => {
    setVisibleMonth(month);
    setView("days");
  };

  const handleYearSelect = (year: Temporal.PlainDate) => {
    setVisibleMonth(visibleMonth.with({ year: year.year, day: 1 }));
    setView("months");
  };

  const handlePrevious = () => {
    if (view === "days") setVisibleMonth(visibleMonth.subtract({ months: 1 }));
    else if (view === "months") setVisibleMonth(visibleMonth.subtract({ years: 1 }));
    else setVisibleMonth(visibleMonth.subtract({ years: 12 }));
  };

  const handleNext = () => {
    if (view === "days") setVisibleMonth(visibleMonth.add({ months: 1 }));
    else if (view === "months") setVisibleMonth(visibleMonth.add({ years: 1 }));
    else setVisibleMonth(visibleMonth.add({ years: 12 }));
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
            {visibleMonth.year}
          </CalendarTitleButton>
          <CalendarTitleButton
            data-active={view === "months" || undefined}
            onClick={() => setView("months")}
          >
            {calendarMonthLabels[visibleMonth.month - 1]}
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
