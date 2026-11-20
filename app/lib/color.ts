export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

let probe: HTMLDivElement | null = null;
function getProbe(): HTMLDivElement | null {
  if (typeof document === "undefined") return null;
  if (!probe) {
    probe = document.createElement("div");
    probe.style.display = "none";
    document.body.append(probe);
  }
  return probe;
}

export function resolveColor(input: string): RGBA | null {
  const el = getProbe();
  if (!el) return null;
  el.style.color = "";
  el.style.color = input;
  if (!el.style.color) return null;
  const computed = getComputedStyle(el).color;
  return parseComputedColor(computed) ?? parseColorString(input);
}

const num = (s: string): number | null => {
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : null;
};

function component(s: string, scale = 1): number | null {
  const t = s.trim();
  if (t.endsWith("%")) {
    const v = num(t.slice(0, -1));
    return v === null ? null : (v / 100) * scale;
  }
  const v = num(t);
  return v === null ? null : v * scale;
}

function alpha(s: string | undefined): number {
  if (s === undefined) return 1;
  const t = s.trim();
  if (t === "none") return 0;
  const v = component(t, 1);
  return v === null ? 1 : Math.min(1, Math.max(0, v));
}

// CSS Color 4 通道：% 按满量程换算，none 按 0
function cssChannel(s: string, percentMax: number): number | null {
  const t = s.trim();
  if (t === "none") return 0;
  const v = num(t);
  if (v === null) return null;
  return t.endsWith("%") ? (v / 100) * percentMax : v;
}

export function parseComputedColor(str: string): RGBA | null {
  const s = str.trim().toLowerCase();

  const hex = s.match(/^#([0-9a-f]{3,8})$/u);
  if (hex) {
    const h: string = hex[1] ?? "";
    const n = h.length;
    const expand = (i: number) => (n === 3 || n === 4 ? parseInt(h[i] + h[i], 16) / 255 : parseInt(h.slice(i * 2, i * 2 + 2), 16) / 255);
    if (n === 3 || n === 4 || n === 6 || n === 8) {
      return { r: expand(0), g: expand(1), b: expand(2), a: n === 4 || n === 8 ? expand(n === 4 ? 3 : 3) : 1 };
    }
  }

  let m = s.match(/^rgba?\(([^)]+)\)$/u);
  if (m) {
    const parts = m[1].includes(",") ? m[1].split(",") : m[1].split(/\s*\/\s*/u).flatMap((p) => p.trim().split(/\s+/u));
    if (parts.length >= 3) {
      const chan = (channel: string) => {
        const t = channel.trim();
        if (t.endsWith("%")) {
          const v = num(t.slice(0, -1));
          return v === null ? 0 : clamp01(v / 100);
        }
        const v = num(t);
        return v === null ? 0 : clamp01(v / 255);
      };
      return {
        r: chan(parts[0]),
        g: chan(parts[1]),
        b: chan(parts[2]),
        a: alpha(parts[3]),
      };
    }
  }

  m = s.match(/^hsla?\(([^)]+)\)$/u);
  if (m) {
    const parts = m[1].includes(",") ? m[1].split(",") : m[1].split(/\s*\/\s*/u).flatMap((p) => p.trim().split(/\s+/u));
    if (parts.length >= 3) {
      const h = num(parts[0]) ?? 0;
      const sat = clamp01(component(parts[1], 1) ?? 0);
      const lig = clamp01(component(parts[2], 1) ?? 0);
      const [r, g, b] = hslToSrgb(h, sat, lig);
      return { r, g, b, a: alpha(parts[3]) };
    }
  }

  m = s.match(/^lab\(([^)]+)\)$/u);
  if (m) {
    const parts = m[1].split(/\s*\/\s*/u);
    const comps = parts[0].trim().split(/\s+/u);
    if (comps.length >= 3) {
      const L = (cssChannel(comps[0], 100) ?? 0) / 100;
      const [r, g, b] = labToSrgb(L, cssChannel(comps[1], 125) ?? 0, cssChannel(comps[2], 125) ?? 0);
      return { r, g, b, a: alpha(parts[1]) };
    }
  }

  m = s.match(/^lch\(([^)]+)\)$/u);
  if (m) {
    const parts = m[1].split(/\s*\/\s*/u);
    const comps = parts[0].trim().split(/\s+/u);
    if (comps.length >= 3) {
      const L = (cssChannel(comps[0], 100) ?? 0) / 100;
      const c = cssChannel(comps[1], 150) ?? 0;
      const h = ((cssChannel(comps[2], 360) ?? 0) * Math.PI) / 180;
      const [r, g, b] = labToSrgb(L, c * Math.cos(h), c * Math.sin(h));
      return { r, g, b, a: alpha(parts[1]) };
    }
  }

  m = s.match(/^oklch\(([^)]+)\)$/u);
  if (m) {
    const parts = m[1].split(/\s*\/\s*/u);
    const comps = parts[0].trim().split(/\s+/u);
    if (comps.length >= 3) {
      const L = component(comps[0], 1) ?? 0;
      const C = num(comps[1]) ?? 0;
      const H = (num(comps[2].replace(/deg$/u, "")) ?? 0) * (Math.PI / 180);
      const [r, g, b] = oklabToSrgb(L, C * Math.cos(H), C * Math.sin(H));
      return { r, g, b, a: alpha(parts[1]) };
    }
  }

  m = s.match(/^oklab\(([^)]+)\)$/u);
  if (m) {
    const parts = m[1].split(/\s*\/\s*/u);
    const comps = parts[0].trim().split(/\s+/u);
    if (comps.length >= 3) {
      const [r, g, b] = oklabToSrgb(component(comps[0], 1) ?? 0, num(comps[1]) ?? 0, num(comps[2]) ?? 0);
      return { r, g, b, a: alpha(parts[1]) };
    }
  }

  m = s.match(/^color\((\w[\w-]*)\s+([^)]+)\)$/u);
  if (m) {
    const space = m[1];
    const parts = m[2].split(/\s*\/\s*/u);
    const comps = parts[0].trim().split(/\s+/u);
    if (comps.length >= 3) {
      const c = [0, 1, 2].map((i) => clamp01(component(comps[i], 1) ?? 0));
      const lin = space === "srgb-linear";
      const [r, g, b] = lin ? [linearToSrgb(c[0]), linearToSrgb(c[1]), linearToSrgb(c[2])] : c;
      return { r, g, b, a: alpha(parts[1]) };
    }
  }

  return null;
}

