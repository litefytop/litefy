import * as React from "react";
import type { LinksFunction, MetaFunction } from "react-router";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { AppearancePanel } from "../components/appearance-panel";
import { StyleMenu } from "../components/style-select";
import { SiteSkinProvider, useSiteSkin } from "@/components/site-skin";
import { siteSkin } from "@/components/site-skin-bundle";
import neoShowcaseHref from "./neo-showcase.css?url";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileCode,
  Globe,
  Hash,
  House,
  Languages,
  Letters,
  PanelLeft,
  Settings,
  Star,
  SwatchBook,
  X,
} from "@/components/icons";
import { NavBar } from "@/ui/skins";export const links: LinksFunction = () => [
  { rel: "stylesheet", href: neoShowcaseHref },
];
export const meta: MetaFunction = () => [
  { title: "Neo-brutalist — Litefy UI" },
  { name: "robots", content: "noindex" },
];
// Display hexes of the scheme palette — the tokens live in ../ui/schemes/neo-brutalist/index.css;
// keep the two in sync. Three fill hues shown at their DAY tier (700 stops), the four
// semantic stops at their day tier (800 stops); the *_N constants are the NIGHT tier
// (500 stops) for the showcase's fixed-black islands (the four laws cards).
const PINK = "#e60076"; // pink-600 — nearest to the founding #ff006e
const GREEN = "#bbf451"; // lime-300 — nearest to the founding #ccff00
const YELLOW = "#ffdf20"; // yellow-300 — nearest to the founding #ffff00
const DANGER = "#a3004c"; // pink-800
const INFO = "#005f78"; // cyan-800
const WARNING = "#973c00"; // amber-800
const SUCCESS = "#3c6300"; // lime-800
const PINK_N = "#f6339a"; // pink-500
const GREEN_N = "#7ccf00"; // lime-500
const CYAN_N = "#00b8db"; // cyan-500
const ORANGE_N = "#ff6900"; // orange-500
const SECTION = "scroll-mt-16 border-b-4 border-border px-2 py-8 md:px-4 md:py-12";
const HEADLINE = "typo-h1 uppercase";
const EYEBROW = "mb-2 block typo-overline";
const LEAD = "font-mono text-base leading-body";
type Lang = "en" | "zh";
const COPY: Record<
  Lang,
  {
    brand: [string, string];
    nav: string[];
    navMore: string;
    home: string;
    docs: string;
    hero: {
      badge: string;
      title: [string, string, string];
      lead: string;
      cta1: string;
      cta2: string;
      stats: [string, string][];
    };
    palette: {
      eyebrow: string;
      title: string;
      lead: string;
      swatches: { name: string; hex: string; role: string; color: string }[];
      pairs: { label: string; fg: string; bg: string }[];
    };
    laws: {
      eyebrow: string;
      title: string;
      lead: string;
      rules: { tag: string; color: string; dark: boolean; code: string; desc: string; demo: string }[];
      crushNote: string;
      snapNote: string;
      cardTitle: string;
      cardBody: string;
      cardNote: string;
      spring: string;
      brutal: string;
      note: string;
    };
    type: { eyebrow: string; title: string; lead: string; ladder: string; groupDisplay: string; groupReading: string; groupMechanism: string; prose: string; essayTitle: string; p1: string; p2: string; h3: string; p3a: string; p3b: string; listA: string; listB: string; listC: string; quote: string };
    rules: { eyebrow: string; title: string; lead: string; principles: { n: string; title: string; body: string }[]; do: string[]; dont: string[]; doTitle: string; dontTitle: string };
    closing: { eyebrow: string; title: string; lead: string; cards: { title: string; body: string }[] };
    footer: { desc: string; docs: string; styles: string; install: string; rights: string };
  }
