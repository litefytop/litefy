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

const random = seeded(42);
const day = 86400;
const points = 30;
const now = Math.floor(Date.now() / 1000);

const x = Array.from({ length: points }, (_, i) => now - (points - 1 - i) * day);
const visits = x.map((_, i) => Math.round(700 + Math.sin(i / 4) * 150 + random() * 80));
const orders = x.map((_, i) => Math.round(450 + Math.cos(i / 5) * 80 + random() * 40));
const revenue = x.map((_, i) => Math.round(1000 + Math.sin(i / 6) * 250 + random() * 120));
const signups = x.map((_, i) => Math.round(200 + Math.sin(i / 3) * 50 + random() * 30));

const data: [number[], ...number[][]] = [x, visits, orders, revenue, signups];

const series: ChartSeriesConfig[] = [
  { label: "Visits" },
  { label: "Orders" },
  { label: "Revenue", width: 2 },
  { label: "Signups" },
];

export default function ChartLineDemo() {
  return (
    <div className="w-full max-w-2xl">
      <Chart data={data} series={series} height={260} />
    </div>
  );
}
