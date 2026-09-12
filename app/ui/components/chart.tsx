"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import {
  computeYDomain,
  dataWindow,
  decimate,
  minPositiveDelta,
  nearestIndex,
  niceTicks,
  niceTimeTicks,
  scaleLinear,
  seriesPoints,
} from "../utils/chart-kit";
import {
  computePlotRect,
  drawBars,
  drawCrosshair,
  drawLineSeries,
  drawSelection,
  drawXAxisLabels,
  drawYAxisGrid,
  readThemeColor,
  type BarSeriesPaint,
  type PlotFrame,
} from "../utils/chart-paint";
import { useChartPalette } from "../utils/use-chart-palette";

export type ChartData = [number[], ...number[][]];

export interface ChartSeriesConfig {
  label: string;
  type?: "line" | "area" | "bar";
  stroke?: string;
  width?: number;
  fill?: string | boolean;
  value?: (v: number) => string;
  show?: boolean;
}

export interface ChartProps {
  data: ChartData;
  series: ChartSeriesConfig[];
  height?: number;
  time?: boolean;
  className?: ClassNameValue;
  onReady?: () => void;
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts * 1000);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

interface ResolvedSeries {
  index: number;
  config: ChartSeriesConfig;
  values: number[];
  stroke: string;
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
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const palette = useChartPalette();
  const [hidden, setHidden] = React.useState<ReadonlySet<number>>(new Set());
  const [themeTick, setThemeTick] = React.useState(0);

  const dataRef = React.useRef(data);
  const configsRef = React.useRef(configs);
  const hiddenRef = React.useRef(hidden);
  const paletteRef = React.useRef(palette);
  const onReadyRef = React.useRef(onReady);
  const viewRef = React.useRef<{ xMin: number; xMax: number } | null>(null);
  const hoverRef = React.useRef(-1);
  const dragRef = React.useRef<{ startPx: number; endPx: number } | null>(null);
  const metricsRef = React.useRef<PlotFrame | null>(null);
  const themeColorRef = React.useRef(new Map<string, string>());
  const readyRef = React.useRef(false);
  dataRef.current = data;
  configsRef.current = configs;
  hiddenRef.current = hidden;
  paletteRef.current = palette;
  onReadyRef.current = onReady;

  const hideTooltip = () => {
    const tooltip = tooltipRef.current;
    if (tooltip) tooltip.style.display = "none";
  };

