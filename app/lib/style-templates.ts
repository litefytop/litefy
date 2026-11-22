import { i18n, siteDefaultLanguage } from "./i18n";

export const LANGUAGES: string[] = [...i18n.languages];

export interface PaletteOption {
  name: string;
  label: string;
  /* Swatch identity colour — a fixed representative, because the runtime ramp
     values are color-mix derivatives that flip with the mode and must not be
     sampled as "the hue". Brand names take their Tailwind scale stop (500).
     Surface families are near-neutral greys, so their swatch keeps the family's
     own ramp hue and chroma lifted to 500 lightness — no vivid stops. `default`
     stays undefined and previews the scheme's own var. */
  swatch?: string;
}

export interface PaletteConfig {
  storageKey: string;
  attr: string;
  label: { zh: string; en: string };
  /* The colour variable a swatch paints, read on the swatch itself. A `bg-primary`
     utility would be fixed at the root value, because the scheme maps colours in
     `@theme`; the per-swatch ramp only retargets the bare variables. */
  dotVar: string;
  options: PaletteOption[];
}

export interface StyleTemplate {
  slug: string;
  name: { zh: string; en: string };
  desc: { zh: string; en: string };
  tags: { zh: [string, string]; en: [string, string] };
  pathPrefix: string;
  palettes: PaletteConfig[];
}

const BRAND_OPTIONS: PaletteOption[] = [
  { name: "default", label: "Default" },
  { name: "amber", label: "Amber", swatch: "oklch(76.9% 0.188 70.08)" },
  { name: "cyan", label: "Cyan", swatch: "oklch(71.5% 0.143 215.221)" },
  { name: "emerald", label: "Emerald", swatch: "oklch(69.6% 0.17 162.48)" },
  { name: "fuchsia", label: "Fuchsia", swatch: "oklch(66.7% 0.295 322.15)" },
  { name: "indigo", label: "Indigo", swatch: "oklch(58.5% 0.233 277.117)" },
  { name: "lime", label: "Lime", swatch: "oklch(76.8% 0.233 130.85)" },
  { name: "orange", label: "Orange", swatch: "oklch(70.5% 0.213 47.604)" },
  { name: "pink", label: "Pink", swatch: "oklch(65.6% 0.241 354.308)" },
  { name: "purple", label: "Purple", swatch: "oklch(62.7% 0.265 303.9)" },
  { name: "rose", label: "Rose", swatch: "oklch(64.5% 0.246 16.439)" },
  { name: "sky", label: "Sky", swatch: "oklch(68.5% 0.169 237.323)" },
  { name: "teal", label: "Teal", swatch: "oklch(70.4% 0.14 182.503)" },
  { name: "violet", label: "Violet", swatch: "oklch(60.6% 0.25 292.717)" },
];

const SURFACE_OPTIONS: PaletteOption[] = [
  { name: "default", label: "Default" },
  { name: "gray", label: "Gray", swatch: "oklch(55.1% 0.027 264.364)" },
  { name: "mauve", label: "Mauve", swatch: "oklch(55% 0.02 325.68)" },
  { name: "mist", label: "Mist", swatch: "oklch(55% 0.015 219.6)" },
  { name: "olive", label: "Olive", swatch: "oklch(55% 0.02 106.6)" },
  { name: "slate", label: "Slate", swatch: "oklch(55.4% 0.046 257.417)" },
  { name: "stone", label: "Stone", swatch: "oklch(55.3% 0.013 58.071)" },
  { name: "taupe", label: "Taupe", swatch: "oklch(55% 0.015 39.5)" },
  { name: "zinc", label: "Zinc", swatch: "oklch(55.2% 0.016 285.938)" },
];

