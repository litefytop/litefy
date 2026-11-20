"use client";
import * as React from "react";
import { useChartPalette } from "../utils/use-chart-palette";
import { arcPath, donutLayout } from "../utils/chart-kit";
import { ChartLegend, type ChartLegendClassNames } from "./chart-legend";
export interface DonutDatum {
    label: string;
    value: number;
    color?: string;
}
export interface DonutClassNames {
    root?: string;
    svg?: string;
    svgInner?: string;
    segment?: string;
    center?: string;
    centerLabel?: string;
    centerValue?: string;
    legend?: ChartLegendClassNames;
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
    className?: string;
    classNames?: DonutClassNames;
    styles?: DonutStyles;
}
export function Donut({ data, variant = "donut", gap = 2, valueFormatter, showLegend = true, ariaLabel, className, classNames, styles, ...props }: DonutProps) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const palette = useChartPalette({ count: Math.max(1, data.length), probeParentRef: rootRef });
    const [hover, setHover] = React.useState<number | null>(null);
    const [hidden, setHidden] = React.useState<ReadonlySet<number>>(() => new Set());
    const format = valueFormatter ?? ((value: number) => value.toLocaleString());
    const colorOf = (index: number) => data[index].color ?? palette[index % palette.length];
    const visible = data.map((d, i) => (hidden.has(i) ? 0 : d.value));
    const total = visible.reduce((sum, v) => sum + v, 0);
    const segments = donutLayout(visible, -90, gap);
    const focus = hover !== null && !hidden.has(hover) ? hover : null;
    const innerRadius = variant === "pie" ? 0 : 62;
    const readout = focus !== null ? (<>
        <span className={classNames?.centerLabel}>{data[focus].label}</span>
        <span className={classNames?.centerValue}>{format(data[focus].value)}</span>
      </>) : (<span className={classNames?.centerValue}>{format(total)}</span>);
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
      {showLegend && (<ChartLegend swatch="square" classNames={classNames?.legend} style={styles?.legend} items={data.map((datum, i) => ({ label: datum.label, color: colorOf(i) }))} hidden={hidden} onHover={setHover} onToggle={toggle}/>)}
      <div className={classNames?.svg}>
        <svg viewBox="0 0 200 200" className={classNames?.svgInner} role={ariaLabel ? "img" : "presentation"} aria-label={ariaLabel}>
          {segments.map((segment, i) => {
            const label = data[i].label;
            if (hidden.has(i) || segment.end <= segment.start) return null;
            return (<path key={label} d={arcPath(100, 100, innerRadius, 96, segment.start, segment.end)} fill={colorOf(i)} data-dimmed={focus !== null && focus !== i || undefined} className={classNames?.segment} style={styles?.segment} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}/>);
          })}
        </svg>
        {variant === "donut" && (<div data-variant="donut" className={classNames?.center}>
            {readout}
          </div>)}
        {variant === "pie" && (<div data-variant="pie" className={classNames?.center}>
            {readout}
          </div>)}
      </div>
    </div>);
}
