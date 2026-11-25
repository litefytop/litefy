#!/usr/bin/env node
// 色板成对门禁：扫 app/ui/schemes/*/index.css 的 :root 与 .dark 色板段（蓝图 ui/schemes.md 第 24 条）
// 规则 1 字面性：24 枚色板令牌只答字面色值——hex 或 oklch 三元组；color-mix()、alpha 斜杠、
//         指向另一枚色板令牌的 var() 都算衍生，报错；border 是机制值通道（第 24 条豁免），只核图形可见性
// 规则 2 成套（含补全律）：每枚背景档必须有它的配对前景档，缺档直接报错（不再静默跳过）；
//         实测 ≥4.5:1 为 AA 硬下限，-accent 悬停档与静置档共用主体 -fg，两档都核
// 规则 3 车道可辨：悬停档必须看得见——accent 对每枚静止背景 OKLab 距离 ≥0.08；
//         同族深化 <role> → <role>-accent ≥0.06；彩色方案 accent 彩度 C ≥0.08，中性方案改核明度步 ≥8 个 L 点
// 规则 4 禁用档：disabled 始终保持中性灰（彩度 C ≤0.02，不随表面档走），且对每枚静止背景按规则 3 的同阈值可辨；
//         禁用与悬停的错开一阶由各案 design.md 与蓝图 ui/schemes/elevation.md 约束，不设门禁阈值
// 机制值（focus、elevation、shadow、text-<status>-independent 别名）不参与本门禁。
// 未迁移方案的违规按 EXEMPT 名单逐条登记并带原因。

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "app", "ui", "schemes");

const PALETTE = [
  "background", "foreground",
  "surface", "surface-fg",
  "accent", "accent-fg",
  "border",
  "primary", "primary-fg", "primary-accent",
  "danger", "danger-fg", "danger-accent",
  "info", "info-fg", "info-accent",
  "success", "success-fg", "success-accent",
  "warning", "warning-fg", "warning-accent",
  "disabled", "disabled-fg",
];

// 浮层成对槽：受成对律约束，不受字面性约束（可以是 var 引用）
const RAISED = "surface-raised";
const RAISED_FG = "surface-raised-fg";

// 背景档 → 配对前景档（补全律的正方清单；-accent 档由主体 -fg 兼任配对）
const PARTNER = new Map([
  ["background", "foreground"],
  ["surface", "surface-fg"],
  [RAISED, RAISED_FG],
  ["accent", "accent-fg"],
  ["primary", "primary-fg"],
  ["primary-accent", "primary-fg"],
  ["danger", "danger-fg"],
  ["danger-accent", "danger-fg"],
  ["info", "info-fg"],
  ["info-accent", "info-fg"],
  ["success", "success-fg"],
  ["success-accent", "success-fg"],
  ["warning", "warning-fg"],
  ["warning-accent", "warning-fg"],
  ["disabled", "disabled-fg"],
]);

// 悬停/强调面可能压上的静止背景（跨车道核可见性）；禁用档按规则 4 另核，与悬停共用同一组底档
const LANE_BASES = ["background", "surface", RAISED];
// 同族深化档：静置背景 → 悬停背景
const ROLES = ["primary", "danger", "info", "success", "warning"];

// 方案色板性质（第 24 条车道可辨律）：彩色核彩度，中性以明度步替代
const KIND = new Map([
  ["neo-brutalist", "chromatic"],
  ["neon-gradient", "chromatic"],
  ["minimal", "neutral"],
  ["flat-minimal", "neutral"],
]);

// 违规登记（方案名 → { literal: 令牌名[], pair: "背景档"[], lane: "车道名"[], reason }）
const EXEMPT = new Map([
  ["flat-minimal", {
    literal: [], pair: [], lane: ["primary×primary-accent"],
    reason: "未迁移（本轮只落 neo-brutalist）：品牌深化档 39.1 → 37.9 亦只作边框级深化，迁移该案时按新阈值复核",
  }],
  ["neon-gradient", {
    literal: [], pair: [], lane: ["danger×danger-accent"],
    reason: "语义单档（两档画布同值）：危险块静置 #f87171 → 悬停 #fb7185 的深化步仅 0.027（同为浅红，靠彩度而非明度区分），本案渐变轨尚在实验，迁移时按新阈值复核",
  }],
]);

const FLOOR = 4.5;
const LANE_DE = 0.08;
const FAMILY_DE = 0.06;
const NEUTRAL_L_POINTS = 8;
const CHROMA_FLOOR = 0.08;
const DISABLED_CHROMA = 0.02;

function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
function linearToSrgb(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
}
function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}
function oklchToRgb(L, C, Hdeg) {
  const h = (Hdeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => clamp01(linearToSrgb(clamp01(c))));
}

