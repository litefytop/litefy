"use client";

import { Donut } from "@/ui";

const data = [
  { label: "Subscriptions", value: 12480 },
  { label: "One-time sales", value: 5320 },
  { label: "Ads", value: 2160 },
  { label: "Affiliate", value: 890 },
];

export default function DonutValueFormatterDemo() {
  return (
    <Donut
      data={data}
      valueFormatter={(value) => `$${value.toLocaleString()}`}
      ariaLabel="Monthly revenue by source"
      className="max-w-xs"
    />
  );
}
