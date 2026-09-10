"use client";

import { Chart } from "@/ui";
import { useChartPalette } from "@/ui";
import type { ChartSeriesConfig } from "@/ui";

function makeBarsPaths(slot: number, slots: number): uPlot.Series["paths"] {
  return (u, seriesIdx) => {
    const fill = new Path2D();
    const scaleX = u.scales.x;
    const scaleY = u.scales.y;
    const xs = u.data[0] as number[];
    const ys = u.data[seriesIdx] as number[];
    const { left, width, top, height } = u.bbox;
    const toX = (v: number) =>
      left + ((v - (scaleX.min ?? 0)) / ((scaleX.max ?? 1) - (scaleX.min ?? 0))) * width;
    const toY = (v: number) =>
      top + height - ((v - (scaleY.min ?? 0)) / ((scaleY.max ?? 1) - (scaleY.min ?? 0))) * height;
    const groupW = (width / ys.length) * 0.7;
    const barW = groupW / slots;
    const offset = (slot - (slots - 1) / 2) * barW;
    ys.forEach((y, i) => {
      if (y == null) return;
      const x0 = toX(xs[i]) + offset - barW / 2;
      const yTop = toY(Math.max(y, 0));
      const yBot = toY(Math.min(y, 0));
      fill.rect(x0, yTop, barW, yBot - yTop);
    });
    return { stroke: null, fill };
  };
}

const x = Array.from({ length: 12 }, (_, i) => i + 1);
const returning = [420, 480, 510, 640, 720, 810, 940, 880, 1020, 1150, 1240, 1380];
const fresh = [180, 220, 260, 310, 380, 420, 460, 440, 520, 590, 660, 740];

const data: [number[], ...number[][]] = [x, returning, fresh];

export default function ChartBarsDemo() {
  const palette = useChartPalette({ mode: "mono" });

  const series: ChartSeriesConfig[] = [
    {
      label: "Returning",
      stroke: palette[0],
      fill: palette[0],
      paths: makeBarsPaths(0, 2),
    },
    {
      label: "New",
      stroke: palette[1],
      fill: palette[1],
      paths: makeBarsPaths(1, 2),
      value: (v) => `${v} users`,
    },
  ];

  return (
    <div className="w-full max-w-2xl">
      <Chart data={data} series={series} height={220} time={false} />
    </div>
  );
}