> = {
  en: {
    brand: ["NEO", "BRUTAL"],
    nav: ["Palette", "Laws", "Type", "Rules"],
    navMore: "Navigate",
    home: "Home",
    docs: "Docs",
    hero: {
      badge: "Design System Showcase",
      title: ["RAW.", "BOLD.", "BRUTAL."],
      lead: "Neo-Brutalist design: thick black borders, hard-edge shadows, zero border-radius, maximum contrast. Function over form. Unapologetic.",
      cta1: "View Components",
      cta2: "Read the Docs",
      stats: [
        ["0px", "BORDER RADIUS"],
        ["4px", "BORDER WIDTH"],
        ["8px", "SHADOW OFFSET"],
        ["7", "COLOUR TOKENS"],
      ],
    },
    palette: {
      eyebrow: "// Color System",
      title: "PALETTE",
      lead: "Black and white as the structural foundation. Three fill hues on a day/night ladder, four semantic stops for status. No pastels. No gradients. No neutral grays.",
      swatches: [
        { name: "Hot Pink", hex: "#e60076", role: "CTA / Selected", color: PINK },
        { name: "Acid Green", hex: "#bbf451", role: "Hero / Headers / Sidebar", color: GREEN },
        { name: "Bright Yellow", hex: "#ffdf20", role: "Hover / Focus", color: YELLOW },
        { name: "Danger Pink", hex: "#a3004c", role: "Danger text", color: DANGER },
        { name: "Info Cyan", hex: "#005f78", role: "Info text", color: INFO },
        { name: "Warn Amber", hex: "#973c00", role: "Warning text", color: WARNING },
        { name: "OK Lime", hex: "#3c6300", role: "Success text", color: SUCCESS },
        { name: "Pure Black", hex: "#000000", role: "Borders / Text", color: "#000000" },
      ],
      pairs: [
        { label: "WHITE ON PINK · DAY", fg: "#ffffff", bg: PINK },
        { label: "BLACK ON PINK · NIGHT", fg: "#000000", bg: PINK_N },
        { label: "BLACK ON GREEN", fg: "#000000", bg: GREEN },
        { label: "BLACK ON YELLOW", fg: "#000000", bg: YELLOW },
      ],
    },
    laws: {
      eyebrow: "// Animation & Interaction Rules",
      title: "FOUR LAWS",
      lead: "Neo-Brutalist interactions are defined by four named rules. Each has an interactive demo below. Hover and click to feel the difference.",
      rules: [
        {
          tag: "Rule 01 — Physical Crushing",
          color: PINK_N,
          dark: false,
          code: "shadow-[8px_8px_0_0_var(--color-background)] active:translate-x-2 active:translate-y-2 active:shadow-none",
          desc: "The translate MUST equal the original shadow pixel value. Complete flattening — entity crushed into the surface.",
          demo: "CRUSH ME",
        },
        {
          tag: "Rule 02 — Brutal Snap",
          color: GREEN_N,
          dark: false,
          code: "bg-background hover:bg-accent hover:text-accent-fg transition-[box-shadow,translate] duration-150 ease-out",
          desc: "Instant hard-cut background switch on hover. NO gradients, NO opacity fade. Sharp instantaneous snap.",
          demo: "HOVER ME",
        },
        {
          tag: "Rule 03 — Zero Rounding Easing",
          color: CYAN_N,
          dark: false,
          code: "transition-[box-shadow,translate] duration-150 ease-out",
          desc: "All transitions: ease-out, 150ms. The transition list is translate and shadow only — no transition-all. Brutal collision feel. No spring overshoot, no elastic settling.",
          demo: "",
        },
        {
          tag: "Rule 04 — Heavy Hover",
          color: ORANGE_N,
          dark: false,
          code: "shadow-[8px_8px_0_0_var(--color-background)] hover:shadow-[12px_12px_0_0_var(--color-primary)] hover:bg-accent hover:text-accent-fg",
          desc: "Cards on hover: shadow grows one notch (8 → 12) AND switches to pink. Background snaps. Physical impact.",
          demo: "",
        },
      ],
      crushNote: "shadow-8px → active translate is exactly 8px",
      snapNote: "Background snaps from white to acid green — no fade",
      cardTitle: "Project Card",
      cardBody: "Hover — shadow goes pink + BG snaps",
      cardNote: "Shadow grows 8px → 12px and switches from white to var(--color-primary)",
      spring: "Soft spring (forbidden here)",
      brutal: "Brutal ease-out 150ms",
      note: "Hover a track — the snap against the bounce",
    },
    type: {
      eyebrow: "// Typography",
      title: "TYPE SYSTEM",
      lead: "font-black for headings, font-mono for labels and code. The ladder belongs to the scheme — six heading tiers, one body, caps on labels. No light weights, no loose tracking.",
      ladder: "Ladder",
      groupDisplay: "Display",
      groupReading: "Reading",
      groupMechanism: "Mechanism",
      prose: "Reading scope",
      essayTitle: "Reading is a rhythm",
      p1: "Good body copy earns its keep before anyone judges the design. Line height leaves room to breathe between lines, headings stand quietly ahead of paragraphs, quotes step behind the left rule — typesetting recedes, content arrives.",
      p2: "A paragraph is the smallest unit of rhythm: three to five lines make one, and without that rise and fall even the right sizes read flat.",
      h3: "Headings stay restrained",
      p3a: "Hierarchy comes from size and whitespace, not weight or colour: a subheading one step above body is enough to hold the structure. Change one ",
      p3b: " and the whole page breathes with it.",
      listA: "Line height gives body copy room to breathe",
      listB: "Headings step down tier by tier, never below body size",
      listC: "Quotes and inline code appear in real context, not as stranded specimens",
      quote: "“Typography is what language looks like.” — Ellen Lupton",
    },
    rules: {
      eyebrow: "// Visual traits",
      title: "DESIGN RULES",
      lead: "Six visual traits: thick black borders, blocky construction, stamped shadows, clashing accents, flat surfaces, raw anti-polish — each a token or attribute the scheme enforces.",
      principles: [
        { n: "01", title: "BLACK STROKE", body: "Thick pure-black strokes are the structural grammar: they separate panels, controls and colour blocks, and the boundary itself is the graphic statement — the page reads as a set of placed objects." },
        { n: "02", title: "BOXY BUILD", body: "Corners stay square; components keep blunt, heavy silhouettes. Inputs, cards and buttons occupy a definite area instead of melting into the surface — mechanical and declarative, never soft." },
        { n: "03", title: "STAMPED SHADOW", body: "Shadows are hard-edged, flat and clearly offset, like a second solid shape stamped slightly out of register. Depth comes from consistent offset direction, never from darkening." },
        { n: "04", title: "CLASHING ACCENTS", body: "Hot pink, acid lime and burnt amber hit a bright flat canvas to interrupt, signal and charge. Black strokes keep the collisions legible; colour carries a duty and never fills blank space." },
        { n: "05", title: "FLAT SURFACE", body: "No gradients, no glass translucency, no soft shading. A surface is a flat colour field; hierarchy rides on stroke, position, scale and contrast — a panel is a panel." },
        { n: "06", title: "DELIBERATE ROUGHNESS", body: "Where product design goes quiet, it goes loud; where polish tries to hide, it shows its construction. Rough is not random: alignment, copy, contrast and hierarchy stay disciplined." },
      ],
      doTitle: "DO",
      dontTitle: "DON'T",
      do: [
        "border-2 md:border-4 border-border — thick hard borders",
        "shadow-brutal-8 md:shadow-brutal-12 — hard offset shadow, zero blur",
        "rounded-none — zero border radius always",
        "font-black for headings, font-mono for body",
        "hover:bg-accent — hard instant colour snap",
        "active:translate-x-2 active:translate-y-2 active:shadow-none — crushing press",
        "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--color-background)] — lift before crush",
        "transition-[box-shadow,translate] duration-150 ease-out — fast, brutal timing",
      ],
      dont: [
        "rounded-lg / rounded-xl — any rounding at all",
        "bg-gradient-* — gradients are decoration",
        "border-gray-* / border-slate-* — gray borders",
        "opacity fades — colors hard-cut at 0ms",
        "blur / soft box-shadows — blur radius must stay 0",
        "focus glow rings — focus is a 2px hard outline",
        "press translate smaller than the shadow offset",
        "spring / elastic easing — ease-out or nothing",
      ],
    },
    closing: {
      eyebrow: "// Why Neo-Brutalism",
      title: "BUILT DIFFERENT",
      lead: "Six reasons why the most memorable digital products embrace raw, unapologetic design.",
      cards: [
        { title: "INSTANTLY RECOGNIZABLE", body: "Neo-Brutalism is unmistakable. Users remember it because it refuses to blend in." },
        { title: "STRUCTURE EXPOSED", body: "Grid lines, borders, and shadows reveal the underlying system. Nothing is hidden." },
        { title: "DEVELOPER NATIVE", body: "No blur, no gradients, no filters. Pure CSS properties. Brutal to build, fast to ship." },
        { title: "HIGH CONTRAST", body: "Maximum accessibility through maximum contrast. WCAG AA by construction." },
        { title: "HONEST AFFORDANCE", body: "Buttons look like buttons. Cards look like cards. No skeuomorphic confusion." },
        { title: "ZERO DECORATION", body: "No element exists for aesthetics alone. Every visual choice is functional." },
      ],
    },
    footer: {
      desc: "Raw, unapologetic design. Black borders, hard shadows, zero radius. Inspired by architectural brutalism.",
      docs: "Docs",
      styles: "Styles",
      install: "Installation",
      rights: "Litefy UI — neo-brutalist showcase, replicated from the style's design language.",
    },
  },
  zh: {
    brand: ["NEO", "BRUTAL"],
    nav: ["色板", "法则", "文字", "规则"],
    navMore: "导航",
    home: "主页",
    docs: "文档",
    hero: {
      badge: "设计系统示例",
      title: ["原始的。", "大胆的。", "粗暴的。"],
      lead: "新粗野主义设计：厚实的黑色边框、硬边阴影、无圆角处理，极致对比。功能重于形式，毫不掩饰。",
      cta1: "查看组件",
      cta2: "阅读文档",
      stats: [
        ["0px", "圆角半径"],
        ["4px", "描边宽度"],
        ["8px", "阴影偏移"],
        ["7", "彩色令牌"],
      ],
    },
    palette: {
      eyebrow: "// 色彩系统",
      title: "色板",
      lead: "黑白承担结构。三色填充走日夜阶梯，四枚语义档承担状态。不用粉彩、不用渐变、不用中性灰。",
      swatches: [
        { name: "野兽粉", hex: "#e60076", role: "CTA / 选中", color: PINK },
        { name: "酸性绿", hex: "#bbf451", role: "Hero / 表头 / 侧栏", color: GREEN },
        { name: "亮黄", hex: "#ffdf20", role: "悬停 / 聚焦", color: YELLOW },
        { name: "危险粉", hex: "#a3004c", role: "危险文字", color: DANGER },
        { name: "信息青", hex: "#005f78", role: "信息文字", color: INFO },
        { name: "警示琥珀", hex: "#973c00", role: "警示文字", color: WARNING },
        { name: "成功绿", hex: "#3c6300", role: "成功文字", color: SUCCESS },
        { name: "纯黑", hex: "#000000", role: "描边 / 文字", color: "#000000" },
      ],
      pairs: [
        { label: "白压粉 · 日", fg: "#ffffff", bg: PINK },
        { label: "黑压粉 · 夜", fg: "#000000", bg: PINK_N },
        { label: "黑压绿", fg: "#000000", bg: GREEN },
        { label: "黑压黄", fg: "#000000", bg: YELLOW },
      ],
    },
    laws: {
      eyebrow: "// 动效与交互规则",
      title: "四大法则",
      lead: "新野兽派的交互由四条法则定义，每条都有可玩的演示。悬停、按下，用手感记住它们。",
      rules: [
        {
          tag: "法则 01 — 物理碾压",
          color: PINK_N,
          dark: false,
          code: "shadow-[8px_8px_0_0_var(--color-background)] active:translate-x-2 active:translate-y-2 active:shadow-none",
          desc: "位移必须等于原阴影的像素值。完全压平——实体碾进表面。",
          demo: "碾我",
        },
        {
          tag: "法则 02 — 野兽硬切",
          color: GREEN_N,
          dark: false,
          code: "bg-background hover:bg-accent hover:text-accent-fg transition-[box-shadow,translate] duration-150 ease-out",
          desc: "悬停背景色瞬间硬切。不用渐变、不用透明度淡出，切换就是切换。",
          demo: "悬停我",
        },
        {
          tag: "法则 03 — 零圆角缓动",
          color: CYAN_N,
          dark: false,
          code: "transition-[box-shadow,translate] duration-150 ease-out",
          desc: "一切过渡：ease-out、150ms。过渡列表只写位移与阴影——禁 transition-all。碰撞感。没有弹簧过冲，没有弹性回落。",
          demo: "",
        },
        {
          tag: "法则 04 — 重磅悬停",
          color: ORANGE_N,
          dark: false,
          code: "shadow-[8px_8px_0_0_var(--color-background)] hover:shadow-[12px_12px_0_0_var(--color-primary)] hover:bg-accent hover:text-accent-fg",
          desc: "卡片悬停：阴影升一档（8 → 12）并换成粉色。背景色硬切。物理冲击。",
          demo: "",
        },
      ],
      crushNote: "阴影 8px → 按下位移正好 8px",
      snapNote: "背景色从白瞬间硬切到酸性绿——没有淡入",
      cardTitle: "项目卡片",
      cardBody: "悬停——阴影转粉 + 背景色硬切",
      cardNote: "悬停时阴影 8px → 12px，颜色从白换成 var(--color-primary)",
      spring: "柔和弹簧（此处禁止）",
      brutal: "野兽 ease-out 150ms",
      note: "指针划过轨道——感受硬切与回弹的差别",
    },
    type: {
      eyebrow: "// 排版",
      title: "文字系统",
      lead: "标题 font-black，标签与代码 font-mono。字阶由方案持有——六级标题、一档正文、大写标签。不用细字重，不用散字距。",
      ladder: "字阶",
      groupDisplay: "首屏展示档",
      groupReading: "阅读档",
      groupMechanism: "机制档",
      prose: "长文作用域",
      essayTitle: "阅读是一种节奏",
      p1: "好的正文先让人读下去，再让人评价设计。行与行之间留出换气的空隙，标题安静地站在段落之前，引文退到左边线之后——排版退场，内容登场。",
      p2: "段落是节奏的最小单位，三五行成一段，读起来才有起伏；少了这层起伏，字号再准，读起来也是平的。",
      h3: "标题要克制",
      p3a: "层级靠字号与留白建立，不靠加粗与颜色：小节标题只比正文大一号，就足以把结构立起来。改一处 ",
      p3b: "，全文的呼吸跟着一起变。",
      listA: "行高给正文留出换气的余地",
      listB: "标题逐级递减，最深层级也不小于正文",
      listC: "引文与行内代码在真实语境里出现，而不是孤例",
      quote: "「排版就是语言的模样。」—— Ellen Lupton",
    },
    rules: {
      eyebrow: "// 视觉特征",
      title: "设计规则",
      lead: "六条视觉特征：粗黑描边、方正构造、盖章式投影、冲突强调色、平面表面、粗粝反精致——每一条都是方案强制执行的令牌或属性。",
      principles: [
        { n: "01", title: "黑色描边", body: "粗壮的纯黑描边是结构语法：它分开面板、控件与色块，边界本身就是图形声明，页面读起来像一组被摆放好的物体。" },
        { n: "02", title: "方正构造", body: "转角保持方正，组件保留钝重的块状轮廓。输入区、卡片、按钮明确占据一块区域，不融进周围表面——机械感与宣告感，不是柔软。" },
        { n: "03", title: "盖章式投影", body: "投影硬边、平涂、明显错位，像第二个实心形状没对准就盖在主体下方。不靠渐暗描绘纵深，靠偏移方向的一致性建立图形关系。" },
        { n: "04", title: "冲突强调色", body: "电黄、亮粉、青蓝、酸柠撞在明亮的平涂画布上，为的是打断、信号与情绪电压。黑色描边让碰撞保持可读；色彩承担职责，不填满空白。" },
        { n: "05", title: "平面表面", body: "去除渐变、玻璃半透明与柔和明暗塑形。表面就是平整色域，层级靠描边、位置、尺度与对比建立——面板就是面板。" },
        { n: "06", title: "刻意粗粝", body: "别人趋于安静，它选高声量；精修试图隐身，它让构造痕迹可见。粗粝不等于随意：对齐、文案、对比与层级仍然有纪律。" },
      ],
      doTitle: "要做",
      dontTitle: "别做",
      do: [
        "border-2 md:border-4 border-border——纯硬粗描边",
        "shadow-brutal-8 md:shadow-brutal-12——硬边位移阴影，模糊半径 0",
        "rounded-none——永远零圆角",
        "标题 font-black，正文 font-mono",
        "hover:bg-accent——背景色瞬间硬切",
        "active:translate-x-2 active:translate-y-2 active:shadow-none——碾压按压",
        "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_var(--color-background)]——压平前先起跳",
        "transition-[box-shadow,translate] duration-150 ease-out——快、狠、准",
      ],
      dont: [
        "rounded-lg / rounded-xl——任何圆角",
        "bg-gradient-*——渐变即装饰",
        "border-gray-* / border-slate-*——灰色描边",
        "透明度淡入淡出——颜色 0ms 硬切",
        "模糊 / 柔和阴影——模糊半径必须是 0",
        "聚焦发光环——聚焦是 2px 硬描边",
        "按压位移小于阴影偏移",
        "弹簧 / 弹性缓动——只允许 ease-out",
      ],
    },
    closing: {
      eyebrow: "// 为什么是新野兽派",
      title: "生而不同",
      lead: "六大理由，解释最令人难忘的数字产品为何拥抱原始、毫不掩饰的设计。",
      cards: [
        { title: "一眼可辨", body: "新野兽派绝不可能认错。它拒绝融入，所以用户记得住。" },
        { title: "结构外露", body: "网格线、描边与阴影把底层系统摊开给你看。什么都不藏。" },
        { title: "开发者原生", body: "没有模糊、渐变、滤镜。纯 CSS 属性。构建粗暴直接，上线飞快。" },
        { title: "高对比", body: "用最高对比换无障碍。对比度天生 AA。" },
        { title: "诚实可供性", body: "按钮长得像按钮，卡片长得像卡片。不会产生拟物误导。" },
        { title: "零装饰", body: "没有任何元素只为好看而存在。每个视觉选择都有功能。" },
      ],
    },
    footer: {
      desc: "原始、毫不掩饰的设计。黑描边、硬阴影、零圆角。灵感来自建筑粗野主义。",
      docs: "文档",
      styles: "风格",
      install: "安装",
      rights: "Litefy UI — neo-brutalist showcase，按该风格设计语言复刻。",
    },
  },
};
export default function NeoShowcasePage() {
  const { lang } = useParams<{ lang?: string }>();
  const t = COPY[lang === "zh" ? "zh" : "en"];
  return (
    <SiteSkinProvider skin={siteSkin}>
      <div className="bg-background font-sans text-foreground antialiased">
        <SiteHeader t={t} lang={lang === "zh" ? "zh" : "en"} />
        <main>
          <Hero t={t} lang={lang === "zh" ? "zh" : "en"} />
          <PaletteSection t={t} />
          <LawsSection t={t} />
          <TypeSection t={t} />
          <RulesSection t={t} />
          <ClosingSection t={t} />
        </main>
        <SiteFooter t={t} lang={lang === "zh" ? "zh" : "en"} />
      </div>
    </SiteSkinProvider>
  );
}
type T = (typeof COPY)["en"];
const NAV_ANCHORS = ["palette", "animation", "type", "rules"];
const TOOL_CLASS =
  "px-1.5 py-1 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-150 " +
  "max-sm:px-1 max-sm:tracking-wide";
