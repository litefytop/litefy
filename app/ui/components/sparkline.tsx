"use client";
import * as React from "react";
import { areaPath, linePath, scaleLinear } from "../utils/chart-kit";
import { type ChartPoint } from "../utils/chart-kit";
export type SparklineVariant = "line" | "area" | "bar";
export interface SparklineProps extends Omit<React.ComponentProps<"svg">, "className"> {
    data: number[];
    variant?: SparklineVariant;
    smooth?: boolean;
    className?: string;
    classNames?: {
        bar?: string;
        area?: string;
        line?: string;
    };
}
export function Sparkline({ data, variant = "line", smooth = false, className, classNames, ...props }: SparklineProps) {
    const geometry = React.useMemo(() => {
        const values = data.length > 0 ? data : [0, 0];
        const [min, max] = values.reduce<[number, number]>(([lo, hi], value) => [value < lo ? value : lo, value > hi ? value : hi], [Infinity, -Infinity]);
        const y = scaleLinear([min, max], [29, 3]);
        if (variant === "bar") {
            const slot = 100 / values.length;
            const barWidth = Math.max(0.5, slot * 0.7);
            return {
                kind: "bar" as const,
                bars: values.map((value, i) => {
                    const top = y(value);
                    return { x: i * slot + (slot - barWidth) / 2, y: top, width: barWidth, height: Math.max(0.5, 32 - top) };
                }),
            };
        }
        const stepX = 100 / Math.max(1, values.length - 1);
        const points: ChartPoint[] = values.map((value, i) => ({ x: i * stepX, y: y(value) }));
        return {
            kind: "path" as const,
            line: linePath(points, smooth),
            area: variant === "area" ? areaPath(points, 31, smooth) : null,
        };
    }, [data, variant, smooth]);
    return (<svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className} {...props}>
      {geometry.kind === "bar"
            ? geometry.bars.map((bar) => (<rect key={bar.x} x={bar.x} y={bar.y} width={bar.width} height={bar.height} className={classNames?.bar}/>))
            : (<>
          {geometry.area !== null && (<path d={geometry.area} className={classNames?.area}/>)}
          <path d={geometry.line} className={classNames?.line} vectorEffect="non-scaling-stroke"/>
        </>)}
    </svg>);
}
