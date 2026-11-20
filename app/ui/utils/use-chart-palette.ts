"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
type Oklch = {
    l: number;
    c: number;
    h: number;
};
const PRIMARY_VAR = "--primary";
const COLOR_COUNT = 8;
const ACHROMATIC_HUE = 250;
const GOLDEN_ANGLE = 137.508;
const TAILWIND_LIGHT = [
    "oklch(70.4% 0.191 22.216)",
    "oklch(79.2% 0.209 151.711)",
    "oklch(70.7% 0.165 254.624)",
    "oklch(75% 0.183 55.934)",
    "oklch(78.9% 0.154 211.53)",
    "oklch(70.2% 0.183 293.541)",
    "oklch(82.8% 0.189 84.429)",
    "oklch(71.8% 0.202 349.761)",
];
const TAILWIND_DARK = [
    "oklch(80.8% 0.114 19.571)",
    "oklch(87.1% 0.15 154.449)",
    "oklch(80.9% 0.105 251.813)",
    "oklch(83.7% 0.128 66.29)",
    "oklch(86.5% 0.127 207.078)",
    "oklch(81.1% 0.111 293.571)",
    "oklch(87.9% 0.169 91.605)",
    "oklch(82.3% 0.12 346.018)",
];
export type ChartPaletteMode = "fixed" | "mono";
export interface ChartPaletteOptions {
    mode?: ChartPaletteMode;
    count?: number;
    probeParentRef?: RefObject<HTMLElement | null>;
}
const BLACK: Oklch = { l: 0, c: 0, h: 0 };
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
    if (h < 0)
        h += 360;
    return { l: L, c, h };
}
function oklchToSrgb({ l, c, h }: Oklch): [
    number,
    number,
    number
] {
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
function inGamut(rgb: [
    number,
    number,
    number
]): boolean {
    return rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
}
function clampChroma(color: Oklch): Oklch {
    if (inGamut(oklchToSrgb(color)))
        return color;
    let low = 0;
    let high = color.c;
    for (let i = 0; i < 16; i++) {
        const mid = (low + high) / 2;
        if (inGamut(oklchToSrgb({ ...color, c: mid }))) {
            low = mid;
        }
        else {
            high = mid;
        }
    }
    return { ...color, c: low };
}
function toOklch(color: Oklch): string {
    return `oklch(${color.l.toFixed(3)} ${color.c.toFixed(3)} ${color.h.toFixed(1)})`;
}
function parseOklch(value: string): Oklch | null {
    const match = value.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?)?\s*\)$/u);
    if (!match)
        return null;
    const l = match[1].endsWith("%") ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
    return { l, c: parseFloat(match[2]), h: parseFloat(match[3]) };
}
function parseRgbComponent(raw: string): number {
    const v = raw.trim();
    if (v.endsWith("%"))
        return parseFloat(v) / 100;
    return parseFloat(v) / 255;
}
function parseRgb(value: string): Oklch | null {
    const match = value.match(/^rgba?\(([^)]+)\)$/u);
    if (!match)
        return null;
    const parts = match[1].split(/[\s,/]+/u).filter(Boolean);
    if (parts.length < 3)
        return null;
    return srgbToOklch(parseRgbComponent(parts[0]), parseRgbComponent(parts[1]), parseRgbComponent(parts[2]));
}
function parseSrgbColor(value: string): Oklch | null {
    const match = value.match(/^color\(srgb\s+([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+%?)\s*\)/u);
    if (!match)
        return null;
    const parse = (raw: string) => (raw.endsWith("%") ? parseFloat(raw) / 100 : parseFloat(raw));
    return srgbToOklch(parse(match[1]), parse(match[2]), parse(match[3]));
}
function parseHex(value: string): Oklch | null {
    const match = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/iu);
    if (!match)
        return null;
    const raw = match[1];
    const full = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
    return srgbToOklch(parseInt(full.slice(0, 2), 16) / 255, parseInt(full.slice(2, 4), 16) / 255, parseInt(full.slice(4, 6), 16) / 255);
}
function parseColor(value: string): Oklch | null {
    return parseOklch(value) ?? parseRgb(value) ?? parseSrgbColor(value) ?? parseHex(value);
}
function readVarColor(name: string, parent?: HTMLElement | null): Oklch {
    if (typeof document === "undefined")
        return BLACK;
    const probe = document.createElement("span");
    probe.style.display = "none";
    probe.style.color = `var(${name}, #000)`;
    (parent ?? document.body).append(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();
    return parseColor(computed.replaceAll(/\bnone\b/gu, "0")) ?? BLACK;
}
function buildPalette(primary: Oklch, mode: ChartPaletteMode, count: number, isDark: boolean): string[] {
    if (mode === "mono") {
        const hueBase = primary.c > 1e-4 ? primary.h : ACHROMATIC_HUE;
        const chroma = Math.min(Math.max(primary.c, 0.14), 0.28);
        const baseL = primary.c > 1e-4 ? Math.min(Math.max(primary.l, 0.4), 0.7) : 0.55;
        const lightnessCandidates = [baseL, baseL - 0.15, baseL + 0.15, 0.25, 0.85, 0.15, 0.95];
        const c0 = primary.c > 1e-4 ? chroma : 0;
        const colors: string[] = [];
        for (const chromaScale of [1, 0.5]) {
            for (const l of lightnessCandidates) {
                if (colors.length >= count)
                    break;
                colors.push(toOklch(clampChroma({ l, c: c0 * chromaScale, h: hueBase })));
            }
        }
        return colors;
    }
    const colors = (isDark ? TAILWIND_DARK : TAILWIND_LIGHT).slice(0, count);
    const hueBase = primary.c > 1e-4 ? primary.h : ACHROMATIC_HUE;
    const chroma = Math.min(Math.max(primary.c, 0.14), isDark ? 0.22 : 0.28);
    const lMid = isDark ? 0.72 : 0.52;
    const lAlt = 0.09;
    for (let i = colors.length; i < count; i++) {
        const h = (hueBase + (i - colors.length) * GOLDEN_ANGLE) % 360;
        const l = Math.min(0.85, Math.max(0.3, lMid + ((i - colors.length) % 2 === 0 ? -lAlt : lAlt)));
        colors.push(toOklch(clampChroma({ l, c: chroma, h })));
    }
    return colors;
}
function readIsDark(): boolean {
    if (typeof document === "undefined")
        return false;
    return document.documentElement.classList.contains("dark");
}
function computePalette(mode: ChartPaletteMode, count: number, parent?: HTMLElement | null): string[] {
    const primary = readVarColor(PRIMARY_VAR, parent);
    return buildPalette(primary, mode, count, readIsDark());
}
function sameColors(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((color, i) => color === b[i]);
}
function readPaletteMode(parent?: HTMLElement | null): ChartPaletteMode {
    if (!parent || typeof getComputedStyle !== "function")
        return "fixed";
    return getComputedStyle(parent).getPropertyValue("--chart-palette-mode").trim() === "mono" ? "mono" : "fixed";
}
export function useChartPalette(options?: ChartPaletteOptions): string[] {
    const mode = options?.mode;
    const count = Math.max(1, options?.count ?? COLOR_COUNT);
    const probeParentRef = options?.probeParentRef;
    const [palette, setPalette] = useState<string[]>(() => buildPalette(BLACK, mode ?? "fixed", count, false));
    useEffect(() => {
        const resolved = mode ?? readPaletteMode(probeParentRef?.current ?? null);
        const next = computePalette(resolved, count, probeParentRef?.current ?? null);
        setPalette((prev) => (sameColors(prev, next) ? prev : next));
        const observer = new MutationObserver(() => {
            const recomputed = computePalette(resolved, count, probeParentRef?.current ?? null);
            setPalette((prev) => (sameColors(prev, recomputed) ? prev : recomputed));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "style"],
        });
        return () => observer.disconnect();
    }, [mode, count, probeParentRef]);
    return palette;
}
function buildSameFamilyShades(count: number, primary: Oklch, dark: boolean): string[] {
    const hue = primary.c > 1e-4 ? primary.h : ACHROMATIC_HUE;
    const chroma = Math.min(Math.max(primary.c, 0.12), 0.24);
    const paleL = dark ? 0.62 : 0.72;
    const strongL = dark ? 0.78 : 0.55;
    const paleC = chroma * 0.55;
    const strongC = dark ? chroma * 0.9 : chroma;
    const shades: string[] = [];
    for (let i = 0; i < count; i++) {
        const t = count === 1 ? 1 : i / (count - 1);
        const l = paleL + (strongL - paleL) * t;
        const c = paleC + (strongC - paleC) * t;
        shades.push(toOklch(clampChroma({ l, c, h: hue })));
    }
    return shades;
}
export function useSameFamilyShades(count: number): string[] {
    const [shades, setShades] = useState<string[]>(() => buildSameFamilyShades(count, BLACK, false));
    const shadesRef = useRef(shades);
    useEffect(() => {
        shadesRef.current = shades;
    });
    useEffect(() => {
        const resolve = () => buildSameFamilyShades(count, readVarColor(PRIMARY_VAR), readIsDark());
        const next = resolve();
        if (!sameColors(shadesRef.current, next)) {
            shadesRef.current = next;
            setShades(next);
        }
        const observer = new MutationObserver(() => {
            const recomputed = resolve();
            setShades((prev) => (sameColors(prev, recomputed) ? prev : recomputed));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "style"],
        });
        return () => observer.disconnect();
    }, [count]);
    return shades;
}
