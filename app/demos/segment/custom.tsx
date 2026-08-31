"use client";

import { useState } from "react";
import { Segment } from "@/ui";

const options = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export default function Demo() {
  const [value, setValue] = useState("week");
  const activeIndex = options.findIndex((option) => option.value === value);
  return (
    <div
      role="radiogroup"
      className="relative grid w-72 grid-flow-col auto-cols-fr overflow-hidden rounded-md border border-border bg-muted"
    >
      <div
        aria-hidden
        className="absolute inset-y-0 bg-primary transition-[left] duration-200 ease-out"
        style={{
          left: `${(activeIndex / options.length) * 100}%`,
          width: `${100 / options.length}%`,
        }}
      />
      {options.map((option) => (
        <Segment
          key={option.value}
          checked={value === option.value}
          onClick={() => setValue(option.value)}
          className="relative border-0 bg-transparent aria-checked:bg-transparent"
        >
          {option.label}
        </Segment>
      ))}
    </div>
  );
}