export const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    slug: "minimal",
    name: { zh: "柔和极简", en: "Soft Minimal" },
    desc: {
      zh: "柔和极简：极简的骨架叠安静的软表面——软边界、静默阴影与同色井式输入区，层级靠留白与光。无障碍整体按 WCAG 2.2 AA，关键场景做到 AAA。",
      en: "Soft minimal: a minimal skeleton over a quiet soft surface — hairline boundaries, silent shadows, and same-tone sunken wells. WCAG 2.2 AA throughout, AAA where it counts.",
    },
    tags: { zh: ["多色方案", "通用后台"], en: ["Multi-color", "Admin"] },
    pathPrefix: "",
    palettes: [
      {
        storageKey: "brand-storage",
        attr: "data-brand",
        label: { zh: "品牌色档", en: "Brand color" },
        dotVar: "--primary",
        options: BRAND_OPTIONS,
      },
      {
        storageKey: "surface-storage",
        attr: "data-surface",
        label: { zh: "表面色板", en: "Surface palette" },
        dotVar: "--surface",
        options: SURFACE_OPTIONS,
      },
    ],
  },
  {
    slug: "neo-brutalist",
    name: { zh: "新野兽派", en: "Neo-brutalist" },
    desc: {
      zh: "纯白画布、纯黑 4px 粗描边、硬边位移阴影、零圆角：粉作 CTA，酸性绿扛 Hero，青与橙分管信息与标签，亮黄作悬停洪泛。固定色方案——悬停硬切、按下压平。",
      en: "White canvas, 4px black strokes, hard offset shadows, zero radius: hot pink drives the CTA, acid green carries the hero, cyan and orange cover info and tags, bright yellow floods on hover. A fixed-palette scheme — hover snaps, press crushes.",
    },
    tags: { zh: ["固定色方案", "创意站点"], en: ["Fixed palette", "Creative"] },
    pathPrefix: "/neo",
    palettes: [],
  },
  {
    slug: "neon-gradient",
    name: { zh: "霓虹渐变", en: "Neon Gradient" },
    desc: {
      zh: "双档渐变方案：浅色档浅紫画布配粉彩表面与 700 深度动作渐变，深色档深蓝画布配青粉色流按钮、紫粉渐变表面、yellow-400 对比黄边框与家族配色霓虹光晕。",
      en: "A two-tier gradient scheme: pale purple canvas with pastel surfaces and jewel-depth action gradients by day; deep blue canvas with cyan→pink flowing buttons, purple→pink→rose surfaces, yellow-400 contrast borders and family-coloured neon glows by night.",
    },
    tags: { zh: ["固定色方案", "霓虹渐变"], en: ["Fixed palette", "Neon gradient"] },
    pathPrefix: "/neon",
    palettes: [],
  },
  {
    slug: "flat-minimal",
    name: { zh: "扁平极简", en: "Flat Minimal" },
    desc: {
      zh: "冷白画布、浅天蓝表面、深天蓝品牌色：1px 发丝边界、全直角、零阴影，层级全靠边界与留白。为企业后台与信息密集应用设计——密度高、状态分明、动效克制。",
      en: "Cool-white canvas, pale-sky surfaces, deep-sky brand: 1px hairline borders, square corners, zero shadows — hierarchy comes from boundaries and whitespace alone. Built for enterprise consoles and information-dense apps: dense, unambiguous, restrained.",
    },
    tags: { zh: ["固定色方案", "企业后台"], en: ["Fixed palette", "Enterprise"] },
    pathPrefix: "/flat",
    palettes: [],
  },
];

export function findStyleTemplate(slug: string | undefined): StyleTemplate | undefined {
  return STYLE_TEMPLATES.find((t) => t.slug === slug);
}

export const SCHEME_PREFIXES: string[] = STYLE_TEMPLATES.map((t) => t.pathPrefix).filter(Boolean);

export function findStyleTemplateByPath(pathname: string): StyleTemplate {
  const hit = STYLE_TEMPLATES.find(
    (t) => t.pathPrefix && (pathname === t.pathPrefix || pathname.startsWith(`${t.pathPrefix}/`)),
  );
  return hit ?? STYLE_TEMPLATES[0];
}

export function schemePrefixOf(pathname: string): string {
  return findStyleTemplateByPath(pathname).pathPrefix;
}

export function stripSchemePrefix(pathname: string): string {
  const prefix = schemePrefixOf(pathname);
  if (!prefix || !pathname.startsWith(prefix)) return pathname;
  return pathname.slice(prefix.length) || "/";
}

const LANE_HREF = /^\/(en|zh)(?:\/docs(?:\/|$)|$)/u;

export function toSchemeHref(pathname: string, href: string): string {
  const prefix = schemePrefixOf(pathname);
  if (!prefix || !LANE_HREF.test(href)) return href;
  return `${prefix}${href}`;
}

export function toStylePath(pathname: string, target: StyleTemplate): string {
  const current = findStyleTemplateByPath(pathname);
  const rest = current.pathPrefix
    ? pathname.slice(current.pathPrefix.length)
    : pathname;
  if (rest === "/") return target.pathPrefix || "/";
  const tail = rest.replace(/^(\/[^/]+\/showcase\/)[^/]+$/u, `$1${target.slug}`);
  return `${target.pathPrefix}${tail}` || "/";
}

export function laneHomeHref(pathname: string): string {
  const segment = stripSchemePrefix(pathname).split("/").find(Boolean);
  const lang = segment && LANGUAGES.includes(segment) ? segment : siteDefaultLanguage;
  return `${schemePrefixOf(pathname)}/${lang}`;
}
