import io

# meter skeleton: revert to token lane
p = 'app/ui/components/meter.tsx'
s = '''import type * as React from "react";
export interface MeterProps extends Omit<React.ComponentProps<"div">, "role"> {
    value: number;
    min?: number;
    max?: number;
    low?: number;
    high?: number;
    optimum?: number;
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
export function Meter({ value: rawValue, min = 0, max = 100, low = 20, high = 60, optimum = 80, style, ...props }: MeterProps) {
    const value = clamp(rawValue, min, max);
    const span = max - min;
    const percent = span > 0 ? clamp(((value - min) / span) * 100, 0, 100) : 0;
    const zone = resolveZone(value, min, max, low, high, optimum);
    return (<div {...props} role="meter" data-zone={zone} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} style={style}>
      <div aria-hidden style={{ width: percent + "%" }}/>
    </div>);
}
'''
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# meter skin: arc lane (背景色档)
p = 'app/ui/skins/meter.tsx'
s = '''import { Meter as MeterHeadless } from "@/ui";
import type { MeterProps } from "@/ui";
import { cn } from "../utils/cn";

const rootClasses =
  "block h-2 w-full rounded-pill overflow-hidden bg-(--gauge-track) " +
  "[--litefy-arc:var(--success)] " +
  "data-[zone=success]:[--litefy-arc:var(--success)] " +
  "data-[zone=warning]:[--litefy-arc:var(--warning)] " +
  "data-[zone=danger]:[--litefy-arc:var(--danger)] " +
  "[&>div]:h-full [&>div]:rounded-pill [&>div]:bg-(--litefy-arc) [&>div]:transition-[width] [&>div]:duration-md [&>div]:ease-out";

export function Meter({ className, ...props }: MeterProps) {
  return <MeterHeadless {...props} className={cn(rootClasses, className)} />;
}
'''
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# progress skeleton: revert to token lane
p = 'app/ui/components/progress.tsx'
s = '''import type * as React from "react";
export interface ProgressProps extends Omit<React.ComponentProps<"div">, "role"> {
    current: number;
    isAbort?: boolean;
    isComplete?: boolean;
    paused?: boolean;
    classNames?: {
        fill?: string;
    };
}
const valueStyle = (value: number): React.CSSProperties => ({
    ["--litefy-percent" as string]: value,
});
export function Progress({ current, isAbort, isComplete, paused, classNames, style, ...props }: ProgressProps) {
    const value = isComplete ? 100 : Math.min(100, Math.max(0, current));
    return (<div {...props} data-abort={isAbort || undefined} data-complete={isComplete || undefined} data-paused={paused || undefined} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} style={{ ...style, ...valueStyle(value) }}>
      <div className={classNames?.fill} style={{ width: `${value}%` }}/>
    </div>);
}
'''
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# progress skin: arc lane with 背景色档 states
p = 'app/ui/skins/progress.tsx'
s = '''import { Progress as ProgressHeadless } from "@/ui";
import type { ProgressProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";


const rootClasses =
  "group h-2 overflow-hidden rounded-pill bg-(--gauge-track) " +
  "[--litefy-arc:var(--primary)] " +
  "data-[abort=true]:[--litefy-arc:var(--danger)] " +
  "data-[complete=true]:[--litefy-arc:var(--success)] " +
  "data-[paused=true]:[--litefy-arc:var(--warning)] " +
  "data-[variant=meter]:h-3 data-[variant=meter]:border-frame data-[variant=meter]:border-border";


const fillClasses =
  "h-full rounded-pill bg-(--litefy-arc) " +
  "transition-[width] duration-md ease-out";

export function Progress({ className, classNames, ...props }: ProgressProps) {
  return (
    <ProgressHeadless
      {...props}
      className={cn(rootClasses, className)}
      classNames={mergeSlots({ fill: fillClasses }, classNames)}
    />
  );
}
'''
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# callout skin: revert to bg-* tokens
p = 'app/ui/skins/callout.tsx'
s = io.open(p, encoding='utf-8').read()
old = '''const tone = {
  info: { box: "text-info-fg border-s-frame border-s-info-fg", mark: "text-info-fg" },
  success: { box: "text-success-fg border-s-frame border-s-success-fg", mark: "text-success-fg" },
  warning: { box: "text-warning-fg border-s-frame border-s-warning-fg", mark: "text-warning-fg" },
  danger: { box: "text-danger-fg border-s-frame border-s-danger-fg", mark: "text-danger-fg" },
};'''
new = '''const tone = {
  info: { box: "bg-info text-info-fg border-s-frame border-s-info-fg", mark: "text-info-fg" },
  success: { box: "bg-success text-success-fg border-s-frame border-s-success-fg", mark: "text-success-fg" },
  warning: { box: "bg-warning text-warning-fg border-s-frame border-s-warning-fg", mark: "text-warning-fg" },
  danger: { box: "bg-danger text-danger-fg border-s-frame border-s-danger-fg", mark: "text-danger-fg" },
};'''
assert old in s, "callout tone"
s = s.replace(old, new, 1)
old = '''  const tones = tone[key];
  const colors = useMeterColors();
  return (
    <div {...props} role={role} data-variant={variant} className={cn(boxClasses, tones.box, className)} style={{ ...props.style, backgroundColor: colors[key] }}>'''
new = '''  const tones = tone[key];
  return (
    <div {...props} role={role} data-variant={variant} className={cn(boxClasses, tones.box, className)}>'''
assert old in s, "callout render"
s = s.replace(old, new, 1)
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# toast component: strip inline color revert
p = 'app/ui/components/toast.tsx'
s = io.open(p, encoding='utf-8').read()
old = 'import { bandZone } from "../utils/band-zone";\nimport { useMeterColors } from "../utils/use-chart-palette";'
new = 'import { bandZone } from "../utils/band-zone";'
assert old in s, "toast imports"
s = s.replace(old, new, 1)
old = '''    const colors = useMeterColors();
    const zone = bandZone(progress, 60, 20);
'''
new = '''    const zone = bandZone(progress, 60, 20);
'''
assert old in s, "toast hook"
s = s.replace(old, new, 1)
old = 'style={{ transform: "translateX(" + (progress - 100) + "%)", backgroundColor: colors[zone], ...styles?.progressBar }}'
new = 'style={{ transform: "translateX(" + (progress - 100) + "%)", ...styles?.progressBar }}'
assert old in s, "toast strip style"
s = s.replace(old, new, 1)
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# toast skin: zone bg-* classes return (背景色档)
p = 'app/ui/skins/toast.tsx'
s = io.open(p, encoding='utf-8').read()
old = '''const progressBarClasses =
  "block size-full rounded-pill transition-[transform,background-color] duration-sm ease-frame";'''
new = '''const progressBarClasses =
  "block size-full rounded-pill bg-primary transition-[transform,background-color] duration-sm ease-frame " +
  "data-[zone=success]:bg-success data-[zone=warning]:bg-warning data-[zone=danger]:bg-danger";'''
assert old in s, "toast skin bar"
s = s.replace(old, new, 1)
io.open(p, 'w', encoding='utf-8', newline='').write(s)

# chart skin: canvas wrap → gauge-track
p = 'app/ui/skins/chart.tsx'
s = io.open(p, encoding='utf-8').read()
old = 'const canvasWrapClasses = "w-full bg-surface";'
assert old in s, "chart wrap"
s = s.replace(old, 'const canvasWrapClasses = "w-full bg-(--gauge-track)";', 1)
io.open(p, 'w', encoding='utf-8', newline='').write(s)
print("components + skins reverted to token lanes")
