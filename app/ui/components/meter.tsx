import type * as React from "react";
export interface MeterProps extends Omit<React.ComponentProps<"div">, "role"> {
    value: number;
    min?: number;
    max?: number;
    low?: number;
    high?: number;
    optimum?: number;
    hideValue?: boolean;
    classNames?: {
        track?: string;
        fill?: string;
        value?: string;
    };
}
type MeterZone = "success" | "warning" | "danger";
const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num));
const resolveZone = (value: number, min: number, max: number, low: number, high: number, optimum: number): MeterZone => {
    const lo = clamp(low, min, max);
    const hi = Math.max(lo, clamp(high, min, max));
    const opt = clamp(optimum, min, max);
    if (opt < lo) {
        if (value < lo)
            return "success";
        if (value > hi)
            return "danger";
        return "warning";
    }
    if (opt > hi) {
        if (value > hi)
            return "success";
        if (value < lo)
            return "danger";
        return "warning";
    }
    return value >= lo && value <= hi ? "success" : "warning";
};
export function Meter({ value: rawValue, min = 0, max = 100, low = 20, high = 60, optimum = 80, hideValue, classNames, style, ...props }: MeterProps) {
    const value = clamp(rawValue, min, max);
    const span = max - min;
    const percent = span > 0 ? clamp(((value - min) / span) * 100, 0, 100) : 0;
    const zone = resolveZone(value, min, max, low, high, optimum);
    return (<div {...props} role="meter" data-zone={zone} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} style={style}>
      <div className={classNames?.track}>
        <div aria-hidden className={classNames?.fill} style={{ width: percent + "%" }}/>
      </div>
      {!hideValue && <span aria-hidden className={classNames?.value}>{value}</span>}
    </div>);
}
