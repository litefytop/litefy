"use client";
import * as React from "react";
import { useChartPalette } from "../utils/use-chart-palette";
import { polar, polygonPoints, radarPolygon, radarRings, radarSpokes } from "../utils/chart-kit";
import { ChartLegend, type ChartLegendClassNames } from "./chart-legend";
export interface RadarSeries {
    label: string;
    values: number[];
    color?: string;
}
export interface RadarClassNames {
    root?: string;
    svg?: string;
    grid?: string;
    ring?: string;
    spoke?: string;
    label?: string;
    polygon?: string;
    legend?: ChartLegendClassNames;
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
    className?: string;
    classNames?: RadarClassNames;
    styles?: RadarStyles;
}
export function Radar({ axes, series, max, levels = 4, showLegend = true, ariaLabel, className, classNames, styles, ...props }: RadarProps) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const palette = useChartPalette({ probeParentRef: rootRef });
    const [hover, setHover] = React.useState<number | null>(null);
    const [hidden, setHidden] = React.useState<ReadonlySet<number>>(() => new Set());
    const count = Math.max(3, axes.length);
    const radius = 80;
    const colorOf = (index: number) => series[index].color ?? palette[index % palette.length];
    const ceiling = max ??
        Math.max(1, ...series.flatMap((s, i) => (hidden.has(i) ? [] : s.values.slice(0, count))));
    const rings = radarRings(count, radius, levels);
    const spokes = radarSpokes(count, radius);
    const labelAt = (i: number): {
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
            if (next.has(index))
                next.delete(index);
            else
                next.add(index);
            return next;
        });
    };
    return (<div ref={rootRef} className={[classNames?.root, className].filter(Boolean).join(" ") || undefined} style={styles?.root} {...props}>
      {showLegend && (<ChartLegend classNames={classNames?.legend} style={styles?.legend} items={series.map((item, i) => ({ label: item.label, color: colorOf(i) }))} hidden={hidden} onHover={setHover} onToggle={toggle}/>)}
      <svg viewBox="0 0 240 220" className={classNames?.svg} role={ariaLabel ? "img" : "presentation"} aria-label={ariaLabel} style={styles?.svg}>
        <g transform="translate(120 110)">
          <g className={classNames?.grid} style={styles?.grid}>
            {rings.map((ring, level) => (<polygon key={polygonPoints(ring)} points={polygonPoints(ring)} data-outer={level === levels - 1 || undefined} className={classNames?.ring}/>))}
            {spokes.map((spoke) => (<line key={`${spoke.x},${spoke.y}`} x1={0} y1={0} x2={spoke.x} y2={spoke.y} className={classNames?.spoke}/>))}
          </g>
          {axes.slice(0, count).map((axis, i) => {
            const label = labelAt(i);
            return (<text key={axis} x={label.x} y={label.y} textAnchor={label.anchor} dominantBaseline={label.baseline} className={classNames?.label} style={styles?.label}>
                {axis}
              </text>);
        })}
          {series.map((item, i) => hidden.has(i) ? null : (<polygon key={item.label} points={polygonPoints(radarPolygon(item.values.slice(0, count), ceiling, radius))} stroke={colorOf(i)} fill={colorOf(i)} data-dimmed={hover !== null && hover !== i || undefined} data-hovered={hover === i || undefined} className={classNames?.polygon} style={styles?.polygon} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}/>))}
        </g>
      </svg>
    </div>);
}
