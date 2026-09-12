"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { useChartPalette } from "../utils/use-chart-palette";
import { polar, polygonPoints, radarPolygon, radarRings, radarSpokes } from "../utils/chart-kit";

export interface RadarSeries {
  label: string;
  values: number[];
  color?: string;
}

export interface RadarClassNames {
  root?: ClassNameValue;
  svg?: ClassNameValue;
  grid?: ClassNameValue;
  label?: ClassNameValue;
  polygon?: ClassNameValue;
  legend?: ClassNameValue;
}

export interface RadarStyles {
  root?: React.CSSProperties;
  svg?: React.CSSProperties;
  grid?: React.CSSProperties;
  label?: React.CSSProperties;
  polygon?: React.CSSProperties;
  legend?: React.CSSProperties;
}

export interface RadarProps extends Omit<React.ComponentProps<"div">, "className"> {
  axes: string[];
  series: RadarSeries[];
  max?: number;
  levels?: number;
  showLegend?: boolean;
  ariaLabel?: string;
  className?: ClassNameValue;
  classNames?: RadarClassNames;
  styles?: RadarStyles;
}

export function Radar({
  axes,
  series,
  max,
  levels = 4,
  showLegend = true,
  ariaLabel,
  className,
  classNames,
  styles,
  ...props
}: RadarProps) {
  const palette = useChartPalette();
  const [hover, setHover] = React.useState<number | null>(null);
  const [hidden, setHidden] = React.useState<ReadonlySet<number>>(() => new Set());

  const count = Math.max(3, axes.length);
  const radius = 80;
  const colorOf = (index: number) => series[index].color ?? palette[index % palette.length];
  const ceiling =
    max ??
    Math.max(
      1,
      ...series.flatMap((s, i) => (hidden.has(i) ? [] : s.values.slice(0, count))),
    );
  const rings = radarRings(count, radius, levels);
  const spokes = radarSpokes(count, radius);
  const labelAt = (
    i: number,
  ): {
    x: number;
    y: number;
    anchor: "start" | "end" | "middle";
    baseline: "hanging" | "auto" | "middle";
  } => {
    const step = 360 / count;
    const deg = -90 + i * step;
    const p = polar(0, 0, radius + 14, deg);
    const cos = Math.cos((deg * Math.PI) / 180);
    const sin = Math.sin((deg * Math.PI) / 180);
    const anchor = cos > 0.35 ? "start" : cos < -0.35 ? "end" : "middle";
    const baseline = sin > 0.35 ? "hanging" : sin < -0.35 ? "auto" : "middle";
    return { ...p, anchor, baseline };
  };

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
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs",
            classNames?.legend,
          )}
          style={styles?.legend}
        >
          {series.map((item, i) => (
            <button
              key={`${item.label}-${i}`}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => toggle(i)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-opacity hover:text-foreground",
                hidden.has(i) && "opacity-40",
              )}
            >
              <span className="h-0.5 w-3 rounded-full" style={{ background: colorOf(i) }} />
              {item.label}
            </button>
          ))}
        </div>
      )}
      <svg
        viewBox="0 0 240 220"
        className={cn("mx-auto mt-2 w-full max-w-72 overflow-visible", classNames?.svg)}
        role={ariaLabel ? "img" : "presentation"}
        aria-label={ariaLabel}
        style={styles?.svg}
      >
        <g transform="translate(120 110)">
          <g
            className={cn("fill-none stroke-border", classNames?.grid)}
            style={styles?.grid}
          >
            {rings.map((ring, level) => (
              <polygon key={level} points={polygonPoints(ring)} strokeWidth={level === levels - 1 ? 1 : 0.5} />
            ))}
            {spokes.map((spoke, i) => (
              <line key={i} x1={0} y1={0} x2={spoke.x} y2={spoke.y} strokeWidth={0.5} />
            ))}
          </g>
          {axes.slice(0, count).map((axis, i) => {
            const label = labelAt(i);
            return (
              <text
                key={`${axis}-${i}`}
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                dominantBaseline={label.baseline}
                className={cn("fill-muted-foreground text-[10px]", classNames?.label)}
                style={styles?.label}
              >
                {axis}
              </text>
            );
          })}
          {series.map((item, i) =>
            hidden.has(i) ? null : (
              <polygon
                key={`${item.label}-${i}`}
                points={polygonPoints(radarPolygon(item.values.slice(0, count), ceiling, radius))}
                className={cn(
                  "cursor-pointer transition-opacity duration-200",
                  hover != null && hover !== i && "opacity-35",
                  classNames?.polygon,
                )}
                style={{
                  stroke: colorOf(i),
                  fill: colorOf(i),
                  fillOpacity: hover === i ? 0.28 : 0.14,
                  strokeWidth: 1.5,
                  strokeLinejoin: "round",
                  ...styles?.polygon,
                }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ),
          )}
        </g>
      </svg>
    </div>
  );
}