  const updateTooltip = (idx: number, px: number, py: number) => {
    const tooltip = tooltipRef.current;
    const wrap = wrapRef.current;
    const xs = dataRef.current[0];
    if (!tooltip || !wrap || idx < 0 || idx >= xs.length) return;
    const xLabel = time ? formatTimestamp(xs[idx]) : String(xs[idx]);
    const rows = configsRef.current
      .map((config, i) => {
        if (config.show === false || hiddenRef.current.has(i)) return "";
        const values = dataRef.current[i + 1] ?? [];
        const raw = values[idx];
        const stroke = config.stroke ?? paletteRef.current[i % paletteRef.current.length];
        const text = raw == null ? "-" : config.value ? config.value(raw) : String(raw);
        return `<div style="display:flex;align-items:center;gap:6px;min-width:120px"><span style="width:10px;height:2px;border-radius:1px;background:${stroke}"></span><span>${config.label}</span><span style="margin-left:auto;font-weight:500">${text}</span></div>`;
      })
      .join("");
    tooltip.innerHTML = `<div style="font-weight:600;margin-bottom:4px">${xLabel}</div>${rows}`;
    tooltip.style.display = "block";
    const x = Math.min(Math.max(px + 12, 0), wrap.clientWidth - tooltip.offsetWidth);
    const y = Math.max(py - tooltip.offsetHeight - 12, 0);
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = container.clientWidth || 320;
    const dpr = window.devicePixelRatio || 1;
    const backingWidth = Math.max(1, Math.round(width * dpr));
    const backingHeight = Math.max(1, Math.round(height * dpr));
    if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
      canvas.width = backingWidth;
      canvas.height = backingHeight;
      canvas.style.height = `${height}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, width, height);

    const xs = dataRef.current[0];
    const total = xs.length;
    const hidden = hiddenRef.current;
    const paletteColors = paletteRef.current;
    const visible: ResolvedSeries[] = configsRef.current
      .map((config, index) => ({
        index,
        config,
        values: dataRef.current[index + 1] ?? [],
        stroke: config.stroke ?? paletteColors[index % paletteColors.length],
      }))
      .filter((s) => s.config.show !== false && !hidden.has(s.index));

    const view = viewRef.current;
    let xMin = 0;
    let xMax = 1;
    if (view) {
      xMin = view.xMin;
      xMax = view.xMax;
    } else if (total > 0) {
      xMin = xs[0];
      xMax = xs[total - 1];
      if (!time) {
        xMin -= 0.5;
        xMax += 0.5;
      }
    }
    if (xMax <= xMin) xMax = xMin + 1;

    const { i0, i1 } = dataWindow(xs, xMin, xMax);

    const domain = computeYDomain(
      visible.map((s) => s.values),
      i0,
      i1,
    );
    let yMin = 0;
    let yMax = 1;
    if (domain) {
      yMin = domain[0];
      yMax = domain[1];
    }
    const yTicks = niceTicks(yMin, yMax, Math.max(3, Math.round(height / 56)));
    if (yTicks.length > 0) {
      yMin = Math.min(yMin, yTicks[0]);
      yMax = Math.max(yMax, yTicks[yTicks.length - 1]);
    }

    const rect = computePlotRect(ctx, yTicks, width, height);
    const frame: PlotFrame = {
      left: rect.left,
      top: rect.top,
      plotWidth: rect.width,
      plotHeight: rect.height,
      xMin,
      xMax,
      yMin,
      yMax,
      i0,
      i1,
    };
    metricsRef.current = frame;

    const probe = (name: string, fallback: string) => {
      const key = `${themeTick}:${name}`;
      const cached = themeColorRef.current.get(key);
      if (cached) return cached;
      const value = readThemeColor(name, fallback);
      themeColorRef.current.set(key, value);
      return value;
    };
    const gridColor = probe("--color-border", "#e5e7eb");
    const textColor = probe("--color-muted-foreground", "#6b7280");

    drawYAxisGrid(ctx, frame, yTicks, textColor, gridColor);

    const xTickCount = Math.max(2, Math.min(8, Math.floor(frame.plotWidth / 90)));
    const xLabels: { value: number; text: string }[] = [];
    if (time) {
      const { ticks, format } = niceTimeTicks(xMin, xMax, xTickCount);
      for (const tick of ticks) {
        if (tick < xMin || tick > xMax) continue;
        xLabels.push({ value: tick, text: format(tick) });
      }
    } else {
      for (const tick of niceTicks(xMin, xMax, xTickCount)) {
        xLabels.push({ value: tick, text: String(tick) });
      }
    }
    drawXAxisLabels(ctx, frame, xLabels, textColor);

    ctx.save();
    ctx.beginPath();
    ctx.rect(frame.left, frame.top, frame.plotWidth, frame.plotHeight);
    ctx.clip();

    const barSpecs: BarSeriesPaint[] = [];
    for (const s of visible) {
      if (s.config.type !== "bar") continue;
      const translucent = s.config.fill === true;
      barSpecs.push({
        values: s.values,
        fill: translucent ? s.stroke : typeof s.config.fill === "string" ? s.config.fill : s.stroke,
        alpha: translucent ? 0.18 : 1,
      });
    }
    if (barSpecs.length > 0) {
      const band = total > 1 ? minPositiveDelta(xs, i0, i1) : frame.plotWidth;
      drawBars(ctx, frame, xs, barSpecs, Number.isFinite(band) ? band : 1);
    }

    const toX = scaleLinear([xMin, xMax], [frame.left, frame.left + frame.plotWidth]);
    const toY = scaleLinear([yMin, yMax], [frame.top + frame.plotHeight, frame.top]);

    for (const s of visible) {
      if (s.config.type === "bar") continue;
      const sampled = decimate(
        seriesPoints(s.values, xs, i0, i1, toX, toY),
        Math.max(3, Math.floor(frame.plotWidth)),
      );
      if (sampled.length === 0) continue;
      const translucentFill = s.config.fill === true || s.config.type === "area";
      const explicitFill = typeof s.config.fill === "string" ? s.config.fill : undefined;
      drawLineSeries(ctx, frame, sampled, {
        stroke: s.stroke,
        width: s.config.width ?? 1.5,
        fill: translucentFill || explicitFill ? explicitFill ?? s.stroke : undefined,
        fillAlpha: translucentFill ? 0.18 : 1,
      });
    }

    const hoverIdx = hoverRef.current;
    if (hoverIdx >= i0 && hoverIdx <= i1 && hoverIdx < total) {
      const crossX = toX(xs[hoverIdx]);
      const background = probe("--color-background", "#ffffff");
      const dots: { x: number; y: number; color: string }[] = [];
      for (const s of visible) {
        if (s.config.type === "bar") continue;
        const v = s.values[hoverIdx];
        if (v == null) continue;
        dots.push({ x: crossX, y: toY(v), color: s.stroke });
      }
      drawCrosshair(ctx, frame, crossX, dots, background, textColor);
    }

    const drag = dragRef.current;
    if (drag) {
      drawSelection(ctx, frame, drag.startPx, drag.endPx, probe("--color-primary", "#2563eb"));
    }

    ctx.restore();
  };

  const drawRef = React.useRef<() => void>(() => {});
  drawRef.current = draw;

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const metrics = metricsRef.current;
    if (!metrics) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const drag = dragRef.current;
    if (drag) {
      drag.endPx = Math.min(Math.max(px, metrics.left), metrics.left + metrics.plotWidth);
      drawRef.current();
      return;
    }
    const inside =
      px >= metrics.left &&
      px <= metrics.left + metrics.plotWidth &&
      py >= metrics.top &&
      py <= metrics.top + metrics.plotHeight;
    if (!inside) {
      if (hoverRef.current !== -1) {
        hoverRef.current = -1;
        hideTooltip();
        drawRef.current();
      }
      return;
    }
    const xValue =
      metrics.xMin + ((px - metrics.left) / metrics.plotWidth) * (metrics.xMax - metrics.xMin);
    const idx = Math.min(
      Math.max(nearestIndex(dataRef.current[0], xValue), metrics.i0),
      metrics.i1,
    );
    hoverRef.current = idx;
    drawRef.current();
    updateTooltip(idx, px, py);
  };

  const handlePointerLeave = () => {
    if (dragRef.current) return;
    if (hoverRef.current !== -1) {
      hoverRef.current = -1;
      hideTooltip();
      drawRef.current();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const metrics = metricsRef.current;
    if (!metrics) return;
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
    if (px < metrics.left || px > metrics.left + metrics.plotWidth) return;
    dragRef.current = { startPx: px, endPx: px };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    const metrics = metricsRef.current;
    if (metrics && Math.abs(drag.endPx - drag.startPx) > 8) {
      const toValue = (px: number) =>
        metrics.xMin + ((px - metrics.left) / metrics.plotWidth) * (metrics.xMax - metrics.xMin);
      const a = toValue(drag.startPx);
      const b = toValue(drag.endPx);
      viewRef.current = { xMin: Math.min(a, b), xMax: Math.max(a, b) };
      hoverRef.current = -1;
      hideTooltip();
    }
    drawRef.current();
  };

  const handleDoubleClick = () => {
    viewRef.current = null;
    hoverRef.current = -1;
    hideTooltip();
    drawRef.current();
  };

  React.useEffect(() => {
    const observer = new MutationObserver(() => setThemeTick((t) => t + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-brand", "data-surface"],
    });
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => drawRef.current());
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    drawRef.current();
    if (!readyRef.current) {
      readyRef.current = true;
      onReadyRef.current?.();
    }
  });

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        {configs.map((config, i) => {
          const stroke = config.stroke ?? palette[i % palette.length];
          return (
            <button
              key={`${config.label}-${i}`}
              type="button"
              onClick={() =>
                setHidden((prev) => {
                  const next = new Set(prev);
                  if (next.has(i)) next.delete(i);
                  else next.add(i);
                  return next;
                })
              }
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
        <div ref={containerRef} className="w-full">
          <canvas
            ref={canvasRef}
            className="block w-full cursor-crosshair touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
          />
        </div>
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute left-0 top-0 hidden rounded-md border bg-background px-2 py-1.5 text-xs text-foreground shadow-md"
        />
      </div>
    </div>
  );
}