export function parseColorString(input: string): RGBA | null {
  return parseComputedColor(input.trim().toLowerCase());
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function hslToSrgb(h: number, s: number, l: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const seg = Math.floor(hue / 60) % 6;
  const table: [number, number, number][] = [
    [c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x],
  ];
  const [r, g, b] = table[seg];
  return [clamp01(r + m), clamp01(g + m), clamp01(b + m)];
}

// CIE Lab 参考白（D50）与 Bradford 色适应 D50→D65、XYZ D65 → 线性 sRGB 矩阵（CSS Color 4）
const LAB_D50_WHITE = [0.9642956764295677, 1, 0.8251046025104602];
const BRADFORD_D50_TO_D65 = [
  [0.9554734216, -0.02309845491, 0.06325924319],
  [-0.02836970927, 1.009995398, 0.02104144118],
  [0.01231401487, -0.02050764930, 1.330365926],
];
const XYZ_D65_TO_LINEAR_SRGB = [
  [3.2409699419, -1.5373831776, -0.4986107603],
  [-0.9692436363, 1.8759675015, 0.0415550574],
  [0.0556300797, -0.2039769589, 1.0569715142],
];

function mul3x3(m: number[][], v: number[]): [number, number, number] {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

// CIE Lab（L 0–1，D50 白点）→ 线性 sRGB，超出色域钳制
function labToSrgb(L: number, a: number, b: number): [number, number, number] {
  const l100 = L * 100;
  const fy = (l100 + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const k = 24389 / 27;
  const e = 216 / 24389;
  const fx3 = fx * fx * fx;
  const fz3 = fz * fz * fz;
  const lin = mul3x3(
    XYZ_D65_TO_LINEAR_SRGB,
    mul3x3(
      BRADFORD_D50_TO_D65,
      [
        (fx3 > e ? fx3 : (116 * fx - 16) / k) * LAB_D50_WHITE[0],
        (l100 * l100 * l100 > k * e ? fy * fy * fy : l100 / k) * LAB_D50_WHITE[1],
        (fz3 > e ? fz3 : (116 * fz - 16) / k) * LAB_D50_WHITE[2],
      ],
    ),
  );
  return [clamp01(linearToSrgb(lin[0])), clamp01(linearToSrgb(lin[1])), clamp01(linearToSrgb(lin[2]))];
}

function oklabToSrgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const mm = m_ * m_ * m_;
  const ss = s_ * s_ * s_;
  return [
    clamp01(linearToSrgb(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * ss)),
    clamp01(linearToSrgb(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * ss)),
    clamp01(linearToSrgb(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * ss)),
  ];
}

export function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function blend(fg: RGBA, bg: RGBA): RGBA {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (f: number, b: number) => (f * fg.a + b * bg.a * (1 - fg.a)) / a;
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a };
}

export function luminance(c: RGBA): number {
  return (
    0.2126 * srgbToLinear(clamp01(c.r)) +
    0.7152 * srgbToLinear(clamp01(c.g)) +
    0.0722 * srgbToLinear(clamp01(c.b))
  );
}

export function contrastRatio(a: RGBA, b: RGBA): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function toHex(c: RGBA): string {
  const h = (v: number) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0");
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

export function toRgbString(c: RGBA): string {
  const n = (v: number) => Math.round(clamp01(v) * 255);
  return c.a < 1 ? `rgb(${n(c.r)} ${n(c.g)} ${n(c.b)} / ${Math.round(c.a * 100)}%)` : `rgb(${n(c.r)} ${n(c.g)} ${n(c.b)})`;
}
