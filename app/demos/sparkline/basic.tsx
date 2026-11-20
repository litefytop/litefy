"use client";

import { Sparkline } from "@/ui/skins";

const stats = [
  { label: "Revenue", value: "$48.2k", delta: "+8.2%", data: [12, 18, 15, 22, 19, 26, 24, 31, 28, 35, 33, 40], variant: "area" as const, smooth: true },
  { label: "Orders", value: "1,284", delta: "+3.1%", data: [22, 19, 24, 21, 26, 23, 29, 27, 32, 30, 36, 34], variant: "line" as const, smooth: false },
  { label: "Latency", value: "212ms", delta: "-12%", data: [30, 28, 29, 24, 22, 25, 21, 18, 20, 16], variant: "bar" as const, smooth: false },
];

export default function SparklineBasicDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex min-w-32 flex-col gap-1">
          <span className="text-xs leading-4 font-strong tracking-label case-label text-surface-fg">
            {stat.label}
          </span>
          <span className="flex items-baseline gap-x-2">
            <span className="text-base leading-6 font-strong tabular-nums">{stat.value}</span>
            <span className="text-xs leading-4 font-field text-surface-fg tabular-nums">{stat.delta}</span>
          </span>
          <Sparkline data={stat.data} variant={stat.variant} smooth={stat.smooth} aria-label={`${stat.label} trend`} className="w-32" />
        </div>
      ))}
    </div>
  );
}
