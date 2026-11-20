"use client";
import * as React from "react";
import { useChartPalette } from "../utils/use-chart-palette";
export interface MeterGroupItem {
    label: string;
    value: number;
    color?: string;
}
export interface MeterGroupProps extends Omit<React.ComponentProps<"div">, "role"> {
    value: MeterGroupItem[];
    min?: number;
    max?: number;
}
const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num));
export function MeterGroup({ value: items, min = 0, max: rawMax, style, ...props }: MeterGroupProps) {
    const palette = useChartPalette({ count: Math.max(1, items.length) });
    const total = items.reduce((acc, item) => acc + Math.max(min, item.value), 0);
    const max = rawMax ?? total;
    const span = max - min;
    const now = clamp(total, min, max);
    const percent = (item: MeterGroupItem) => span > 0 ? clamp(((clamp(item.value, min, max) - min) / span) * 100, 0, 100) : 0;
    const segments = items
        .map((item, index) => ({ item, index, percent: percent(item) }))
        .filter(({ item }) => item.value > min);
    const valueText = items.map((item) => `${item.label} ${Math.round(percent(item))}%`).join(", ");
    return (<div {...props} role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={now} aria-valuetext={props["aria-valuetext"] ?? valueText} style={style}>
      <div data-track aria-hidden>
        {segments.map(({ item, index, percent: pct }) => (<div key={item.label} data-item data-tip={`${item.label} · ${Math.round(pct)}%`} style={{ width: pct + "%", backgroundColor: item.color ?? palette[index % palette.length] }}/>))}
      </div>
      <div data-legend aria-hidden>
        {items.map((item, index) => (<div key={item.label} data-legend-item>
            <span data-swatch style={{ backgroundColor: item.color ?? palette[index % palette.length] }}/>
            <span data-label>{item.label}</span>
            <span data-percent>{Math.round(percent(item))}%</span>
          </div>))}
      </div>
    </div>);
}
