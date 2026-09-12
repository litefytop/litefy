"use client";

import { Radar } from "@/ui";

const axes = ["Design", "Performance", "Pricing", "Support", "Docs"];

const series = [
  { label: "Litefy", values: [85, 92, 78, 88, 95] },
  { label: "Baseline", values: [70, 60, 85, 55, 50] },
];

export default function RadarBasicDemo() {
  return <Radar axes={axes} series={series} ariaLabel="Litefy versus baseline feature comparison" className="max-w-sm" />;
}
