"use client";
import * as React from "react";
import { computeYDomain, dataWindow, decimate, minPositiveDelta, nearestIndex, niceTicks, niceTimeTicks, scaleLinear, seriesPoints, } from "../utils/chart-kit";
import { computePlotRect, drawAxes, drawBars, drawCrosshair, drawLineSeries, drawSelection, drawXAxisLabels, drawYAxisGrid, readThemeColor, type BarSeriesPaint, type PlotFrame, } from "../utils/chart-paint";
import { useChartPalette } from "../utils/use-chart-palette";
import { ChartLegend, type ChartLegendClassNames } from "./chart-legend";
export type ChartData = [
    number[],
    ...number[][]
];
export interface ChartSeriesConfig {
    label: string;
    type?: "line" | "area" | "bar";
    stroke?: string;
    width?: number;
    fill?: string | boolean;
    value?: (v: number) => string;
    show?: boolean;
}
export interface ChartClassNames {
    legend?: ChartLegendClassNames;
    body?: string;
    canvasWrap?: string;
    canvas?: string;
    tooltip?: string;
    tooltipHeader?: string;
    tooltipRow?: string;
    tooltipSwatch?: string;
    tooltipValue?: string;
}
export interface ChartProps {
    data: ChartData;
    series: ChartSeriesConfig[];
    height?: number;
    time?: boolean;
    zoomHint?: React.ReactNode;
    legendPlacement?: "top" | "bottom";
    label?: string;
    className?: string;
    classNames?: ChartClassNames;
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
export function Chart({ data, series: configs, height = 240, time = true, zoomHint, legendPlacement = "bottom", label, className, classNames, onReady, }: ChartProps) {
    const wrapRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const palette = useChartPalette({ probeParentRef: wrapRef });
    const [hidden, setHidden] = React.useState<ReadonlySet<number>>(new Set());
    const [themeTick, setThemeTick] = React.useState(0);
    const dataRef = React.useRef(data);
    const configsRef = React.useRef(configs);
    const hiddenRef = React.useRef(hidden);
    const paletteRef = React.useRef(palette);
    const onReadyRef = React.useRef(onReady);
    const viewRef = React.useRef<{
        xMin: number;
        xMax: number;
    } | null>(null);
    const hoverRef = React.useRef(-1);
    const dragRef = React.useRef<{
        startPx: number;
        endPx: number;
    } | null>(null);
    const metricsRef = React.useRef<PlotFrame | null>(null);
    const themeColorRef = React.useRef(new Map<string, string>());
    const readyRef = React.useRef(false);
    React.useEffect(() => {
        dataRef.current = data;
        configsRef.current = configs;
        hiddenRef.current = hidden;
        paletteRef.current = palette;
        onReadyRef.current = onReady;
    });
    const hideTooltip = () => {
        const tooltip = tooltipRef.current;
        if (tooltip)
            tooltip.style.display = "none";
    };
    const tooltipSigRef = React.useRef("");
    const tooltipSizeRef = React.useRef({ width: 0, height: 0 });
    const updateTooltip = (idx: number, px: number, py: number) => {
        const tooltip = tooltipRef.current;
        const wrap = wrapRef.current;
        const xs = dataRef.current[0];
        if (!tooltip || !wrap || idx < 0 || idx >= xs.length)
            return;
        const xLabel = time ? formatTimestamp(xs[idx]) : String(xs[idx]);
        const rows: { stroke: string; label: string; text: string }[] = [];
        configsRef.current.forEach((config, i) => {
            if (config.show === false || hiddenRef.current.has(i))
                return;
            const values = dataRef.current[i + 1] ?? [];
            const raw = values.at(idx);
            const stroke = config.stroke ?? paletteRef.current[i % paletteRef.current.length];
            const text = raw === undefined ? "-" : config.value ? config.value(raw) : String(raw);
            rows.push({ stroke, label: config.label, text });
        });
        const sig = `${themeTick}|${classNames?.tooltip ?? ""}|${classNames?.tooltipHeader ?? ""}|${classNames?.tooltipRow ?? ""}|${xLabel}|${rows.map((r) => `${r.label}:${r.text}`).join("|")}`;
        const wrapWidth = wrap.clientWidth;
        if (sig !== tooltipSigRef.current) {
            const header = document.createElement("div");
            if (classNames?.tooltipHeader)
                header.className = classNames.tooltipHeader;
            header.textContent = xLabel;
            const fragment = document.createDocumentFragment();
            for (const row of rows) {
                const el = document.createElement("div");
                if (classNames?.tooltipRow)
                    el.className = classNames.tooltipRow;
                const swatch = document.createElement("span");
                if (classNames?.tooltipSwatch)
                    swatch.className = classNames.tooltipSwatch;
                swatch.style.background = row.stroke;
                const labelSpan = document.createElement("span");
                labelSpan.textContent = row.label;
                const value = document.createElement("span");
                if (classNames?.tooltipValue)
                    value.className = classNames.tooltipValue;
                value.textContent = row.text;
                el.append(swatch, labelSpan, value);
                fragment.append(el);
            }
            tooltip.replaceChildren(header, fragment);
            tooltip.style.display = "block";
            tooltipSizeRef.current = { width: tooltip.offsetWidth, height: tooltip.offsetHeight };
            tooltipSigRef.current = sig;
        }
        if (tooltip.style.display === "none")
            tooltip.style.display = "block";
        const { width, height: tooltipHeight } = tooltipSizeRef.current;
        const x = Math.min(Math.max(px + 12, 0), wrapWidth - width);
        const y = Math.max(py - tooltipHeight - 12, 0);
        tooltip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    };
    const draw = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
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
        const hiddenSet = hiddenRef.current;
        const paletteColors = paletteRef.current;
        const visible: ResolvedSeries[] = configsRef.current
            .map((config, index) => ({
            index,
            config,
            values: dataRef.current[index + 1] ?? [],
            stroke: config.stroke ?? paletteColors[index % paletteColors.length],
        }))
            .filter((s) => s.config.show !== false && !hiddenSet.has(s.index));
        const view = viewRef.current;
        let xMin = 0;
        let xMax = 1;
        if (view) {
            xMin = view.xMin;
            xMax = view.xMax;
        }
        else if (total > 0) {
            xMin = xs[0];
            xMax = xs[total - 1];
            if (!time) {
                xMin -= 0.5;
                xMax += 0.5;
            }
        }
        if (xMax <= xMin)
            xMax = xMin + 1;
        const { i0, i1 } = dataWindow(xs, xMin, xMax);
        const domain = computeYDomain(visible.map((s) => s.values), i0, i1);
        let yMin = 0;
        let yMax = 1;
        if (domain) {
            yMin = domain[0];
            yMax = domain[1];
        }
        const yTicks = niceTicks(yMin, yMax, Math.max(3, Math.round(height / 56)));
        if (yTicks.length > 0) {
            yMin = Math.min(yMin, yTicks[0]);
            yMax = Math.max(yMax, yTicks.at(-1)!);
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
            if (cached)
                return cached;
            const value = readThemeColor(name, fallback, wrapRef.current);
            themeColorRef.current.set(key, value);
            return value;
        };
        const borderColor = probe("--border", "#e5e7eb");
        const textColor = probe("--foreground", "#6b7280");
        drawYAxisGrid(ctx, frame, yTicks, textColor, borderColor);
        const xTickCount = Math.max(2, Math.min(8, Math.floor(frame.plotWidth / 90)));
        const xLabels: {
            value: number;
            text: string;
        }[] = [];
        if (time) {
            const { ticks, format } = niceTimeTicks(xMin, xMax, xTickCount);
            for (const tick of ticks) {
                if (tick < xMin || tick > xMax)
                    continue;
                xLabels.push({ value: tick, text: format(tick) });
            }
        }
        else {
            for (const tick of niceTicks(xMin, xMax, xTickCount)) {
                xLabels.push({ value: tick, text: String(tick) });
            }
        }
        drawXAxisLabels(ctx, frame, xLabels, textColor);
        drawAxes(ctx, frame, borderColor);
        ctx.save();
        ctx.beginPath();
        ctx.rect(frame.left, frame.top, frame.plotWidth, frame.plotHeight);
        ctx.clip();
        const barSpecs: BarSeriesPaint[] = [];
        for (const s of visible) {
            if (s.config.type !== "bar")
                continue;
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
            if (s.config.type === "bar")
                continue;
            const sampled = decimate(seriesPoints(s.values, xs, i0, i1, toX, toY), Math.max(3, Math.floor(frame.plotWidth)));
            if (sampled.length === 0)
                continue;
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
            const background = probe("--background", "#ffffff");
            const dots: {
                x: number;
                y: number;
                color: string;
            }[] = [];
            for (const s of visible) {
                if (s.config.type === "bar")
                    continue;
                const v = s.values.at(hoverIdx);
                if (v === undefined)
                    continue;
                dots.push({ x: crossX, y: toY(v), color: s.stroke });
            }
            drawCrosshair(ctx, frame, crossX, dots, background, textColor);
        }
        const drag = dragRef.current;
        if (drag) {
            drawSelection(ctx, frame, drag.startPx, drag.endPx, probe("--primary", "#2563eb"));
        }
        ctx.restore();
    };
    const drawRef = React.useRef<() => void>(() => { });
    React.useEffect(() => {
        drawRef.current = draw;
    });
    const pickAt = (px: number, py: number): number => {
        const metrics = metricsRef.current;
        if (!metrics)
            return -1;
        const inside = px >= metrics.left &&
            px <= metrics.left + metrics.plotWidth &&
            py >= metrics.top &&
            py <= metrics.top + metrics.plotHeight;
        if (!inside)
            return -1;
        const xValue = metrics.xMin + ((px - metrics.left) / metrics.plotWidth) * (metrics.xMax - metrics.xMin);
        return Math.min(Math.max(nearestIndex(dataRef.current[0], xValue), metrics.i0), metrics.i1);
    };
    const moveRef = React.useRef<{ px: number; py: number } | null>(null);
    const moveFrameRef = React.useRef(0);
    const flushMove = () => {
        moveFrameRef.current = 0;
        const move = moveRef.current;
        const metrics = metricsRef.current;
        if (!move || !metrics)
            return;
        const { px, py } = move;
        const drag = dragRef.current;
        if (drag) {
            drag.endPx = Math.min(Math.max(px, metrics.left), metrics.left + metrics.plotWidth);
            drawRef.current();
            return;
        }
        const idx = pickAt(px, py);
        if (idx < 0) {
            if (hoverRef.current !== -1) {
                hoverRef.current = -1;
                hideTooltip();
                drawRef.current();
            }
            return;
        }
        hoverRef.current = idx;
        drawRef.current();
        updateTooltip(idx, px, py);
    };
    const cancelMove = React.useCallback(() => {
        if (moveFrameRef.current) {
            cancelAnimationFrame(moveFrameRef.current);
            moveFrameRef.current = 0;
        }
        moveRef.current = null;
    }, []);
    React.useEffect(() => cancelMove, [cancelMove]);
    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!metricsRef.current)
            return;
        const rect = e.currentTarget.getBoundingClientRect();
        moveRef.current = { px: e.clientX - rect.left, py: e.clientY - rect.top };
        if (!moveFrameRef.current)
            moveFrameRef.current = requestAnimationFrame(flushMove);
    };
    const handlePointerLeave = () => {
        if (dragRef.current)
            return;
        cancelMove();
        if (hoverRef.current !== -1) {
            hoverRef.current = -1;
            hideTooltip();
            drawRef.current();
        }
    };
    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (e.button !== 0)
            return;
        const metrics = metricsRef.current;
        if (!metrics)
            return;
        const rect = e.currentTarget.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        if (px < metrics.left || px > metrics.left + metrics.plotWidth)
            return;
        dragRef.current = { startPx: px, endPx: px };
        e.currentTarget.setPointerCapture(e.pointerId);
        const idx = pickAt(px, py);
        if (idx >= 0) {
            hoverRef.current = idx;
            drawRef.current();
            updateTooltip(idx, px, py);
        }
    };
    const lastTapRef = React.useRef<{ t: number; px: number; py: number } | null>(null);
    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const drag = dragRef.current;
        if (!drag)
            return;
        cancelMove();
        dragRef.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
        const rect = e.currentTarget.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const metrics = metricsRef.current;
        if (metrics && Math.abs(drag.endPx - drag.startPx) > 8) {
            const toValue = (x: number) => metrics.xMin + ((x - metrics.left) / metrics.plotWidth) * (metrics.xMax - metrics.xMin);
            const a = toValue(drag.startPx);
            const b = toValue(drag.endPx);
            viewRef.current = { xMin: Math.min(a, b), xMax: Math.max(a, b) };
            hoverRef.current = -1;
            hideTooltip();
            lastTapRef.current = null;
        }
        else {
            const now = performance.now();
            const last = lastTapRef.current;
            if (last && now - last.t < 350 && Math.abs(px - last.px) < 12 && Math.abs(py - last.py) < 12) {
                viewRef.current = null;
                hoverRef.current = -1;
                hideTooltip();
                lastTapRef.current = null;
            }
            else {
                lastTapRef.current = { t: now, px, py };
            }
        }
        drawRef.current();
    };
    const handlePointerCancel = () => {
        cancelMove();
        dragRef.current = null;
        hoverRef.current = -1;
        hideTooltip();
        lastTapRef.current = null;
        drawRef.current();
    };
    const handleDoubleClick = () => {
        cancelMove();
        viewRef.current = null;
        hoverRef.current = -1;
        hideTooltip();
        drawRef.current();
    };
    React.useEffect(() => {
        const observer = new MutationObserver(() => setThemeTick((t) => t + 1));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "style"],
        });
        return () => observer.disconnect();
    }, []);
    React.useEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
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
    const legend = (<ChartLegend classNames={classNames?.legend} items={configs.map((config, i) => ({
            label: config.label,
            color: config.stroke ?? palette[i % palette.length],
        }))} hidden={hidden} onToggle={(i) => setHidden((prev) => {
            const next = new Set(prev);
            if (next.has(i))
                next.delete(i);
            else
                next.add(i);
            return next;
        })}/>);
    const hint = zoomHint ? zoomHint : null;
    const chartLabel = label ?? (configs.map((config) => config.label).filter(Boolean).join(", ") || "Chart");
    return (<div className={className}>
      {legendPlacement === "top" && legend}
      <div ref={wrapRef} className={classNames?.body}>
        <div ref={containerRef} className={classNames?.canvasWrap}>
          <canvas ref={canvasRef} role="img" aria-label={chartLabel} className={classNames?.canvas} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={handlePointerCancel} onDoubleClick={handleDoubleClick}/>
        </div>
        <div ref={tooltipRef} className={classNames?.tooltip}/>
      </div>
      {legendPlacement === "top" ? hint : (<>
          {legend}
          {hint}
        </>)}
    </div>);
}
