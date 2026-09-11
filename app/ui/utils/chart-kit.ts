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
