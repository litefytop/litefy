export interface ChartPoint {
  x: number;
  y: number;
}

export interface DonutSegment {
  index: number;
  start: number;
  end: number;
  mid: number;
  ratio: number;
}

const round = (v: number) => Number(v.toFixed(4));

export function polar(cx: number, cy: number, r: number, deg: number): ChartPoint {
  const rad = (deg * Math.PI) / 180;
  return { x: round(cx + r * Math.cos(rad)), y: round(cy + r * Math.sin(rad)) };
}

export function arcPath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
): string {
  const sweep = a1 - a0;
  if (sweep <= 0) return "";
  if (sweep >= 360) {
    const oTop = polar(cx, cy, r1, -90);
    const oBottom = polar(cx, cy, r1, 90);
    const parts = [
      `M${oTop.x} ${oTop.y}`,
      `A${r1} ${r1} 0 1 1 ${oBottom.x} ${oBottom.y}`,
      `A${r1} ${r1} 0 1 1 ${oTop.x} ${oTop.y}`,
    ];
    if (r0 > 0) {
      const iBottom = polar(cx, cy, r0, 90);
      const iTop = polar(cx, cy, r0, -90);
      parts.push(`L${iBottom.x} ${iBottom.y}`, `A${r0} ${r0} 0 1 0 ${iTop.x} ${iTop.y}`);
    }
    return `${parts.join(" ")}Z`;
  }
  const large = sweep > 180 ? 1 : 0;
  const p0 = polar(cx, cy, r1, a0);
  const p1 = polar(cx, cy, r1, a1);
  if (r0 <= 0) {
    return `M${cx} ${cy} L${p0.x} ${p0.y} A${r1} ${r1} 0 ${large} 1 ${p1.x} ${p1.y} Z`;
  }
  const q1 = polar(cx, cy, r0, a1);
  const q0 = polar(cx, cy, r0, a0);
  return `M${p0.x} ${p0.y} A${r1} ${r1} 0 ${large} 1 ${p1.x} ${p1.y} L${q1.x} ${q1.y} A${r0} ${r0} 0 ${large} 0 ${q0.x} ${q0.y} Z`;
}

export function donutLayout(
  values: number[],
  startAngle = -90,
  gap = 0,
): DonutSegment[] {
  const total = values.reduce((sum, v) => sum + Math.max(0, v), 0);
  let cursor = startAngle;
  return values.map((value, index) => {
    const ratio = total > 0 ? Math.max(0, value) / total : 0;
    const sweep = ratio * 360;
    const pad = sweep > gap * 2 ? gap : sweep / 4;
    const start = cursor + pad;
    const end = cursor + sweep - pad;
    const segment: DonutSegment = {
      index,
      start: round(start),
      end: round(Math.max(start, end)),
      mid: round(cursor + sweep / 2),
      ratio,
    };
    cursor += sweep;
    return segment;
  });
}

export function scaleLinear(
  domain: [number, number],
  range: [number, number],
): (value: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  if (span === 0) return () => (r0 + r1) / 2;
  return (value) => r0 + ((value - d0) / span) * (r1 - r0);
}

export function polygonPoints(points: ChartPoint[]): string {
  return points.map((p) => `${round(p.x)},${round(p.y)}`).join(" ");
}

export function radarRings(count: number, radius: number, levels: number): ChartPoint[][] {
  const start = -90;
  const step = 360 / count;
  return Array.from({ length: levels }, (_, level) => {
    const r = (radius * (level + 1)) / levels;
    return Array.from({ length: count }, (_, i) => polar(0, 0, r, start + i * step));
  });
}

export function radarSpokes(count: number, radius: number): ChartPoint[] {
  const start = -90;
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => polar(0, 0, radius, start + i * step));
}

export function radarPolygon(
  values: number[],
  max: number,
  radius: number,
): ChartPoint[] {
  const start = -90;
  const step = 360 / Math.max(1, values.length);
  const safeMax = max > 0 ? max : 1;
  return values.map((value, i) => {
    const r = radius * Math.min(Math.max(value / safeMax, 0), 1);
    return polar(0, 0, r, start + i * step);
  });
}

function monotoneControlPoints(points: ChartPoint[]): number[] {
  const n = points.length;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1].x - points[i].x);
    slope.push(dx[i] === 0 ? 0 : (points[i + 1].y - points[i].y) / dx[i]);
  }
  const tangent: number[] = [slope[0] ?? 0];
  for (let i = 1; i < n - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      tangent.push(0);
    } else {
      const w0 = 2 * dx[i] + dx[i - 1];
      const w1 = dx[i] + 2 * dx[i - 1];
      tangent.push((w0 + w1) / (w0 / slope[i - 1] + w1 / slope[i]));
    }
  }
  tangent.push(slope[n - 2] ?? 0);
  return tangent;
}