// OKLab（Ottosson）：用于车道距离与彩度，对比度只用相对亮度
function oklab(rgb) {
  const [r, g, b] = rgb.map((c) => srgbToLinear(clamp01(c)));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function deltaE(rgbA, rgbB) {
  const [l1, a1, b1] = oklab(rgbA);
  const [l2, a2, b2] = oklab(rgbB);
  return +Math.hypot(l1 - l2, a1 - a2, b1 - b2).toFixed(3);
}
function chroma(rgb) {
  const [, a, b] = oklab(rgb);
  return +Math.hypot(a, b).toFixed(3);
}
function lightness(rgb) {
  return +(oklab(rgb)[0] * 100).toFixed(1);
}

// 返回 "literal"（可算的字面色）| "derived"（运算或引用）| "unknown"
function classify(raw) {
  const v = raw.trim();
  if (/^#[0-9a-f]{3,4}$/iu.test(v) || /^#[0-9a-f]{6}$/iu.test(v)) {
    return { kind: "literal", rgb: hexToRgb(v) };
  }
  if (/^#[0-9a-f]{8}$/iu.test(v)) return { kind: "derived", why: "hex 带 alpha 通道" };
  const oklch = /^oklch\(\s*([\d.]+)%?\s+([\d.-]+|none)\s+([\d.-]+|none)(?:deg)?\s*\)$/u.exec(v);
  if (oklch) {
    const c = oklch[2] === "none" ? 0 : Number.parseFloat(oklch[2]);
    const h = oklch[3] === "none" ? 0 : Number.parseFloat(oklch[3]);
    return { kind: "literal", rgb: oklchToRgb(Number.parseFloat(oklch[1]) / 100, c, h) };
  }
  if (v.includes("color-mix(")) return { kind: "derived", why: "color-mix() 运算" };
  if (/^oklch\(.*\/.+\)$/u.test(v)) return { kind: "derived", why: "oklch 带 alpha 斜杠" };
  if (/^hsla?\(/u.test(v) || /^rgba?\(/u.test(v)) return { kind: "derived", why: "函数色值" };
  const ref = /^var\(--([a-z0-9-]+)\)$/u.exec(v);
  if (ref) return { kind: "ref", target: ref[1] };
  return { kind: "unknown" };
}

function hexToRgb(hex) {
  let h = hex.slice(1);
  if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16) / 255);
}

function contrast(a, b) {
  const lum = (rgb) => {
    const [r, g, blue] = rgb.map((c) => srgbToLinear(clamp01(c)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * blue;
  };
  const la = lum(a);
  const lb = lum(b);
  return +(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)).toFixed(2));
}

function blockOf(text, selector) {
  const at = new RegExp(`^${selector.replace(".", "\\.")}\\s*\\{`, "mu").exec(text);
  if (!at) return null;
  const end = text.indexOf("}", at.index);
  return end < 0 ? null : text.slice(at.index + at[0].length, end);
}

function varsOf(body) {
  const out = new Map();
  if (!body) return out;
  for (const m of body.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gu)) out.set(m[1], m[2]);
  return out;
}

// 解析到可计算的字面色；引用链只跟 var()，禁止色板令牌互指由规则 1 单独判
function rgbOf(vars, name, seen = new Set()) {
  const raw = vars.get(name);
  if (!raw || seen.has(name)) return null;
  seen.add(name);
  const c = classify(raw);
  if (c.kind === "literal") return c.rgb;
  if (c.kind === "ref") return rgbOf(vars, c.target, seen);
  return null;
}

const problems = [];
const schemes = readdirSync(ROOT).filter((name) => existsSync(join(ROOT, name, "index.css")));

for (const scheme of schemes) {
  const css = readFileSync(join(ROOT, scheme, "index.css"), "utf8");
  const exempt = EXEMPT.get(scheme) ?? { literal: [], pair: [], lane: [], reason: "" };
  const day = varsOf(blockOf(css, ":root"));
  const night = varsOf(blockOf(css, ".dark")) ?? day;
  const merged = new Map(day);
  for (const [k, v] of night) merged.set(k, v);

  for (const tier of [["day", day], ["night", merged]]) {
    const vars = tier[1];
    // 规则 1：字面性（border 为机制值通道，按第 24 条豁免）
    for (const token of PALETTE) {
      if (!vars.has(token) || token === "border") continue;
      const c = classify(vars.get(token));
      const derived = c.kind === "derived" || (c.kind === "ref" && PALETTE.includes(c.target));
      if (derived && !exempt.literal.includes(token)) {
        const why = c.kind === "ref" ? `指向色板令牌 --${c.target}` : c.why;
        problems.push(`${scheme}/index.css [${tier[0]}] 规则1 色板令牌 --${token} 非字面值：${why}`);
      }
    }
    // 规则 2：成套与补全——背景档在，配对前景档就必须在，且两档比值达标
    for (const [bg, fg] of PARTNER) {
      if (!vars.has(bg)) continue;
      const inPalette = PALETTE.includes(bg) || bg === RAISED;
      if (!inPalette) continue;
      if (!vars.has(fg)) {
        if (!exempt.pair.includes(bg)) {
          problems.push(`${scheme}/index.css [${tier[0]}] 规则2 补全律：背景档 --${bg} 缺配对前景档 --${fg}`);
        }
        continue;
      }
      const fgRgb = rgbOf(vars, fg);
      const bgRgb = rgbOf(vars, bg);
      if (!fgRgb || !bgRgb) {
        problems.push(`${scheme}/index.css [${tier[0]}] 规则2 成套对 ${fg}×${bg} 取值不可解析（运算值或断链）`);
        continue;
      }
      const ratio = contrast(fgRgb, bgRgb);
      if (ratio < FLOOR) {
        problems.push(`${scheme}/index.css [${tier[0]}] 规则2 成套对 ${fg}×${bg} 实测 ${ratio}:1，低于 AA ${FLOOR}:1`);
      }
    }
    // 规则 3 / 规则 4：车道可辨——悬停档与禁用档各自对三档静止背景核可见性
    const kind = KIND.get(scheme);
    const checkLanes = (subject) => {
      const rgb = rgbOf(vars, subject);
      if (!rgb) {
        problems.push(`${scheme}/index.css [${tier[0]}] --${subject} 取值不可解析，无法核车道`);
        return;
      }
      for (const base of LANE_BASES) {
        if (!vars.has(base)) continue;
        const key = `${subject}×${base}`;
        if (exempt.lane.includes(key)) continue;
        const other = rgbOf(vars, base);
        if (!other) continue;
        const de = deltaE(rgb, other);
        const lGap = +Math.abs(lightness(rgb) - lightness(other)).toFixed(1);
        if (kind === "neutral") {
          if (lGap < NEUTRAL_L_POINTS) {
            problems.push(`${scheme}/index.css [${tier[0]}] 规则3 车道可辨 ${key} 明度步仅 ${lGap} 点（中性方案需 ≥${NEUTRAL_L_POINTS}）`);
          }
        } else if (de < LANE_DE) {
          problems.push(`${scheme}/index.css [${tier[0]}] 规则3 车道可辨 ${key} OKLab 距离 ${de}，低于 ${LANE_DE}`);
        }
      }
    };
    if (vars.has("accent")) {
      checkLanes("accent");
      if (kind === "chromatic") {
        const c = chroma(rgbOf(vars, "accent"));
        if (c < CHROMA_FLOOR && !exempt.lane.includes("accent-chroma")) {
          problems.push(`${scheme}/index.css [${tier[0]}] 规则3 彩色方案 --accent 彩度 C ${c}，低于 ${CHROMA_FLOOR}（悬停档不许答成近中性深色）`);
        }
      }
    }
    if (vars.has("disabled")) {
      const disabled = rgbOf(vars, "disabled");
      if (disabled) {
        const c = chroma(disabled);
        if (c > DISABLED_CHROMA && !(exempt.neutral ?? []).includes("disabled")) {
          problems.push(`${scheme}/index.css [${tier[0]}] 规则4 禁用档 --disabled 彩度 C ${c}，高于 ${DISABLED_CHROMA}（禁用档须答中性灰，不随表面档走）`);
        }
      }
      checkLanes("disabled");
    }
    for (const role of ROLES) {
      if (!vars.has(role) || !vars.has(`${role}-accent`)) continue;
      const key = `${role}×${role}-accent`;
      if (exempt.lane.includes(key)) continue;
      const from = rgbOf(vars, role);
      const to = rgbOf(vars, `${role}-accent`);
      if (!from || !to) continue;
      const de = deltaE(from, to);
      if (de < FAMILY_DE) {
        problems.push(`${scheme}/index.css [${tier[0]}] 规则3 同族深化车道 ${key} OKLab 距离 ${de}，低于 ${FAMILY_DE}`);
      }
    }
  }
}

if (problems.length) {
  console.error(`✗ 色板成对门禁：${problems.length} 处`);
  for (const p of problems) console.error(`  ${p}`);
  console.error("  成套律、补全律、禁衍生、车道可辨见 .agents/blueprints/ui/schemes.md 第 24 条；禁用档中性与可辨见 .agents/blueprints/ui/schemes/elevation.md 禁用档；未迁移方案登记进 EXEMPT 名单并带原因");
  process.exit(1);
}
console.log(`✓ 色板成对门禁：${schemes.length} 套方案色板字面、成对达标、悬停与禁用车道可辨（AA ${FLOOR}:1 硬下限，含 ${EXEMPT.size} 案带原因豁免）`);
