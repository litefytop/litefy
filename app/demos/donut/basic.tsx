"use client";

import { Donut } from "@/ui";

const data = [
  { label: "Direct", value: 420 },
  { label: "Search", value: 365 },
  { label: "Social", value: 210 },
  { label: "Email", value: 140 },
  { label: "Referral", value: 65 },
];

export default function DonutBasicDemo() {
  return <Donut data={data} ariaLabel="Website traffic by channel" className="max-w-xs" />;
}
