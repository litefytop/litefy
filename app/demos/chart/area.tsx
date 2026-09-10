"use client";

import { Chart } from "@/ui";
import type { ChartSeriesConfig } from "@/ui";

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const random = seeded(7);
const day = 86400;
const points = 20;
const now = Math.floor(Date.now() / 1000);

const x = Array.from({ length: points }, (_, i) => now - (points - 1 - i) * day);
const high = x.map((_, i) => Math.round(8 + Math.sin(i / 3) * 6 + random() * 3));
const avg = x.map((_, i) => Math.round(1 + Math.sin(i / 5) * 4 + random() * 2));
const low = x.map((_, i) => Math.round(-6 + Math.sin(i / 4) * 5 + random() * 3));

const data: [number[], ...number[][]] = [x, high, avg, low];

const series: ChartSeriesConfig[] = [
  { label: "High", fill: true },
  { label: "Avg" },
  { label: "Low", fill: true },
];

export default function ChartAreaDemo() {
  return (
    <div className="w-full max-w-2xl">
      <Chart data={data} series={series} height={220} />
    </div>
  );
}
