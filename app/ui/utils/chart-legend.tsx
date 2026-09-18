"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "./cn";

export interface ChartLegendProps {
  items: { label: string; color: string }[];
  hidden?: ReadonlySet<number>;
  swatch?: "line" | "square";
  onToggle?: (index: number) => void;
  onHover?: (index: number | null) => void;
  className?: ClassNameValue;
  style?: React.CSSProperties;
}

const swatchClass = {
  line: "h-0.5 w-3 rounded-full",
  square: "size-2.5 rounded-[3px]",
};

export function ChartLegend({
  items,
  hidden,
  swatch = "line",
  onToggle,
  onHover,
  className,
  style,
}: ChartLegendProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs", className)}
      style={style}
    >
      {items.map((item, i) => (
        <button
          key={`${item.label}-${i}`}
          type="button"
          onMouseEnter={() => onHover?.(i)}
          onMouseLeave={() => onHover?.(null)}
          onClick={() => onToggle?.(i)}
          className={cn(
            "flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-opacity hover:text-foreground",
            hidden?.has(i) && "opacity-40",
          )}
        >
          <span className={swatchClass[swatch]} style={{ background: item.color }} />
          {item.label}
        </button>
      ))}
    </div>
  );
}
