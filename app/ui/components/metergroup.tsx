"use client";
import * as React from "react";
import { useChartPalette } from "../utils/use-chart-palette";

export interface MeterGroupItem {
    label: string;
    value: number;
    color?: string;
}

export function MeterTrack({ children, ...props }: React.ComponentProps<"div">) {
    return (<div {...props} data-track="" aria-hidden>{children}</div>);
}

export interface MeterSegmentProps extends React.ComponentProps<"div"> {
    percent: number;
    color?: string;
    tip?: string;
}

export function MeterSegment({ percent, color, tip, style, ...props }: MeterSegmentProps) {
    return (<div {...props} data-item="" data-tip={tip} style={{ width: `${percent}%`, backgroundColor: color, ...style }}/>);
}

export interface MeterLegendEntry {
    label: string;
    percent: number;
    color?: string;
}

export interface MeterLegendClassNames {
    item?: string;
    swatch?: string;
    label?: string;
    percent?: string;
}

export interface MeterLegendProps extends Omit<React.ComponentProps<"div">, "children"> {
    items: MeterLegendEntry[];
    classNames?: MeterLegendClassNames;
}

export function MeterLegend({ items, classNames, ...props }: MeterLegendProps) {
    return (<div {...props} data-legend="" aria-hidden>
      {items.map((item) => (<div key={item.label} data-legend-item="" className={classNames?.item}>
          <span data-swatch="" className={classNames?.swatch} style={{ backgroundColor: item.color }}/>
          <span data-label="" className={classNames?.label}>{item.label}</span>
          <span data-percent="" className={classNames?.percent}>{Math.round(item.percent)}%</span>
        </div>))}
    </div>);
}

export interface MeterGroupClassNames {
    track?: string;
    segment?: string;
    legend?: string;
    legendItem?: string;
    swatch?: string;
    label?: string;
    percent?: string;
}

export interface MeterGroupProps extends Omit<React.ComponentProps<"div">, "role"> {
    value: MeterGroupItem[];
    min?: number;
    max?: number;
    classNames?: MeterGroupClassNames;
}

const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num));

export function MeterGroup({ value: items, min = 0, max: rawMax, classNames, style, ...props }: MeterGroupProps) {
    const palette = useChartPalette({ count: Math.max(1, items.length) });
    const total = items.reduce((acc, item) => acc + Math.max(min, item.value), 0);
    const max = rawMax ?? total;
    const span = max - min;
    const now = clamp(total, min, max);
    const percent = (item: MeterGroupItem) => span > 0 ? clamp(((clamp(item.value, min, max) - min) / span) * 100, 0, 100) : 0;
    const segments = items
        .map((item, index) => ({ item, index, pct: percent(item) }))
        .filter(({ item }) => item.value > min);
    const valueText = items.map((item) => `${item.label} ${Math.round(percent(item))}%`).join(", ");
    return (<div {...props} role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={now} aria-valuetext={props["aria-valuetext"] ?? valueText} data-orientation="horizontal" style={style}>
      <MeterTrack className={classNames?.track}>
        {segments.map(({ item, index, pct }) => (<MeterSegment key={item.label} percent={pct} color={item.color ?? palette[index % palette.length]} tip={`${item.label} · ${Math.round(pct)}%`} className={classNames?.segment}/>))}
      </MeterTrack>
      <MeterLegend
        items={items.map((item, index) => ({ label: item.label, percent: percent(item), color: item.color ?? palette[index % palette.length] }))}
        classNames={{ item: classNames?.legendItem, swatch: classNames?.swatch, label: classNames?.label, percent: classNames?.percent }}
      />
    </div>);
}
