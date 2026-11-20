"use client";

import { useState } from "react";
import { Calendar } from "@/ui/skins";
import { currentDate } from "@/ui/utils/date-math";

export default function Demo() {
  const [visibleMonth, setVisibleMonth] = useState(() => currentDate());

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Calendar
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
        firstDayOfWeek={1}
      />
    </div>
  );
}