function SiteHeader({ t, lang }: { t: T; lang: Lang }) {
  const { Button, buttonVariants, cn } = useSiteSkin();
  const navigate = useNavigate();
  const location = useLocation();
  const otherLang = lang === "zh" ? "en" : "zh";
  const switchLang = () => {
    navigate(`${location.pathname.replace(/^\/neo\/(en|zh)/u, `/neo/${otherLang}`)}${location.hash}${location.search}`);
  };
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-border bg-background">
      <div className="mx-auto flex h-14 max-w-288 items-center gap-1 px-2 md:h-16 md:gap-2 md:px-4">
        <Link to="/" className="flex max-sm:hidden items-center gap-0 border-2 border-border">
          <span className="bg-foreground px-1.5 py-1 text-sm font-black uppercase tracking-widest text-background md:text-base">
            {t.brand[0]}
          </span>
          <span className="bg-primary px-1.5 py-1 text-sm font-black uppercase tracking-widest text-primary-fg md:text-base">
            {t.brand[1]}
          </span>
        </Link>
        <NavBar
          className="gap-0 divide-x-2 divide-border border-2 border-border"
          items={NAV_ANCHORS.map((id, i) => ({ id, label: t.nav[i] }))}
          getKey={(item) => item.id}
          more={t.navMore}
          renderItem={(item) => (
            <a
              href={`#${item.id}`}
              className="px-2 py-1 text-xs font-black uppercase tracking-widest transition-colors duration-150 hover:bg-foreground hover:text-background"
            >
              {item.label}
            </a>
          )}
        />
        <div className="ms-auto flex items-center gap-1">
          <StyleMenu lang={lang} />
          <AppearancePanel lang={lang} />
          <Button
            type="button"
            data-variant="outline"
            onClick={switchLang}
            aria-label={otherLang === "en" ? "Switch to English" : "切换到中文"}
            title={otherLang === "en" ? "Switch to English" : "切换到中文"}
            className="shrink-0"
            icon={
              otherLang === "en" ? (
                <Letters className="size-4" aria-hidden />
              ) : (
                <Languages className="size-4" aria-hidden />
              )
            }
          />
          <Link
            to={`/neo/${lang}`}
            aria-label={t.home}
            title={t.home}
            className={cn(
              buttonVariants.outline,
              "relative aspect-square shrink-0 px-0 after:absolute after:-inset-hit after:content-['']",
            )}
          >
            <House className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}
