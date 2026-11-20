"use client";
import { useState } from "react";
import { ChartLegend } from "@/ui/skins";

const series = [
  { label: "Revenue", color: "var(--primary)" },
  { label: "Cost", color: "var(--info-fg)" },
  { label: "Margin", color: "var(--success-fg)" },
];

export default function Demo() {
  const [hidden, setHidden] = useState<ReadonlySet<number>>(new Set());
  const toggle = (index: number) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });


  return (
    <div className="flex flex-col gap-3 items-center">
      <ChartLegend
        swatch="line"
        items={series}
        hidden={hidden}
        onToggle={toggle}
      />
      <ChartLegend
        swatch="square"
        items={series}
        hidden={hidden}
        onToggle={toggle}
      />
    </div>
  );
}
