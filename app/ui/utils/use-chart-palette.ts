"use client";

import { useEffect, useState } from "react";

type Oklch = { l: number; c: number; h: number };

const PRIMARY_VAR = "--color-primary";
const BACKGROUND_VAR = "--color-background";
const COLOR_COUNT = 8;
const HUE_STEP = 360 / COLOR_COUNT;
const MIN_CONTRAST = 3;
const ACHROMATIC_HUE = 250;
const DEFAULT_PRIMARY = "#000";
const DEFAULT_BACKGROUND = "#fff";

export type ChartPaletteMode = "wheel" | "mono";

export interface ChartPaletteOptions {
  mode?: ChartPaletteMode;
}

const BLACK: Oklch = { l: 0, c: 0, h: 0 };
const WHITE: Oklch = { l: 1, c: 0, h: 0 };

function srgbToOklch(r: number, g: number, b: number): Oklch {
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  const R = lin(r);
  const G = lin(g);
  const B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.sqrt(A * A + Bb * Bb);
  let h = (Math.atan2(Bb, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

function oklchToSrgb({ l, c, h }: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ * l_ * l_;
  const M = m_ * m_ * m_;
  const S = s_ * s_ * s_;
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

function inGamut(rgb: [number, number, number]): boolean {
  return rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
}

function relativeLuminance(rgb: [number, number, number]): number {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return 0.2126 * clamp(rgb[0]) + 0.7152 * clamp(rgb[1]) + 0.0722 * clamp(rgb[2]);
}

function contrast(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(oklchToSrgb(a));
  const lb = relativeLuminance(oklchToSrgb(b));
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

function clampChroma(color: Oklch): Oklch {
  if (inGamut(oklchToSrgb(color))) return color;
  let low = 0;
  let high = color.c;
  for (let i = 0; i < 16; i++) {
    const mid = (low + high) / 2;
    if (inGamut(oklchToSrgb({ ...color, c: mid }))) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return { ...color, c: low };
}

function parseOklch(value: string): Oklch | null {
  const match = value.match(
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?)?\s*\)$/,
  );
  if (!match) return null;
  const l = match[1].endsWith("%") ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
  return { l, c: parseFloat(match[2]), h: parseFloat(match[3]) };
}

function parseRgbComponent(raw: string): number {
  const v = raw.trim();
  if (v.endsWith("%")) return parseFloat(v) / 100;
  return parseFloat(v) / 255;
}

function parseRgb(value: string): Oklch | null {
  const match = value.match(/^rgba?\(([^)]+)\)$/);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  return srgbToOklch(
    parseRgbComponent(parts[0]),
    parseRgbComponent(parts[1]),
    parseRgbComponent(parts[2]),
  );
}

function parseSrgbColor(value: string): Oklch | null {
  const match = value.match(/^color\(srgb\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)\s*\)/);
  if (!match) return null;
  const parse = (raw: string) => (raw.endsWith("%") ? parseFloat(raw) / 100 : parseFloat(raw));
  return srgbToOklch(parse(match[1]), parse(match[2]), parse(match[3]));
}

function parseColor(value: string): Oklch | null {
  return parseOklch(value) ?? parseRgb(value) ?? parseSrgbColor(value);
}

function readVarColor(name: string, fallback: string): Oklch {
  if (typeof document === "undefined") return fallback === DEFAULT_PRIMARY ? BLACK : WHITE;
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = `var(${name}, ${fallback})`;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  return (
    parseColor(computed.replace(/\bnone\b/g, "0")) ?? (fallback === DEFAULT_PRIMARY ? BLACK : WHITE)
  );
}

function buildPalette(primary: Oklch, background: Oklch, mode: ChartPaletteMode): string[] {
  const hueBase = primary.c > 1e-4 ? primary.h : ACHROMATIC_HUE;
  const chroma = Math.min(Math.max(primary.c, 0.14), 0.28);
  const baseL = primary.c > 1e-4 ? Math.min(Math.max(primary.l, 0.4), 0.7) : 0.55;
  const lightnessCandidates = [baseL, baseL - 0.15, baseL + 0.15, 0.25, 0.85, 0.15, 0.95];

  if (mode === "mono") {
    const passing = lightnessCandidates.filter(
      (l) => contrast({ l, c: chroma, h: hueBase }, background) >= MIN_CONTRAST,
    );
    const usable = passing.length > 0 ? passing : lightnessCandidates;
    const colors: string[] = [];
    for (const chromaScale of [1, 0.5]) {
      for (const l of usable) {
        if (colors.length >= COLOR_COUNT) break;
        const candidate = clampChroma({ l, c: chroma * chromaScale, h: hueBase });
        colors.push(
          `oklch(${candidate.l.toFixed(3)} ${candidate.c.toFixed(3)} ${hueBase.toFixed(1)})`,
        );
      }
    }
    return colors;
  }

  const colors: string[] = [];
  for (let i = 0; i < COLOR_COUNT; i++) {
    const h = (hueBase + i * HUE_STEP) % 360;
    const candidates = lightnessCandidates.map((l) => ({ l, c: chroma, h }));
    const candidate =
      candidates.find((candidate) => contrast(candidate, background) >= MIN_CONTRAST) ??
      candidates.reduce((best, candidate) =>
        contrast(candidate, background) > contrast(best, background) ? candidate : best,
      );
    const { l, c } = clampChroma(candidate);
    colors.push(`oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`);
  }
  return colors;
}

function computePalette(mode: ChartPaletteMode): string[] {
  const primary = readVarColor(PRIMARY_VAR, DEFAULT_PRIMARY);
  const background = readVarColor(BACKGROUND_VAR, DEFAULT_BACKGROUND);
  return buildPalette(primary, background, mode);
}

function sameColors(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((color, i) => color === b[i]);
}

export function useChartPalette(options?: ChartPaletteOptions): string[] {
  const mode = options?.mode ?? "wheel";
  const [palette, setPalette] = useState<string[]>(() => computePalette(mode));

  useEffect(() => {
    const next = computePalette(mode);
    setPalette((prev) => (sameColors(prev, next) ? prev : next));

    const observer = new MutationObserver(() => {
      const next = computePalette(mode);
      setPalette((prev) => (sameColors(prev, next) ? prev : next));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-brand", "data-surface"],
    });
    return () => observer.disconnect();
  }, [mode]);

  return palette;
}