function Hero({ t, lang }: { t: T; lang: Lang }) {
  const { buttonVariants } = useSiteSkin();
  return (
    <section className="relative overflow-hidden border-b-4 border-border bg-surface pt-12 pb-0 md:pt-14">
      <div className="brutal-march-anim absolute left-0 right-0 top-14 h-1 md:top-16" />
      <div className="relative mx-auto max-w-288 px-2 pt-6 pb-0 md:px-4 md:pt-10">
        <span className="mb-3 inline-flex items-center gap-1 border-2 border-foreground bg-foreground px-2 py-1 text-xs font-black uppercase tracking-overline text-background dark:text-surface">
          <SwatchBook className="size-4" />
          {t.hero.badge}
        </span>
        <h1 className="mb-3 typo-headline uppercase text-foreground">
          {t.hero.title[0]}
          <br />
          {t.hero.title[1]}
          <br />
          <span className="text-transparent [-webkit-text-stroke:4px_var(--color-foreground)]">
            {t.hero.title[2]}
          </span>
        </h1>
        <p className={`mb-4 max-w-168 ${LEAD} text-foreground`}>{t.hero.lead}</p>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row">
          <Link to={`/neo/${lang}/docs/overview`} className={buttonVariants.primary}>
            {t.hero.cta1}
            <ArrowRight />
          </Link>
          <Link to={`/neo/${lang}/docs`} className={buttonVariants.outline}>
            {t.hero.cta2}
          </Link>
        </div>
        <div className="grid grid-cols-2 border-t-4 border-foreground md:grid-cols-4">
          {t.hero.stats.map(([value, label], i) => (
            <div
              key={label}
              className={`border-foreground p-2.5 md:p-4 ${i < 3 ? "border-r-4" : ""} ${i === 2 ? "max-md:border-r-0" : ""} ${i < 2 ? "max-md:border-b-4" : ""}`}
            >
              <div className="mb-0.5 text-3xl font-black text-foreground md:text-4xl">
                {value}
              </div>
              <div className="text-xs font-black tracking-widest text-foreground uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function SectionHead({ eyebrow, title, lead, accent, dark }: { eyebrow: string; title: string; lead: string; accent: string; dark?: boolean }) {
  return (
    <>
      <div className="mb-1">
        <span className={`${EYEBROW}`} style={{ color: dark ? undefined : accent }}>
          {eyebrow}
        </span>
        <h2 className={`${HEADLINE} mb-1 ${dark ? "text-background" : "text-foreground"}`}>
          {title}
        </h2>
      </div>
      <div className="mb-6">
        <p className={`max-w-168 ${LEAD} ${dark ? "text-background/70" : "text-foreground"}`}>
          {lead}
        </p>
      </div>
    </>
  );
}
function PaletteSection({ t }: { t: T }) {
  return (
    <section id="palette" className={SECTION}>
      <div className="mx-auto max-w-288">
        <SectionHead
          eyebrow={t.palette.eyebrow}
          title={t.palette.title}
          lead={t.palette.lead}
          accent="var(--color-primary)"
        />
        <div className="mb-4 grid grid-cols-2 border-4 border-border md:grid-cols-3 lg:grid-cols-6">
          {t.palette.swatches.map((s, i) => (
            <div
              key={s.hex}
              className={`group cursor-pointer border-border ${i % 2 === 0 ? "max-lg:border-r-4" : ""} ${i < 6 ? "max-lg:border-b-4" : ""} ${(i < 5 || i === 6) ? "lg:border-r-4" : ""}`}
            >
              <div className="h-24 md:h-32" style={{ backgroundColor: s.color }} />
              <div className="bg-background p-1.5">
                <div className="text-xs font-black uppercase">{s.name}</div>
                <div className="font-mono text-xs text-foreground">{s.hex}</div>
                <div className="mt-0.5 inline-block border-2 border-border px-0.75 py-0.25 text-xs font-black uppercase">
                  {s.role}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-0 border-4 border-border md:grid-cols-4">
          {t.palette.pairs.map((p, i) => (
            <div
              key={p.label}
              className={`flex flex-col gap-1 p-3 md:p-4 ${i < 3 ? "border-border md:border-r-4" : ""} ${i < 3 ? "max-md:border-b-4" : ""}`}
              style={{ backgroundColor: p.bg, color: p.fg }}
            >
              <div className="text-2xl leading-none font-black uppercase md:text-3xl">Aa</div>
              <div className="font-mono text-xs font-bold tracking-widest uppercase">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function LawsSection({ t }: { t: T }) {
  const l = t.laws;
  return (
    <section id="animation" className="border-b-4 border-border bg-foreground px-2 py-8 text-background md:px-4 md:py-12">
      <div className="mx-auto max-w-288">
        <SectionHead eyebrow={l.eyebrow} title={l.title} lead={l.lead} accent={GREEN} dark />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {l.rules.map((rule, i) => (
            <div key={rule.tag} className="h-full">
              <div className="h-full border-4 border-background bg-foreground p-3 md:p-4">
                <div className="mb-1.5">
                  <span
                    className={`inline-block border-2 border-background px-1.5 py-0.75 text-xs font-black uppercase tracking-widest text-foreground`}
                    style={{ backgroundColor: rule.color }}
                  >
                    {rule.tag}
                  </span>
                </div>
                <p className="mb-0.5 font-mono text-xs leading-relaxed text-background/60">{rule.code}</p>
                <p className="mb-3 font-mono text-xs leading-relaxed" style={{ color: rule.color }}>
                  {rule.desc}
                </p>
                {i === 0 ? (
                  <div className="flex items-center justify-center border-2 border-background/20 bg-background/5 py-3">
                    <div className="text-center">
                      <div className="mb-2 inline-block cursor-pointer border-4 border-background bg-primary px-4 py-2 text-base font-black uppercase tracking-wider text-primary-fg shadow-[8px_8px_0_0_var(--color-background)] hover:shadow-[12px_12px_0_0_var(--color-background)] hover:-translate-y-1 hover:-translate-x-1 active:translate-x-2 active:translate-y-2 active:shadow-none transition-[box-shadow,translate] duration-150 ease-out">
                        {rule.demo}
                      </div>
                      <p className="font-mono text-xs text-background/40 uppercase">{l.crushNote}</p>
                    </div>
                  </div>
                ) : i === 1 ? (
                  <div className="flex items-center justify-center border-2 border-background/20 bg-background/5 py-3">
                    <div className="text-center">
                      <div className="mb-2 inline-block cursor-pointer border-4 border-background bg-background px-4 py-2 text-base font-black uppercase tracking-wider text-foreground shadow-[8px_8px_0_0_var(--color-surface)] hover:bg-accent hover:text-accent-fg hover:shadow-[12px_12px_0_0_var(--color-surface)] hover:-translate-y-1 hover:-translate-x-1 active:translate-x-2 active:translate-y-2 active:shadow-none transition-[box-shadow,translate] duration-150 ease-out">
                        {rule.demo}
                      </div>
                      <p className="font-mono text-xs text-background/40 uppercase">{l.snapNote}</p>
                    </div>
                  </div>
                ) : i === 2 ? (
                  <div className="border-2 border-background/20 bg-background/5 px-2 py-3">
                    <div className="mb-2.5">
                      <span className="mb-1 block font-mono text-xs text-background/50 uppercase">{l.brutal}</span>
                      <div className="group relative h-8 overflow-hidden border-2 border-background/20 bg-background/10">
                        <div className="absolute top-0 bottom-0 left-0 w-full -translate-x-full border-r-2 border-background bg-accent transition-transform duration-150 ease-out group-hover:translate-x-0" />
                      </div>
                    </div>
                    <div>
                      <span className="mb-1 block font-mono text-xs text-background/50 uppercase">{l.spring}</span>
                      <div className="group relative h-8 overflow-hidden border-2 border-background/20 bg-background/10">
                        <div className="absolute top-0 bottom-0 left-0 w-full -translate-x-full border-r-2 border-background/30 bg-background/30 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0" />
                      </div>
                    </div>
                    <p className="mt-1.5 text-center font-mono text-xs text-background/40 uppercase">{l.note}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center border-2 border-background/20 bg-background/5 py-3">
                    <div className="w-full px-2 text-center">
                      <div className="mb-2 cursor-pointer border-4 border-background bg-background p-2.5 text-left text-foreground shadow-[8px_8px_0_0_var(--color-background)] transition-[box-shadow,translate] duration-150 ease-out hover:-translate-y-1 hover:-translate-x-1 hover:bg-accent hover:text-accent-fg hover:shadow-[12px_12px_0_0_var(--color-primary)]">
                        <div className="mb-0.5 text-sm font-black uppercase">{l.cardTitle}</div>
                        <div className="font-mono text-xs text-foreground/60">{l.cardBody}</div>
                      </div>
                      <p className="font-mono text-xs text-background/40 uppercase">{l.cardNote}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function TypeSection({ t }: { t: T }) {
  const ty = t.type;
  const labelCls = "text-label leading-label tracking-label font-label case-label";
  const groups: {
    caption: string;
    rows: { sample: string; spec: string; className: string; stack?: boolean }[];
  }[] = [
    {
      caption: ty.groupDisplay,
      rows: [
        { sample: "headline", spec: "clamp 36–60px / 900", className: "typo-headline", stack: true },
        { sample: "kicker", spec: "26px / 900", className: "typo-kicker" },
      ],
    },
    {
      caption: ty.groupReading,
      rows: [
        { sample: "h1", spec: "30px / 900", className: "typo-h1" },
        { sample: "h2", spec: "24px / 900", className: "typo-h2" },
        { sample: "h3", spec: "22px / 700", className: "typo-h3" },
        { sample: "h4", spec: "20px / 700", className: "typo-h4" },
        { sample: "h5", spec: "18px / 700", className: "typo-h5" },
        { sample: "h6", spec: "16px / 700", className: "typo-h6" },
        { sample: "body", spec: "1rem / 1.625", className: "typo-body" },
      ],
    },
    {
      caption: ty.groupMechanism,
      rows: [
        { sample: "LABEL", spec: "1rem / 900 · 0.1em", className: labelCls },
        { sample: "OVERLINE", spec: "12px / 900", className: "typo-overline" },
        { sample: "code", spec: "0.875rem / mono", className: "font-mono text-sm" },
      ],
    },
  ];
  return (
    <section id="type" className={`${SECTION} bg-background`}>
      <div className="mx-auto max-w-288">
        <SectionHead eyebrow={ty.eyebrow} title={ty.title} lead={ty.lead} accent="var(--color-warning-fg)" />
        <div className="mb-4 grid grid-cols-1 border-4 border-border md:grid-cols-2">
          <div className="border-border p-3 md:border-r-4 md:p-5">
            <p className="mb-3 border-b-2 border-border pb-1 typo-overline">{ty.ladder}</p>
            <div className="space-y-5">
              {groups.map(({ caption, rows }) => (
                <div key={caption} className="space-y-3">
                  <p className={labelCls}>{caption}</p>
                  {rows.map(({ sample, spec, className, stack }) => (
                    <div
                      key={sample}
                      className={stack ? "flex flex-col gap-1" : "flex flex-wrap items-baseline justify-between gap-x-2"}
                    >
                      <span className={className}>{sample}</span>
                      <span className="shrink-0 font-mono text-xs text-foreground">{spec}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 md:p-5">
            <p className="mb-3 border-b-2 border-border pb-1 typo-overline">{ty.prose}</p>
            <div className="typography max-w-[40em] [&_p]:mt-4 [&_h2]:mt-7 [&_h3]:mt-6 [&_ul]:mt-4 [&_blockquote]:mt-5 [&_li+li]:mt-2 [&>:first-child]:mt-0">
              <h2>{ty.essayTitle}</h2>
              <p>{ty.p1}</p>
              <p>{ty.p2}</p>
              <h3>{ty.h3}</h3>
              <p>
                {ty.p3a}
                <code>--leading-body</code>
                {ty.p3b}
              </p>
              <ul>
                <li>{ty.listA}</li>
                <li>{ty.listB}</li>
                <li>{ty.listC}</li>
              </ul>
              <blockquote>{ty.quote}</blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function RulesSection({ t }: { t: T }) {
  const r = t.rules;
  return (
    <section id="rules" className={`${SECTION} bg-background`}>
      <div className="mx-auto max-w-288">
        <SectionHead eyebrow={r.eyebrow} title={r.title} lead={r.lead} accent="var(--color-primary)" />
        <div className="mb-4 grid grid-cols-1 gap-0 border-4 border-border md:grid-cols-3">
          {r.principles.map((p, i) => (
            <div
              key={p.n}
              className={`border-border ${i % 3 !== 2 ? "md:border-r-4" : ""} ${i < 3 ? "md:border-b-4" : ""} ${i < 5 ? "max-md:border-b-4" : ""}`}
            >
              <div
                className="bg-background p-3 md:p-4"
              >
                <div className="mb-2 text-5xl leading-none font-black md:text-6xl">
                  {p.n}
                </div>
                <h3 className="mb-2 text-xl font-black tracking-tight uppercase md:text-2xl">{p.title}</h3>
                <p className="font-mono text-sm leading-relaxed text-foreground">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-0 border-4 border-border md:grid-cols-2">
          <div className="border-border p-3 md:border-r-4 md:p-5">
            <div className="mb-3 flex items-center gap-1.5 border-b-4 border-border pb-2">
              <div className="flex size-8 items-center justify-center border-4 border-border bg-surface">
                <Check className="size-4" />
              </div>
              <h3 className="text-lg font-black tracking-widest uppercase">{r.doTitle}</h3>
            </div>
            <ul className="space-y-3">
              {r.do.map((item) => (
                <li key={item} className="flex items-start gap-1.5 font-mono text-sm leading-relaxed">
                  <span className="mt-0.75 size-2 shrink-0 border-2 border-border bg-surface" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-3 md:p-5 max-md:border-t-4 max-md:border-border">
            <div className="mb-3 flex items-center gap-1.5 border-b-4 border-border pb-2">
              <div className="flex size-8 items-center justify-center border-4 border-border bg-primary text-background">
                <X className="size-4" />
              </div>
              <h3 className="text-lg font-black tracking-widest uppercase">{r.dontTitle}</h3>
            </div>
            <ul className="space-y-3">
              {r.dont.map((item) => (
                <li key={item} className="flex items-start gap-1.5 font-mono text-sm leading-relaxed">
                  <span className="mt-0.75 size-2 shrink-0 border-2 border-border bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
function ClosingSection({ t }: { t: T }) {
  const c = t.closing;
  const icons = [Star, Hash, FileCode, Globe, PanelLeft, Settings];
  return (
    <section className={`border-b-4 border-border bg-primary ${SECTION}`}>
      <div className="mx-auto max-w-288">
        <div className="mb-1">
          <span className={`${EYEBROW} text-background`}>{c.eyebrow}</span>
          <h2 className={`${HEADLINE} mb-1 text-background`}>{c.title}</h2>
        </div>
        <div className="mb-6">
          <p className={`max-w-168 ${LEAD} text-background/80`}>{c.lead}</p>
        </div>
        <div className="grid grid-cols-1 gap-0 border-4 border-border sm:grid-cols-2 md:grid-cols-3">
          {c.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <div key={card.title}>
                <div
                  className={`h-full border-border bg-background p-3 md:p-4 ${
                    [
                      i < 5 ? "border-b-4" : "",
                      i % 2 === 0 ? "sm:border-r-4" : "",
                      i % 3 !== 2 ? "md:border-r-4" : "md:border-r-0",
                      i < 4 ? "sm:border-b-4" : "sm:border-b-0",
                      i < 3 ? "md:border-b-4" : "md:border-b-0",
                    ].filter(Boolean).join(" ")
                  }`}
                >
                  <div className="mb-2.5 flex size-12 items-center justify-center border-4 border-border text-foreground md:size-14">
                    <Icon className="size-6" />
                  </div>
                  <h4 className="mb-1.5 text-sm font-black tracking-tight uppercase md:text-base">
                    {card.title}
                  </h4>
                  <p className="font-mono text-xs leading-relaxed text-foreground md:text-sm">
                    {card.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function SiteFooter({ t, lang }: { t: T; lang: Lang }) {
  const { buttonVariants, cn } = useSiteSkin();
  return (
    <footer className="border-t-0 bg-foreground text-background">
      <div className="flex h-3">
        <div className="flex-1" style={{ backgroundColor: PINK }} />
        <div className="flex-1" style={{ backgroundColor: GREEN }} />
        <div className="flex-1" style={{ backgroundColor: YELLOW }} />
      </div>
      <div className="mx-auto max-w-288 px-2 pt-6 pb-5 md:px-4 md:pt-8 md:pb-7">
        <div className="mb-6 flex flex-col items-start justify-between gap-5 border-b-4 border-background/20 pb-6 md:flex-row">
          <div className="flex max-w-96 flex-col gap-2.5">
            <div className="flex items-center gap-0 self-start border-2 border-background">
              <div className="bg-background px-1.5 py-1 text-base font-black tracking-widest text-foreground uppercase">
                {t.brand[0]}
              </div>
              <div className="bg-primary px-1.5 py-1 text-base font-black tracking-widest text-primary-fg uppercase">
                {t.brand[1]}
              </div>
            </div>
            <p className="font-mono text-sm leading-relaxed text-background/60">{t.footer.desc}</p>
            <div className="flex gap-1">
              {[PINK, GREEN, YELLOW].map((color) => (
                <div
                  key={color}
                  className="size-5 border-2 border-background"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <nav className="flex flex-col gap-1.5">
            <Link
              to={`/neo/${lang}/docs`}
              className="text-xs font-black tracking-widest text-background/70 uppercase transition-colors duration-150 hover:text-foreground"
            >
              {t.footer.docs}
            </Link>
            <Link
              to={`/neo/${lang}/docs/styles`}
              className="text-xs font-black tracking-widest text-background/70 uppercase transition-colors duration-150 hover:text-foreground"
            >
              {t.footer.styles}
            </Link>
            <Link
              to={`/neo/${lang}/docs/installation`}
              className="text-xs font-black tracking-widest text-background/70 uppercase transition-colors duration-150 hover:text-foreground"
            >
              {t.footer.install}
            </Link>
            <a
              href={`/${lang}/showcase/minimal`}
              className="text-xs font-black tracking-widest text-background/70 uppercase transition-colors duration-150 hover:text-foreground"
            >
              Minimal
            </a>
          </nav>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <p className="font-mono text-xs text-background/40">{t.footer.rights}</p>
          <Link
            to={`/neo/${lang === "zh" ? "en" : "zh"}/showcase/neo-brutalist`}
            className={cn(buttonVariants.outline, `${TOOL_CLASS} py-1.5`)}
          >
            <ArrowLeft />
            {lang === "zh" ? "English" : "中文"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
