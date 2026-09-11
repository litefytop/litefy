"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { areaPath, linePath, scaleLinear } from "../utils/chart-kit";
import { type ChartPoint } from "../utils/chart-kit";

export type SparklineVariant = "line" | "area" | "bar";

export interface SparklineProps extends Omit<React.ComponentProps<"svg">, "className"> {
  data: number[];
  variant?: SparklineVariant;
  smooth?: boolean;
  className?: ClassNameValue;
}

export function Sparkline({
  data,
  variant = "line",
  smooth = false,
  className,
  ...props
}: SparklineProps) {
  const values = data.length > 0 ? data : [0, 0];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const y = scaleLinear([min, max], [29, 3]);
  const stepX = 100 / Math.max(1, values.length - (variant === "bar" ? 0 : 1));

  if (variant === "bar") {
    const slot = 100 / values.length;
    const barWidth = Math.max(0.5, slot - 1.2);
    return (
      <svg
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        className={cn("h-8 w-32", className)}
        {...props}
      >
        {values.map((value, i) => {
          const top = y(value);
          return (
            <rect
              key={i}
              x={i * slot + (slot - barWidth) / 2}
              y={top}
              width={barWidth}
              height={Math.max(0.5, 32 - top)}
              rx={0.8}
              fill="currentColor"
            />
          );
        })}
      </svg>
    );
  }

  const points: ChartPoint[] = values.map((value, i) => ({
    x: i * stepX,
    y: y(value),
  }));

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className={cn("h-8 w-32", className)}
      {...props}
    >
      {variant === "area" && (
        <path d={areaPath(points, 31, smooth)} fill="currentColor" fillOpacity={0.15} />
      )}
      <path
        d={linePath(points, smooth)}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
