"use client";

import { Donut } from "@/ui";

const data = [
  { label: "Free", value: 8420 },
  { label: "Pro", value: 3160 },
  { label: "Team", value: 1240 },
  { label: "Enterprise", value: 310 },
];

export default function DonutPieDemo() {
  return (
    <Donut
      data={data}
      variant="pie"
      gap={1.5}
      ariaLabel="Subscribers by plan"
      valueFormatter={(value) => value.toLocaleString()}
      className="max-w-xs"
    />
  );
}