export function linePath(points: ChartPoint[], smooth = false): string {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M${round(points[0].x)} ${round(points[0].y)}`;
  const coords = points.map((p) => [round(p.x), round(p.y)] as const);
  if (!smooth) {
    return (
      `M${coords[0][0]} ${coords[0][1]}` +
      coords
        .slice(1)
        .map(([x, y]) => `L${x} ${y}`)
        .join("")
    );
  }
  const tangent = monotoneControlPoints(points);
  let d = `M${coords[0][0]} ${coords[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const step = (points[i + 1].x - points[i].x) / 3;
    const x1 = round(points[i].x + step);
    const y1 = round(points[i].y + tangent[i] * step);
    const x2 = round(points[i + 1].x - step);
    const y2 = round(points[i + 1].y - tangent[i + 1] * step);
    d += `C${x1} ${y1} ${x2} ${y2} ${coords[i + 1][0]} ${coords[i + 1][1]}`;
  }
  return d;
}

export function areaPath(points: ChartPoint[], baseline: number, smooth = false): string {
  if (points.length === 0) return "";
  const line = linePath(points, smooth);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line}L${round(last.x)} ${round(baseline)}L${round(first.x)} ${round(baseline)}Z`;
}

export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
    const base = Number.isFinite(min) ? min : 0;
    return [base - 1, base, base + 1];
  }
  const rawStep = (max - min) / Math.max(1, count);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;
  const step = (residual >= 5 ? 10 : residual >= 2 ? 5 : residual >= 1 ? 2 : 1) * magnitude;
  const start = Math.ceil(min / step) * step;
  const total = Math.floor((max - start) / step + 1e-9);
  const ticks: number[] = [];
  for (let i = 0; i <= total; i++) {
    const value = Number((start + i * step).toFixed(10));
    ticks.push(Object.is(value, -0) ? 0 : value);
  }
  return ticks;
}

export interface TimeTicks {
  ticks: number[];
  format: (value: number) => string;
}

const pad2 = (value: number) => String(value).padStart(2, "0");
const formatClock = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
const formatClockSec = (d: Date) => `${formatClock(d)}:${pad2(d.getSeconds())}`;
const formatDay = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
const formatMonth = (d: Date) => `${d.getFullYear()}/${d.getMonth() + 1}`;

const SUB_DAY_STEPS = [
  1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 10800, 21600, 43200,
];
const DAY = 86400;

function subDayTicks(min: number, max: number, step: number): TimeTicks {
  const stepMs = step * 1000;
  const start = Math.floor(min * 1000 / stepMs) * stepMs;
  const ticks: number[] = [];
  for (let ms = start; ms / 1000 <= max; ms += stepMs) {
    ticks.push(ms / 1000);
  }
  return {
    ticks,
    format: (value) => {
      const d = new Date(value * 1000);
      if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) return formatDay(d);
      return step < 60 ? formatClockSec(d) : formatClock(d);
    },
  };
}

function dayTicks(min: number, max: number, stepDays: number): TimeTicks {
  const first = new Date(min * 1000);
  first.setHours(0, 0, 0, 0);
  const epochDay = Math.round(first.getTime() / (DAY * 1000));
  const startDay = Math.floor(epochDay / stepDays) * stepDays;
  const ticks: number[] = [];
  for (let day = startDay; day * DAY <= max; day += stepDays) {
    if (day * DAY >= min - DAY) ticks.push(day * DAY);
  }
  return { ticks, format: (value) => formatDay(new Date(value * 1000)) };
}

function monthTicks(min: number, max: number, stepMonths: number): TimeTicks {
  const first = new Date(min * 1000);
  const totalMonths = first.getFullYear() * 12 + first.getMonth();
  const aligned = totalMonths - (((totalMonths % stepMonths) + stepMonths) % stepMonths);
  const ticks: number[] = [];
  const cursor = new Date(first.getFullYear(), aligned - first.getFullYear() * 12, 1, 0, 0, 0, 0);
  while (cursor.getTime() / 1000 <= max) {
    ticks.push(cursor.getTime() / 1000);
    cursor.setMonth(cursor.getMonth() + stepMonths);
  }
  return { ticks, format: (value) => formatMonth(new Date(value * 1000)) };
}

function yearTicks(min: number, max: number, stepYears: number): TimeTicks {
  const first = new Date(min * 1000);
  const start = Math.floor(first.getFullYear() / stepYears) * stepYears;
  const ticks: number[] = [];
  for (let year = start; new Date(year, 0, 1).getTime() / 1000 <= max; year += stepYears) {
    ticks.push(new Date(year, 0, 1).getTime() / 1000);
  }
  return { ticks, format: (value) => String(new Date(value * 1000).getFullYear()) };
}

export function niceTimeTicks(min: number, max: number, count = 6): TimeTicks {
  const span = max - min;
  if (!(span > 0) || !Number.isFinite(span)) {
    const base = Number.isFinite(min) ? min : 0;
    return { ticks: [base], format: (value) => formatDay(new Date(value * 1000)) };
  }
  const target = span / Math.max(1, count);
  if (target < DAY) {
    const step = SUB_DAY_STEPS.find((s) => s >= target) ?? DAY;
    return subDayTicks(min, max, step);
  }
  const targetDays = target / DAY;
  if (targetDays < 28) {
    const step = [1, 2, 7, 14].find((s) => s >= targetDays) ?? 28;
    return dayTicks(min, max, step);
  }
  const targetMonths = targetDays / 30.4375;
  if (targetMonths < 12) {
    const step = [1, 2, 3, 6].find((s) => s >= targetMonths) ?? 12;
    return monthTicks(min, max, step);
  }
  const targetYears = targetMonths / 12;
  const step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find((s) => s >= targetYears) ?? 1000;
  return yearTicks(min, max, step);
}

export function lttb(points: ChartPoint[], targetCount: number): ChartPoint[] {
  const n = points.length;
  if (targetCount >= n || targetCount < 3) return points;
  const every = (n - 2) / (targetCount - 2);
  const sampled: ChartPoint[] = [points[0]];
  let a = 0;
  for (let i = 0; i < targetCount - 2; i++) {
    const avgStart = Math.floor((i + 1) * every) + 1;
    const avgEnd = Math.min(Math.floor((i + 2) * every) + 1, n);
    const avgLength = Math.max(1, avgEnd - avgStart);
    let avgX = 0;
    let avgY = 0;
    for (let j = avgStart; j < avgEnd; j++) {
      avgX += points[j].x;
      avgY += points[j].y;
    }
    avgX /= avgLength;
    avgY /= avgLength;
    const rangeStart = Math.floor(i * every) + 1;
    const rangeEnd = Math.min(Math.floor((i + 1) * every) + 1, n);
    const anchor = points[a];
    let maxArea = -1;
    let nextA = rangeStart;
    for (let j = rangeStart; j < rangeEnd; j++) {
      const area = Math.abs(
        (anchor.x - avgX) * (points[j].y - anchor.y) - (anchor.x - points[j].x) * (avgY - anchor.y),
      );
      if (area > maxArea) {
        maxArea = area;
        nextA = j;
      }
    }
    sampled.push(points[nextA]);
    a = nextA;
  }
  sampled.push(points[n - 1]);
  return sampled;
}

export const LTTB_THRESHOLD = 2000;

export function decimate(points: ChartPoint[], targetCount: number): ChartPoint[] {
  return points.length > LTTB_THRESHOLD ? lttb(points, Math.max(3, targetCount)) : points;
}

function lowerBound(xs: number[], target: number): number {
  let lo = 0;
  let hi = xs.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export function nearestIndex(xs: number[], target: number): number {
  if (xs.length === 0) return -1;
  let lo = 0;
  let hi = xs.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (lo === 0) return 0;
  if (lo === xs.length) return xs.length - 1;
  return Math.abs(xs[lo - 1] - target) <= Math.abs(xs[lo] - target) ? lo - 1 : lo;
}

export function dataWindow(
  xs: number[],
  xMin: number,
  xMax: number,
): { i0: number; i1: number } {
  if (xs.length === 0) return { i0: 0, i1: 0 };
  return {
    i0: Math.max(0, lowerBound(xs, xMin) - 1),
    i1: Math.min(xs.length - 1, lowerBound(xs, xMax)),
  };
}

export function computeYDomain(
  series: number[][],
  i0: number,
  i1: number,
): [number, number] | null {
  let min = Infinity;
  let max = -Infinity;
  for (const values of series) {
    for (let i = i0; i <= i1; i++) {
      const v = values[i];
      if (v == null) continue;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (min === max) return [min - 1, max + 1];
  return [min, max];
}

export function seriesPoints(
  values: number[],
  xs: number[],
  i0: number,
  i1: number,
  toX: (value: number) => number,
  toY: (value: number) => number,
): ChartPoint[] {
  const points: ChartPoint[] = [];
  const start = Math.max(0, i0 - 1);
  const end = Math.min(xs.length - 1, i1 + 1);
  for (let i = start; i <= end; i++) {
    const v = values[i];
    if (v == null) continue;
    points.push({ x: toX(xs[i]), y: toY(v) });
  }
  return points;
}

export function minPositiveDelta(xs: number[], i0: number, i1: number): number {
  let delta = Infinity;
  for (let i = Math.max(1, i0); i <= i1; i++) {
    const d = xs[i] - xs[i - 1];
    if (d > 0 && d < delta) delta = d;
  }
  return delta;
}
