"use client";

import { useState } from "react";
import { Calendar } from "@/ui/skins";
import { addDays, compareDates, currentDate } from "@/ui/utils/date-math";

export default function Demo() {
  const [visibleMonth, setVisibleMonth] = useState(() => currentDate());
  const minDate = addDays(currentDate(), -7);
  const maxDate = addDays(currentDate(), 7);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Calendar
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
        firstDayOfWeek={1}
        isDateDisabled={(date) => compareDates(date, minDate) < 0 || compareDates(date, maxDate) > 0}
      />
    </div>
  );
}
