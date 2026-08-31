"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar, Picker } from "@/ui";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => Temporal.Now.plainDateISO());
  const [selectedDate, setSelectedDate] = useState<Temporal.PlainDate | null>(null);

  const handleTextChange = (text: string) => {
    setText(text);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return;
    const date = Temporal.PlainDate.from(text);
    setSelectedDate(date);
    setVisibleMonth(date);
  };

  return (
    <Picker
      open={open}
      onOpenChange={setOpen}
      value={text}
      onValueChange={handleTextChange}
      placeholder="Select or type a date"
      trailing={<CalendarIcon />}
      onKeyDown={(e) => {
        if (e.key === "Enter" && /^\d{4}-\d{2}-\d{2}$/.test(text)) {
          e.preventDefault();
          const date = Temporal.PlainDate.from(text);
          setSelectedDate(date);
          setVisibleMonth(date);
          setOpen(false);
        }
      }}
    >
      <Calendar
        visibleMonth={visibleMonth}
        onVisibleMonthChange={setVisibleMonth}
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setVisibleMonth(date);
          setText(date.toString());
          setOpen(false);
        }}
        firstDayOfWeek={1}
      />
    </Picker>
  );
}
