"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar, Picker } from "@/ui";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => Temporal.Now.plainDateISO());
  const [selectedDate, setSelectedDate] = useState<Temporal.PlainDate | null>(null);

  return (
    <Picker
      open={open}
      onOpenChange={setOpen}
      value={selectedDate ? selectedDate.toString() : ""}
      placeholder="Select a date"
      trailing={<CalendarIcon />}
    >
      <Calendar
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setOpen(false);
        }}
        firstDayOfWeek={1}
      />
    </Picker>
  );
}
