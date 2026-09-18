"use client";
import { useState } from "react";
import { ChartLegend } from "@/ui";

const series = [
  { label: "Revenue", color: "var(--color-primary)" },
  { label: "Cost", color: "var(--color-info)" },
  { label: "Margin", color: "var(--color-success)" },
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

  const hiddenLabels = series.filter((_, i) => hidden.has(i)).map((s) => s.label);

  return (
    <div className="flex flex-col gap-6">
      <ChartLegend
        swatch="line"
        items={series}
        hidden={hidden}
        onToggle={toggle}
        className="justify-center"
      />
      <ChartLegend
        swatch="square"
        items={series}
        hidden={hidden}
        onToggle={toggle}
        className="justify-center"
      />
      <p className="text-center text-sm text-muted-foreground">
        Hidden: {hiddenLabels.length > 0 ? hiddenLabels.join(", ") : "none"}
      </p>
    </div>
  );
}
