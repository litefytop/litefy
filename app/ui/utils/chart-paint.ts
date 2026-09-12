import { areaPath, linePath, scaleLinear, type ChartPoint } from "./chart-kit";

export const AXIS_FONT = "11px ui-sans-serif, system-ui, sans-serif";

export interface PlotFrame {
  left: number;
  top: number;
  plotWidth: number;
  plotHeight: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  i0: number;
  i1: number;
}

export function readThemeColor(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = `var(${name}, ${fallback})`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  if (!value) return fallback;
  return value.replace(/\bnone\b/g, "0");
}

export function fillWith(ctx: CanvasRenderingContext2D, color: string, alpha: number) {
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
}

export function strokeWith(ctx: CanvasRenderingContext2D, color: string, alpha: number) {
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
}

export function resetAlpha(ctx: CanvasRenderingContext2D) {
  ctx.globalAlpha = 1;
}

export function computePlotRect(
  ctx: CanvasRenderingContext2D,
  yTicks: number[],
  width: number,
  height: number,
): { left: number; top: number; width: number; height: number } {
  ctx.font = AXIS_FONT;
  let labelWidth = 0;
  for (const tick of yTicks) {
    labelWidth = Math.max(labelWidth, ctx.measureText(String(tick)).width);
  }
  const left = Math.max(34, Math.ceil(labelWidth) + 14);
  const right = 12;
  const top = 10;
  const bottom = 26;
  return {
    left,
    top,
    width: Math.max(10, width - left - right),
    height: Math.max(10, height - top - bottom),
  };
}

export function drawYAxisGrid(
  ctx: CanvasRenderingContext2D,
  frame: PlotFrame,
  ticks: number[],
  textColor: string,
  gridColor: string,
) {
  const toY = scaleLinear([frame.yMin, frame.yMax], [frame.top + frame.plotHeight, frame.top]);
  ctx.font = AXIS_FONT;
  ctx.textBaseline = "middle";
  ctx.textAlign = "right";
  ctx.fillStyle = textColor;
  strokeWith(ctx, gridColor, 0.7);
  ctx.lineWidth = 1;
  for (const tick of ticks) {
    const y = Math.round(toY(tick)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(frame.left, y);
    ctx.lineTo(frame.left + frame.plotWidth, y);
    ctx.stroke();
    ctx.fillText(String(tick), frame.left - 8, y);
  }
  resetAlpha(ctx);
}

export function drawXAxisLabels(
  ctx: CanvasRenderingContext2D,
  frame: PlotFrame,
  labels: { value: number; text: string }[],
  textColor: string,
) {
  const toX = scaleLinear([frame.xMin, frame.xMax], [frame.left, frame.left + frame.plotWidth]);
  ctx.font = AXIS_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = textColor;
  for (const { value, text } of labels) {
    ctx.fillText(text, toX(value), frame.top + frame.plotHeight + 6);
  }
}

export interface BarSeriesPaint {
  values: number[];
  fill: string;
  alpha: number;
}

export function drawBars(
  ctx: CanvasRenderingContext2D,
  frame: PlotFrame,
  xs: number[],
  series: BarSeriesPaint[],
  bandDelta: number,
) {
  const toX = scaleLinear([frame.xMin, frame.xMax], [frame.left, frame.left + frame.plotWidth]);
  const toY = scaleLinear([frame.yMin, frame.yMax], [frame.top + frame.plotHeight, frame.top]);
  const groupWidth = Math.max(2, bandDelta * (frame.plotWidth / (frame.xMax - frame.xMin)) * 0.7);
  const barWidth = groupWidth / series.length;
  series.forEach((s, slot) => {
    const offset = (slot - (series.length - 1) / 2) * barWidth;
    fillWith(ctx, s.fill, s.alpha);
    for (let i = frame.i0; i <= frame.i1; i++) {
      const v = s.values[i];
      if (v == null) continue;
      const centerX = toX(xs[i]) + offset;
      const yTop = toY(Math.max(v, 0));
      const yBottom = toY(Math.min(v, 0));
      ctx.fillRect(centerX - barWidth / 2, yTop, barWidth, yBottom - yTop);
    }
  });
  resetAlpha(ctx);
}

export interface LineSeriesPaint {
  stroke: string;
  width: number;
  fill?: string;
  fillAlpha?: number;
}

export function drawLineSeries(
  ctx: CanvasRenderingContext2D,
  frame: PlotFrame,
  points: ChartPoint[],
  series: LineSeriesPaint,
) {
  if (points.length === 0) return;
  const baseline = frame.top + frame.plotHeight;
  if (series.fill) {
    fillWith(ctx, series.fill, series.fillAlpha ?? 1);
    ctx.fill(new Path2D(areaPath(points, baseline)));
    resetAlpha(ctx);
  }
  ctx.strokeStyle = series.stroke;
  ctx.lineWidth = series.width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke(new Path2D(linePath(points)));
}

export function drawCrosshair(
  ctx: CanvasRenderingContext2D,
  frame: PlotFrame,
  x: number,
  dots: { x: number; y: number; color: string }[],
  background: string,
  textColor: string,
) {
  strokeWith(ctx, textColor, 0.4);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, frame.top);
  ctx.lineTo(x, frame.top + frame.plotHeight);
  ctx.stroke();
  resetAlpha(ctx);
  for (const dot of dots) {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = background;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = dot.color;
    ctx.fill();
  }
}

export function drawSelection(
  ctx: CanvasRenderingContext2D,
  frame: PlotFrame,
  startPx: number,
  endPx: number,
  accent: string,
) {
  const start = Math.min(startPx, endPx);
  const end = Math.max(startPx, endPx);
  if (end - start <= 2) return;
  fillWith(ctx, accent, 0.08);
  ctx.fillRect(start, frame.top, end - start, frame.plotHeight);
  strokeWith(ctx, accent, 0.5);
  ctx.lineWidth = 1;
  for (const edge of [start, end]) {
    const x = Math.round(edge) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, frame.top);
    ctx.lineTo(x, frame.top + frame.plotHeight);
    ctx.stroke();
  }
  resetAlpha(ctx);
}
