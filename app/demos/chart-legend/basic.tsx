"use client";
import { useState } from "react";
import { useChartPalette } from "@/ui";
import { ChartLegend } from "@/ui/skins";

const series = [
  { label: "Revenue" },
  { label: "Cost" },
  { label: "Margin" },
];

export default function Demo() {
  const palette = useChartPalette();
  const [hidden, setHidden] = useState<ReadonlySet<number>>(new Set());
  const toggle = (index: number) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });


  const items = series.map((item, i) => ({
    label: item.label,
    color: palette[i % palette.length],
  }));

  return (
    <div className="flex flex-col gap-3 items-center">
      <ChartLegend swatch="line" items={items} hidden={hidden} onToggle={toggle} />
      <ChartLegend swatch="square" items={items} hidden={hidden} onToggle={toggle} />
    </div>
  );
}
