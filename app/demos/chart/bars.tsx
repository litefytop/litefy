"use client";

import { Chart } from "@/ui";
import { useChartPalette } from "@/ui";
import type { ChartSeriesConfig } from "@/ui";

const x = Array.from({ length: 12 }, (_, i) => i + 1);
const returning = [420, 480, 510, 640, 720, 810, 940, 880, 1020, 1150, 1240, 1380];
const fresh = [180, 220, 260, 310, 380, 420, 460, 440, 520, 590, 660, 740];

const data: [number[], ...number[][]] = [x, returning, fresh];

export default function ChartBarsDemo() {
  const palette = useChartPalette({ mode: "mono" });

  const series: ChartSeriesConfig[] = [
    {
      label: "Returning",
      type: "bar",
      stroke: palette[0],
      fill: palette[0],
    },
    {
      label: "New",
      type: "bar",
      stroke: palette[1],
      fill: palette[1],
      value: (v) => `${v} users`,
    },
  ];

  return (
    <div className="w-full max-w-2xl">
      <Chart data={data} series={series} height={220} time={false} />
    </div>
  );
}
