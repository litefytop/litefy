"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { useChartPalette } from "../utils/use-chart-palette";
import { arcPath, donutLayout } from "../utils/chart-kit";
import { ChartLegend } from "../utils/chart-legend";

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface DonutClassNames {
  root?: ClassNameValue;
  svg?: ClassNameValue;
  segment?: ClassNameValue;
  legend?: ClassNameValue;
}

export interface DonutStyles {
  root?: React.CSSProperties;
  svg?: React.CSSProperties;
  segment?: React.CSSProperties;
  legend?: React.CSSProperties;
}

export interface DonutProps extends Omit<React.ComponentProps<"div">, "className"> {
  data: DonutDatum[];
  variant?: "pie" | "donut";
  gap?: number;
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  ariaLabel?: string;
  className?: ClassNameValue;
  classNames?: DonutClassNames;
  styles?: DonutStyles;
}

export function Donut({
  data,
  variant = "donut",
  gap = 2,
  valueFormatter,
  showLegend = true,
  ariaLabel,
  className,
  classNames,
  styles,
  ...props
}: DonutProps) {
  const palette = useChartPalette();
  const [hover, setHover] = React.useState<number | null>(null);
  const [hidden, setHidden] = React.useState<ReadonlySet<number>>(() => new Set());

  const format = valueFormatter ?? ((value: number) => value.toLocaleString());
  const colorOf = (index: number) => data[index].color ?? palette[index % palette.length];
  const visible = data.map((d, i) => (hidden.has(i) ? 0 : d.value));
  const total = visible.reduce((sum, v) => sum + v, 0);
  const segments = donutLayout(visible, -90, gap);
  const focus = hover != null && !hidden.has(hover) ? hover : null;
  const innerRadius = variant === "pie" ? 0 : 62;

  const toggle = (index: number) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div
      className={cn("w-full", className)}
      style={styles?.root}
      {...props}
    >
      {showLegend && (
        <ChartLegend
          swatch="square"
          className={cn("justify-center", classNames?.legend)}
          style={styles?.legend}
          items={data.map((datum, i) => ({ label: datum.label, color: colorOf(i) }))}
          hidden={hidden}
          onHover={setHover}
          onToggle={toggle}
        />
      )}
      <div className={cn("relative mx-auto mt-2 w-full max-w-64", classNames?.svg)}>
        <svg
          viewBox="0 0 200 200"
          className="size-full overflow-visible"
          role={ariaLabel ? "img" : "presentation"}
          aria-label={ariaLabel}
        >
          {segments.map((segment, i) =>
            hidden.has(i) || segment.end <= segment.start ? null : (
              <path
                key={`${data[i].label}-${i}`}
                d={arcPath(100, 100, innerRadius, 96, segment.start, segment.end)}
                fill={colorOf(i)}
                className={cn(
                  "cursor-pointer transition-opacity duration-200",
                  focus != null && focus !== i && "opacity-35",
                  classNames?.segment,
                )}
                style={styles?.segment}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ),
          )}
        </svg>
        {variant === "donut" && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {focus != null ? (
              <>
                <span className="max-w-20 truncate text-xs text-muted-foreground">
                  {data[focus].label}
                </span>
                <span className="text-xl font-semibold text-foreground">
                  {format(data[focus].value)}
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold text-foreground">{format(total)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
