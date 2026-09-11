"use client";

import * as React from "react";
import uPlot from "uplot";
import { type ClassNameValue, cn } from "../utils/cn";
import { useChartPalette } from "../utils/use-chart-palette";

export interface ChartSeriesConfig {
  label: string;
  stroke?: string;
  width?: number;
  fill?: string | boolean;
  value?: (v: number) => string;
  show?: boolean;
  paths?: uPlot.Series["paths"];
}

export interface ChartProps {
  data: uPlot.AlignedData;
  series: ChartSeriesConfig[];
  height?: number;
  time?: boolean;
  className?: ClassNameValue;
  onReady?: (u: uPlot) => void;
}

function readThemeColor(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = `var(${name}, ${fallback})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  if (!value) return fallback;
  return value.replace(/\bnone\b/g, "0");
}

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("oklch(")) return `${color.slice(0, -1)} / ${alpha})`;
  if (color.startsWith("#")) {
    return `${color}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  }
  return color;
}

export function Chart({
  data,
  series: configs,
  height = 240,
  time = true,
  className,
  onReady,
}: ChartProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const plotRef = React.useRef<uPlot | null>(null);
  const palette = useChartPalette();
  const [hidden, setHidden] = React.useState<ReadonlySet<number>>(new Set());
  const [themeTick, setThemeTick] = React.useState(0);

  React.useEffect(() => {
    const observer = new MutationObserver(() => setThemeTick((t) => t + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-brand", "data-surface"],
    });
    return () => observer.disconnect();
  }, []);

  const dataRef = React.useRef(data);
  const configsRef = React.useRef(configs);
  const hiddenRef = React.useRef(hidden);
  const onReadyRef = React.useRef(onReady);
  dataRef.current = data;
  configsRef.current = configs;
  hiddenRef.current = hidden;
  onReadyRef.current = onReady;

  const seriesKey = JSON.stringify(configs);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const gridColor = readThemeColor("--color-border", "#e5e7eb");
    const textColor = readThemeColor("--color-muted-foreground", "#6b7280");

    const opts: uPlot.Options = {
      width: container.clientWidth || 320,
      height,
      legend: { show: false },
      scales: {
        x: {
          time,
          range: time ? undefined : (self, min, max) => [min - 0.5, max + 0.5],
        },
      },
      axes: [
        { stroke: textColor, grid: { show: false }, ticks: { show: false } },
        {
          stroke: textColor,
          grid: { stroke: withAlpha(gridColor, 0.7), width: 1 },
          ticks: { show: false },
        },
      ],
      series: [
        {
          value: time
            ? (self: uPlot, ts: number) => uPlot.fmtDate("{M}/{D}")(new Date(ts * 1000))
            : undefined,
        },
        ...configsRef.current.map((config, i) => {
          const stroke = config.stroke ?? palette[i % palette.length];
          return {
            label: config.label,
            stroke,
            width: config.width ?? 1.5,
            fill:
              config.fill === true
                ? withAlpha(stroke, 0.18)
                : typeof config.fill === "string"
                  ? config.fill
                  : undefined,
            show: config.show ?? !hiddenRef.current.has(i),
            spanGaps: true,
            paths: config.paths,
            value: config.value ? (self: uPlot, raw: number) => config.value!(raw) : undefined,
          };
        }),
      ],
      hooks: {
        setCursor: [
          (u) => {
            const tooltip = tooltipRef.current;
            if (!tooltip) return;
            const { left, top, idx } = u.cursor;
            if (idx == null || left == null || left < 0) {
              tooltip.style.display = "none";
              return;
            }
            const xRaw = u.data[0][idx];
            const xLabel =
              typeof u.series[0].value === "function"
                ? u.series[0].value(u, xRaw, 0, idx)
                : String(xRaw);
            const rows = configsRef.current
              .map((config, i) => {
                const s = u.series[i + 1];
                if (!s.show) return "";
                const raw = u.data[i + 1]?.[idx];
                const text =
                  raw == null
                    ? "-"
                    : config.value
                      ? config.value(raw)
                      : typeof s.value === "function"
                        ? s.value(u, raw, i + 1, idx)
                        : String(raw);
                return `<div style="display:flex;align-items:center;gap:6px;min-width:120px"><span style="width:10px;height:2px;border-radius:1px;background:${s.stroke}"></span><span>${config.label}</span><span style="margin-left:auto;font-weight:500">${text}</span></div>`;
              })
              .join("");
            tooltip.innerHTML = `<div style="font-weight:600;margin-bottom:4px">${xLabel}</div>${rows}`;
            tooltip.style.display = "block";
            const wrap = wrapRef.current;
            if (wrap) {
              const x = Math.min(Math.max(left + 12, 0), wrap.clientWidth - tooltip.offsetWidth);
              const y = Math.max((top ?? 0) - tooltip.offsetHeight - 12, 0);
              tooltip.style.left = `${x}px`;
              tooltip.style.top = `${y}px`;
            }
          },
        ],
      },
    };

    const plot = new uPlot(opts, dataRef.current, container);
    plotRef.current = plot;
    const resetZoom = () => {
      const xs = plot.data[0];
      plot.setScale("x", { min: xs[0], max: xs[xs.length - 1] });
      plot.setScale("y", { min: null, max: null } as unknown as { min: number; max: number });
    };
    container.addEventListener("dblclick", resetZoom);
    onReadyRef.current?.(plot);

    const observer = new ResizeObserver(() => {
      plot.setSize({ width: container.clientWidth, height });
    });
    observer.observe(container);
    return () => {
      container.removeEventListener("dblclick", resetZoom);
      observer.disconnect();
      plot.destroy();
      plotRef.current = null;
    };
  }, [palette, seriesKey, height, time, themeTick]);

  React.useEffect(() => {
    if (plotRef.current) plotRef.current.setData(data);
  }, [data]);

  const toggleSeries = (index: number) => {
    const next = new Set(hidden);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setHidden(next);
    plotRef.current?.setSeries(index + 1, { show: !next.has(index) });
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        {configs.map((config, i) => {
          const stroke = config.stroke ?? palette[i % palette.length];
          return (
            <button
              key={`${config.label}-${i}`}
              type="button"
              onClick={() => toggleSeries(i)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-opacity hover:text-foreground",
                hidden.has(i) && "opacity-40",
              )}
            >
              <span className="h-0.5 w-3 rounded-full" style={{ background: stroke }} />
              {config.label}
            </button>
          );
        })}
      </div>
      <div ref={wrapRef} className="relative mt-2">
        <div ref={containerRef} className="w-full" />
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute left-0 top-0 hidden rounded-md border bg-background px-2 py-1.5 text-xs text-foreground shadow-md"
        />
      </div>
    </div>
  );
}