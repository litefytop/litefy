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

/* Neo accent ramp (blueprint rule 23): vivid 300-class stops under black ink;
   indigo (C < 0.08) and lime (identical to the day identity surface) excluded. */
const ACCENT_OPTIONS: PaletteOption[] = [
  { name: "default", label: "Default" },
  { name: "amber", label: "Amber", swatch: "oklch(82.8% 0.189 84.429)" },
  { name: "cyan", label: "Cyan", swatch: "oklch(78.9% 0.154 211.53)" },
  { name: "emerald", label: "Emerald", swatch: "oklch(84.5% 0.143 164.978)" },
  { name: "fuchsia", label: "Fuchsia", swatch: "oklch(83.3% 0.145 321.434)" },
  { name: "orange", label: "Orange", swatch: "oklch(75% 0.183 55.934)" },
  { name: "pink", label: "Pink", swatch: "oklch(82.3% 0.12 346.018)" },
  { name: "purple", label: "Purple", swatch: "oklch(82.7% 0.119 306.383)" },
  { name: "rose", label: "Rose", swatch: "oklch(81% 0.117 11.638)" },
  { name: "sky", label: "Sky", swatch: "oklch(82.8% 0.111 230.318)" },
  { name: "teal", label: "Teal", swatch: "oklch(77.7% 0.152 181.912)" },
  { name: "violet", label: "Violet", swatch: "oklch(81.1% 0.111 293.571)" },
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
      zh: "柔和极简：极简的骨架叠安静的软表面——软边界、静默阴影与同色凹槽输入区，层级靠留白与光。无障碍整体按 WCAG 2.2 AA，关键场景做到 AAA。",
      en: "Soft minimal: a minimal skeleton over a quiet soft surface — hairline boundaries, silent shadows, and same-tone recessed field interiors. WCAG 2.2 AA throughout, AAA where it counts.",
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
      zh: "纯白画布、纯黑 2px 粗描边、硬边位移阴影、零圆角：粉作 CTA，酸性绿扛 Hero，亮黄作悬停洪泛。品牌色与悬停色档均可切换——悬停硬切、按下压平。",
      en: "White canvas, 2px black strokes, hard offset shadows, zero radius: hot pink drives the CTA, acid green carries the hero, bright yellow floods on hover. Brand and accent tiers are switchable — hover snaps, press crushes.",
    },
    tags: { zh: ["多色方案", "创意站点"], en: ["Multi-color", "Creative"] },
    pathPrefix: "/neo",
    palettes: [
      {
        storageKey: "brand-storage",
        attr: "data-brand",
        label: { zh: "品牌色档", en: "Brand color" },
        dotVar: "--primary",
        options: BRAND_OPTIONS,
      },
      {
        storageKey: "accent-storage",
        attr: "data-accent",
        label: { zh: "悬停色档", en: "Accent color" },
        dotVar: "--accent",
        options: ACCENT_OPTIONS,
      },
    ],
  },
  {
    slug: "neon-gradient",
    name: { zh: "霓虹渐变", en: "Neon Gradient" },
    desc: {
      zh: "背景分档 + 品牌语义单档渐变方案：浅紫 / 深蓝两档画布，青粉色流按钮、紫粉渐变表面、对比黄边框（日 amber-700、夜 yellow-400）；站内日/夜开关只动背景三档，品牌与语义色两套同值。",
      en: "A canvas-tiered gradient scheme with one brand and semantic set: pale-purple / deep-blue canvases, cyan→pink flowing buttons, purple→pink→rose surfaces and a contrast border (amber-700 by day, yellow-400 by night). The site's day/night toggle moves only the three background tiers; brand and status colours stay identical.",
    },
    tags: { zh: ["背景分档", "霓虹渐变"], en: ["Tiered canvas", "Neon gradient"] },
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
    tags: { zh: ["多色方案", "企业后台"], en: ["Multi-color", "Enterprise"] },
    pathPrefix: "/flat",
    palettes: [
      {
        storageKey: "brand-storage",
        attr: "data-brand",
        label: { zh: "品牌色档", en: "Brand color" },
        dotVar: "--primary",
        options: BRAND_OPTIONS,
      },
    ],
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
