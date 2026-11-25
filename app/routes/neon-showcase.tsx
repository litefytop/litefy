import type { LinksFunction, MetaFunction } from "react-router";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import neonShowcaseHref from "./neon-showcase.css?url";
import { AnimatedContent, Button, Card, NavBar } from "@/ui/skins";
import { buttonVariants, chipBase, chipVariants, cn } from "@/ui/skins";
import { ShaderBackground } from "../components/shader-background";
import { AppearancePanel } from "../components/appearance-panel";
import { StyleMenu } from "../components/style-select";
import { BareNotFound } from "../components/bare-not-found";
import { SiteSkinProvider } from "@/components/site-skin";
import { siteSkin } from "@/components/site-skin-bundle";
import { findStyleTemplate } from "../lib/style-templates";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  House,
  Languages,
  Letters,
  Printer,
  Sparkles,
  Sun,
  SwatchBook,
  X,
} from "@/components/icons";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: neonShowcaseHref }];

type Lang = "zh" | "en";

const tpl = findStyleTemplate("neon-gradient");

export const meta: MetaFunction = ({ params }) => {
  const lang = params.lang === "zh" ? "zh" : "en";
  const name = lang === "zh" ? `${tpl?.name.zh}方案` : `${tpl?.name.en} Style`;
  return [{ title: `${name} — Litefy UI` }, { name: "robots", content: "noindex" }];
};

const SECTION = "scroll-mt-16 border-b-control border-border px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20";
const CONTAINER = "mx-auto w-full max-w-320";
const EYEBROW = "typo-overline";
const HEADLINE = "text-h2 leading-head tracking-tight font-black";
const LEAD = "max-w-[40em] text-base leading-body";
const textLinkClass = cn(buttonVariants.text, "px-3", "text-inherit");

const TOKENS: { token: string; zh: string; en: string }[] = [
  { token: "--background", zh: "页面画布", en: "Page canvas" },
  { token: "--foreground", zh: "正文文字", en: "Body text" },
  { token: "--surface", zh: "次要容器", en: "Secondary surface" },
  { token: "--surface-fg", zh: "表面文字", en: "Surface text" },
  { token: "--accent", zh: "强调背景", en: "Accent fill" },
  { token: "--accent-fg", zh: "强调文字", en: "Accent text" },
  { token: "--border", zh: "边框描边", en: "Border stroke" },
  { token: "--primary", zh: "品牌色", en: "Brand" },
  { token: "--primary-fg", zh: "品牌文字", en: "Brand text" },
  { token: "--primary-accent", zh: "品牌悬停档", en: "Brand hover" },
  { token: "--danger", zh: "危险静置", en: "Danger rest" },
  { token: "--danger-fg", zh: "危险文字", en: "Danger text" },
  { token: "--danger-accent", zh: "危险悬停", en: "Danger hover" },
  { token: "--info", zh: "信息静置", en: "Info rest" },
  { token: "--info-fg", zh: "信息文字", en: "Info text" },
  { token: "--info-accent", zh: "信息悬停", en: "Info hover" },
  { token: "--success", zh: "成功静置", en: "Success rest" },
  { token: "--success-fg", zh: "成功文字", en: "Success text" },
  { token: "--success-accent", zh: "成功悬停", en: "Success hover" },
  { token: "--warning", zh: "警示静置", en: "Warning rest" },
  { token: "--warning-fg", zh: "警示文字", en: "Warning text" },
  { token: "--warning-accent", zh: "警示悬停", en: "Warning hover" },
];

const FILLS: { name: string; zh: string; en: string }[] = [
  { name: "primary", zh: "品牌循环色流", en: "Brand cyclic flow" },
  { name: "primary-accent", zh: "品牌悬停色流", en: "Brand hover flow" },
  { name: "surface", zh: "表面斜向渐变", en: "Surface diagonal" },
  { name: "accent", zh: "强调斜向渐变", en: "Accent diagonal" },
  { name: "danger", zh: "危险家族渐变", en: "Danger family" },
  { name: "success", zh: "成功家族渐变", en: "Success family" },
  { name: "warning", zh: "警示家族渐变", en: "Warning family" },
  { name: "info", zh: "信息家族渐变", en: "Info family" },
];

const COPY: Record<
  Lang,
  {
    brand: string;
    home: string;
    docs: string;
    nav: { palette: string; laws: string; type: string; rules: string; more: string };
    hero: {
      eyebrow: string;
      cta1: string;
      cta2: string;
      stats: [string, string][];
    };
    palette: {
      eyebrow: string;
      title: string;
      lead: string;
      pairs: string;
      pairLabels: [string, string][];
      fills: string;
    };
    laws: {
      eyebrow: string;
      title: string;
      lead: string;
      items: { tag: string; code: string; desc: string }[];
      hoverDemo: string;
      hoverNote: string;
      pressDemo: string;
      pressNote: string;
      focusDemo: string;
      focusDangerDemo: string;
      focusNote: string;
      glowBrand: string;
      glowBlock: string;
      glowNote: string;
      calmTrack: string;
      bounceTrack: string;
      trackNote: string;
    };
    type: {
      eyebrow: string;
      title: string;
      lead: string;
      ladder: string;
      groupDisplay: string;
      groupReading: string;
      groupMechanism: string;
      prose: string;
      essayTitle: string;
      p1: string;
      p2: string;
      h3: string;
      p3a: string;
      p3b: string;
      listA: string;
      listB: string;
      listC: string;
      quote: string;
    };
    rules: {
      eyebrow: string;
      title: string;
      lead: string;
      principles: { n: string; title: string; body: string }[];
      doTitle: string;
      dontTitle: string;
      do: string[];
      dont: string[];
    };
    closing: {
      eyebrow: string;
      title: string;
      lead: string;
      cards: { title: string; body: string }[];
    };
    footer: { tagline: string; docs: string; styles: string; install: string; rights: string };
  }
> = {
  zh: {
    brand: "NEON",
    home: "主页",
    docs: "文档",
    nav: { palette: "色盘", laws: "交互", type: "排版", rules: "规则", more: "导航" },
    hero: {
      eyebrow: "// 风格方案 · 霓虹渐变",
      cta1: "查看组件",
      cta2: "阅读文档",
      stats: [
        ["4px", "描边宽度"],
        ["12px", "圆角半径"],
        ["500ms", "色流时长"],
        ["22", "语义令牌"],
      ],
    },
    palette: {
      eyebrow: "01 — 色盘",
      title: "颜色与填充",
      lead: "浅紫画布配粉彩表面，深蓝画布配霓虹表面。22 枚语义令牌亮暗各一套，色块实时读取当前档的令牌值——切换外观，整页重绘。下方填充带直接展示八族渐变：渐变是这套方案的身份，不是装饰。",
      pairs: "前景 / 背景对比对",
      pairLabels: [
        ["品牌文字 压 品牌色", "primary-fg / primary"],
        ["正文 压 画布", "foreground / background"],
        ["次级文字 压 表面", "surface-fg / surface"],
        ["强调文字 压 强调背景", "accent-fg / accent"],
      ],
      fills: "渐变填充车道",
    },
    laws: {
      eyebrow: "02 — 交互法则",
      title: "色流的手感",
      lead: "四条法则定义这套方案的手感：色流滑过、按压内亮、焦点带晕、光晕随档。每条都有可玩的演示——悬停、按下、Tab 聚焦，用手感记住它们。",
      items: [
        {
          tag: "法则 01 — 色流悬停",
          code: "hover:bg-primary-accent motion-frame · 500ms",
          desc: "品牌件悬停时循环渐变从 0% 滑到 100%，500ms ease-out。不位移、不缩放——流动的是颜色，不是盒子。",
        },
        {
          tag: "法则 02 — 按压电激活",
          code: "active:shadow-frame-active · box-shadow 0ms",
          desc: "内阴影与外光晕的 inset 属性不同、无法插值，所以按压件的 box-shadow 时长答 0：按下即亮、松开即灭。暗档内白、浅档内紫；lift 与 crush 显式答 0，位移通道关闭。",
        },
        {
          tag: "法则 03 — 焦点光晕环",
          code: "focus-visible:focus-ring / focus-ring-danger",
          desc: "2px 青色实线环加同族光晕，offset 2px；危险件转 rose 同形。焦点只换形态，从不移除。",
        },
        {
          tag: "法则 04 — 家族光晕随档",
          code: "hover:shadow-frame-hover / shadow-block-hover",
          desc: "悬停加深同族光晕：暗档霓虹外发光，浅档同族柔影。光晕颜色永远来自控件自己的家族，不借族。",
        },
      ],
      hoverDemo: "悬停我",
      hoverNote: "渐变滑过 500ms——盒子不动",
      pressDemo: "按住我",
      pressNote: "按下即亮、松开即灭——位移恒 0",
      focusDemo: "聚焦我",
      focusDangerDemo: "危险件",
      focusNote: "按 Tab 键查看光晕环——青 / rose 两族",
      glowBrand: "品牌件",
      glowBlock: "表面块",
      glowNote: "悬停两件——光晕各自加深，颜色不借族",
      calmTrack: "neon · 500ms ease-out 色流",
      bounceTrack: "linear 匀速（此处禁止）",
      trackNote: "指针划过轨道——感受缓出与匀速的差别",
    },
    type: {
      eyebrow: "03 — 排版",
      title: "排版系统",
      lead: "Segoe UI 字族配 JetBrains Mono 标签。标题 900 黑度、行高 1.15，正文 1.7——霓虹要够黑才压得住光。字阶与长文作用域由方案持有，页面不逐元素写类。",
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
      eyebrow: "04 — 设计规则",
      title: "七条识别点",
      lead: "每条识别点都是方案强制执行的令牌或属性，而不是风格手册里的口头约定——换方案，规则就换。",
      principles: [
        { n: "01", title: "双档画布", body: "浅档浅紫画布配粉彩表面与 700 深度动作渐变，暗档深蓝画布配霓虹表面。两档各自手工调校，切换整页重绘。" },
        { n: "02", title: "渐变填充车道", body: "bg-* 同构填充：实色背景色兜底，加 var(--fill-*) 渐变图。八族各有循环渐变，悬停档答同族反向。" },
        { n: "03", title: "4px 对比边框", body: "control / hair / frame 三档线宽同答 4px：浅档 amber-700、暗档 yellow-400。边框是对比件，不是发丝。" },
        { n: "04", title: "家族光晕随档", body: "阴影角色按档回答：暗档霓虹外发光，浅档同族柔影。光晕颜色取自控件家族，不借族、不发灰。" },
        { n: "05", title: "大圆角", body: "按钮 12px、卡片 16px、外壳 24px，pill 与 disc 全圆。直角在这套方案里没有位置。" },
        { n: "06", title: "大写标签与 mono", body: "标签档 0.875rem / 800 / 0.08em 大写，字族 JetBrains Mono——控件文字自带仪器感。" },
        { n: "07", title: "色流不位移", body: "悬停与按压只动颜色、background-position 与阴影；lift / crush 显式答 0。盒子永远不动。" },
      ],
      doTitle: "要做",
      dontTitle: "别做",
      do: [
        "border-control border-border——4px 对比描边",
        "rounded-lg / rounded-pill——大圆角与全圆",
        "hover:bg-primary-accent——循环色流 500ms",
        "active:shadow-frame-active——按压内亮",
        "focus-visible:focus-ring——青色光晕焦点环",
        "hover:shadow-frame-hover——同族光晕加深",
        "bg-<status> text-<status>-fg——状态色成套取用",
        "max-w-[40em]——正文阅读行宽",
      ],
      dont: [
        "rounded-none——直角",
        "border / border-2——细边框",
        "bg-gray-* 灰卡——无家族灰面",
        "渐变文字——渐变只铺面不铺字",
        "纯色家族填充——跳过填充车道",
        "浅档饱和霓虹——浅档只答粉彩与柔影",
        "hover:-translate-y-1——悬停位移",
        "linear 匀速色流——只允许 ease-out / ease-frame",
      ],
    },
    closing: {
      eyebrow: "// 为什么选 neon",
      title: "为夜色与舞台而生",
      lead: "控制台、创作工具与任何想被记住的界面：霓虹渐变给身份、给反馈、给层级，同时两档都守对比下限。六个理由。",
      cards: [
        { title: "双档成立", body: "浅紫与深蓝两套令牌各自手工调校，切换外观整页重绘，一次呈现一档。" },
        { title: "渐变即身份", body: "八族循环渐变铺满表面与控件，一眼认出这套方案——渐变是结构，不是贴纸。" },
        { title: "光晕建层级", body: "暗档外发光、浅档同族柔影，深度靠光不靠灰；浮层光晕最强，静置最弱。" },
        { title: "色流反馈", body: "悬停 500ms 色流滑过、按压内阴影点亮——每次操作都有光回应，盒子却始终不动。" },
        { title: "AA 换深度", body: "浅档动作渐变取 700 深度配白字，暗档霓虹配深字——字色深度随档交换，两档都过 4.5:1 对比下限。" },
        { title: "打印恒白", body: "打印车道接管 color-scheme，纸面恒白底黑字——霓虹留在屏幕里。" },
      ],
    },
    footer: {
      tagline: "风格方案是一份 CSS 包，不是一个配置文件。",
      docs: "介绍",
      styles: "样式",
      install: "安装",
      rights: "Litefy UI — 本页观感全部由 neon-gradient 方案自身令牌渲染。",
    },
  },
  en: {
    brand: "NEON",
    home: "Home",
    docs: "Docs",
    nav: { palette: "Palette", laws: "Interaction", type: "Type", rules: "Rules", more: "Navigate" },
    hero: {
      eyebrow: "// style scheme · neon gradient",
      cta1: "View components",
      cta2: "Read the docs",
      stats: [
        ["4px", "Stroke width"],
        ["12px", "Corner radius"],
        ["500ms", "Colour flow"],
        ["22", "Semantic tokens"],
      ],
    },
    palette: {
      eyebrow: "01 — Palette",
      title: "Colour and fill",
      lead: "A pale-purple canvas with pastel surfaces, a deep-blue canvas with neon surfaces. Twenty-two semantic tokens, one authored set per tier — every swatch reads the live token value, so switching appearance repaints the whole page. The fill band below shows the eight gradient families directly: gradient is this scheme's identity, not decoration.",
      pairs: "Foreground / background pairs",
      pairLabels: [
        ["Brand text on brand", "primary-fg / primary"],
        ["Body on canvas", "foreground / background"],
        ["Secondary on surface", "surface-fg / surface"],
        ["Accent text on accent", "accent-fg / accent"],
      ],
      fills: "Gradient fill lane",
    },
    laws: {
      eyebrow: "02 — Interaction laws",
      title: "The feel of the flow",
      lead: "Four laws define how this scheme feels: colour flows, press lights inward, focus carries a halo, glows ride their family per tier. Each has a playable demo — hover, press, Tab through them.",
      items: [
        {
          tag: "Law 01 — Hover flows colour",
          code: "hover:bg-primary-accent motion-frame · 500ms",
          desc: "On hover the cyclic gradient slides from 0% to 100% over 500ms ease-out. No movement, no scaling — what flows is colour, not the box.",
        },
        {
          tag: "Law 02 — Press lights inward",
          code: "active:shadow-frame-active · box-shadow 0ms",
          desc: "Inset press light and outer glow differ in inset-ness and cannot interpolate, so the press piece answers box-shadow 0ms: lit on press, out on release. Inner white on dark, inner purple on light; lift and crush explicitly answer 0 — the displacement channel stays closed.",
        },
        {
          tag: "Law 03 — The haloed focus ring",
          code: "focus-visible:focus-ring / focus-ring-danger",
          desc: "A 2px solid cyan outline plus a same-family glow, offset 2px; danger controls switch to rose in the same shape. Focus is restyled, never removed.",
        },
        {
          tag: "Law 04 — Family glows per tier",
          code: "hover:shadow-frame-hover / shadow-block-hover",
          desc: "Hover deepens the same-family glow: neon emission on dark, soft same-family shadow on light. The glow colour always comes from the control's own family — never borrowed.",
        },
      ],
      hoverDemo: "Hover me",
      hoverNote: "Gradient slides over 500ms — the box stays put",
      pressDemo: "Press me",
      pressNote: "Lit on press, out on release — displacement stays 0",
      focusDemo: "Focus me",
      focusDangerDemo: "Danger",
      focusNote: "Press Tab to see the halo ring — cyan / rose families",
      glowBrand: "Brand piece",
      glowBlock: "Surface block",
      glowNote: "Hover both — each glow deepens in its own family",
      calmTrack: "neon · 500ms ease-out flow",
      bounceTrack: "linear constant speed (forbidden here)",
      trackNote: "Hover a track — ease-out against constant speed",
    },
    type: {
      eyebrow: "03 — Type",
      title: "Type system",
      lead: "A Segoe UI family with JetBrains Mono labels. Headings at 900 weight and 1.15 line height, body at 1.7 — neon needs enough black to hold the light down. The ladder and the reading scope belong to the scheme; the page writes none of it.",
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
      eyebrow: "04 — Design rules",
      title: "Seven identity marks",
      lead: "Every mark is a token or attribute the scheme enforces — not a note in a style guide. Change the scheme, change the rule.",
      principles: [
        { n: "01", title: "Two authored canvases", body: "Light answers a pale-purple canvas with pastel surfaces and 700-depth action gradients; dark answers a deep-blue canvas with neon surfaces. Both tiers hand-tuned, the whole page repaints on switch." },
        { n: "02", title: "Gradient fill lane", body: "Isomorphic bg-* fills: a solid background-color fallback plus a var(--fill-*) gradient image. Eight families each carry a cyclic gradient; hover steps answer the same family reversed." },
        { n: "03", title: "4px contrast borders", body: "control / hair / frame all answer 4px: amber-700 on light, yellow-400 on dark. The border is a contrast piece, not a hairline." },
        { n: "04", title: "Family glows per tier", body: "Shadow roles answer per tier: neon emission on dark, soft same-family shadow on light. Glow colour comes from the control's family — never borrowed, never gray." },
        { n: "05", title: "Large rounding", body: "Buttons 12px, cards 16px, shells 24px; pills and discs fully round. Square corners have no place in this scheme." },
        { n: "06", title: "Uppercase mono labels", body: "The label tier is 0.875rem / 800 / 0.08em uppercase in JetBrains Mono — control text with an instrument feel." },
        { n: "07", title: "Flow without movement", body: "Hover and press only touch colour, background-position and shadow; lift / crush explicitly answer 0. The box never moves." },
      ],
      doTitle: "DO",
      dontTitle: "DON'T",
      do: [
        "border-control border-border — 4px contrast strokes",
        "rounded-lg / rounded-pill — large rounding and full rounds",
        "hover:bg-primary-accent — cyclic colour flow over 500ms",
        "active:shadow-frame-active — press lights inward",
        "focus-visible:focus-ring — cyan haloed focus ring",
        "hover:shadow-frame-hover — same-family glow deepens",
        "bg-<status> text-<status>-fg — status colours taken as sets",
        "max-w-[40em] — the reading line width",
      ],
      dont: [
        "rounded-none — square corners",
        "border / border-2 — thin borders",
        "bg-gray-* gray cards — family-less gray surfaces",
        "gradient text — gradients fill surfaces, never glyphs",
        "solid family fills — skipping the fill lane",
        "saturated neon on light — light answers pastels and soft shadows",
        "hover:-translate-y-1 — hover displacement",
        "linear constant-speed flow — ease-out / ease-frame or nothing",
      ],
    },
    closing: {
      eyebrow: "// Why neon",
      title: "Built for night and stage",
      lead: "Consoles, creative tools and any interface that wants to be remembered: neon gradient gives identity, feedback and depth while both tiers hold the contrast floor. Six reasons.",
      cards: [
        { title: "Two tiers stand", body: "Pale purple and deep blue are hand-tuned token sets; toggling appearance repaints the whole page, one tier at a time." },
        { title: "Gradient is identity", body: "Eight cyclic gradient families fill surfaces and controls — one glance recognises the scheme. Gradient is structure, not a sticker." },
        { title: "Glows build depth", body: "Emission on dark, soft same-family shadow on light: depth rides light, not gray. Overlays glow strongest, rest glows least." },
        { title: "Flow as feedback", body: "Hover slides colour over 500ms, press lights an inset shadow — every action gets light in response while the box never moves." },
        { title: "AA by depth swap", body: "Light action gradients take 700 depth with white ink; dark neon takes deep ink — ink depth swaps with the tier and both tiers clear the 4.5:1 floor." },
        { title: "Print stays white", body: "The print lane takes over color-scheme: paper output is always white with black ink — the neon stays on screen." },
      ],
    },
    footer: {
      tagline: "A style scheme is a CSS package, not a config file.",
      docs: "Introduction",
      styles: "Styles",
      install: "Installation",
      rights: "Litefy UI — this page is rendered entirely from the neon-gradient scheme's own tokens.",
    },
  },
};

type T = (typeof COPY)["zh"];

const NAV_ANCHORS = ["palette", "laws", "type", "rules"] as const;

export default function NeonShowcaseRoute() {
  return (
    <SiteSkinProvider skin={siteSkin}>
      <NeonShowcasePage />
    </SiteSkinProvider>
  );
}

function NeonShowcasePage() {
  const { lang, slug } = useParams<{ lang?: string; slug?: string }>();
  if (slug !== "neon-gradient") return <BareNotFound />;
  const normalized: Lang = lang === "zh" ? "zh" : "en";
  const t = COPY[normalized];
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader t={t} lang={normalized} />
      <main className="flex flex-1 flex-col">
        <Hero t={t} lang={normalized} />
        <PaletteBlock t={t} lang={normalized} />
        <LawsBlock t={t} />
        <TypeBlock t={t} />
        <RulesBlock t={t} />
        <ClosingBlock t={t} />
      </main>
      <SiteFooter t={t} lang={normalized} />
    </div>
  );
}

function SiteHeader({ t, lang }: { t: T; lang: Lang }) {
  const navigate = useNavigate();
  const location = useLocation();
  const otherLang = lang === "zh" ? "en" : "zh";
  const switchLang = () => {
    navigate(
      `${location.pathname.replace(/^\/neon\/(en|zh)/u, `/neon/${otherLang}`)}${location.hash}${location.search}`,
    );
  };
  return (
    <header className="sticky top-0 z-40 border-b-control border-border bg-surface text-surface-fg">
      <div className="flex h-14 items-center gap-2 px-4 md:px-6 lg:px-8">
        <Link
          to={`/neon/${lang}/docs`}
          className="flex shrink-0 items-center gap-2 no-underline"
          title={t.docs}
        >
          <span className="flex size-8 items-center justify-center bg-primary text-sm font-black text-primary-fg">
            N
          </span>
          <span className="control-label text-sm text-surface-fg max-sm:hidden">
            {t.brand}
          </span>
        </Link>
        <NavBar
          items={[...NAV_ANCHORS]}
          getKey={(id) => id}
          more={t.nav.more}
          renderItem={(id) => (
            <a href={`#${id}`} className={textLinkClass}>
              {t.nav[id]}
            </a>
          )}
        />
        <div className="ms-auto flex shrink-0 items-center gap-1">
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
            to={`/${lang}`}
            aria-label={t.home}
            title={t.home}
            data-pure-icon="true"
            className={cn(buttonVariants.outline, "pure-icon", "shrink-0")}
          >
            <House className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero({ t, lang }: { t: T; lang: Lang }) {
  return (
    <section className="relative overflow-hidden border-b-control border-border bg-surface px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20 text-surface-fg">
      <div className="absolute inset-0" aria-hidden="true">
        <ShaderBackground />
      </div>
      <div className={cn(CONTAINER, "relative flex flex-col gap-8")}>
        <div className="flex flex-col gap-3">
          <p className="typo-kicker">{t.hero.eyebrow}</p>
          <h1 className="typo-headline">{lang === "zh" ? tpl?.name.zh : tpl?.name.en}</h1>
          <p className={LEAD}>{lang === "zh" ? tpl?.desc.zh : tpl?.desc.en}</p>
          <div className="flex flex-wrap gap-2">
            <Link to={`/neon/${lang}/docs/overview`} className={buttonVariants.primary}>
              {t.hero.cta1}
              <ArrowRight aria-hidden />
            </Link>
            <Link to={`/neon/${lang}/docs`} className={buttonVariants.outline}>
              {t.hero.cta2}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 border-t-control border-border md:grid-cols-4">
          {t.hero.stats.map(([value, label], i) => (
            <div
              key={label}
              className={cn(
                "border-border p-4",
                i < 3 && "md:border-r-control",
                i % 2 === 0 && "max-md:border-r-control",
                i < 2 && "max-md:border-b-control",
              )}
            >
              <div className="text-3xl font-black tabular-nums">{value}</div>
              <div className={cn(EYEBROW, "mt-1")}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  lead,
  onSurface,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  onSurface?: boolean;
}) {
  const sub = onSurface ? "text-surface-fg" : "text-foreground";
  return (
    <div className="flex flex-col gap-2">
      <p className={cn(EYEBROW, sub)}>{eyebrow}</p>
      <h2 className={cn(HEADLINE, sub)}>{title}</h2>
      <p className={cn(LEAD, sub)}>{lead}</p>
    </div>
  );
}

function PaletteBlock({ t, lang }: { t: T; lang: Lang }) {
  const p = t.palette;
  const pairs = [
    "bg-primary text-primary-fg",
    "bg-background text-foreground",
    "bg-surface text-surface-fg",
    "bg-accent text-accent-fg",
  ];
  return (
    <section id="palette" className={SECTION}>
      <AnimatedContent className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TOKENS.map(({ token, ...roles }) => (
            <div
              key={token}
              className="overflow-hidden rounded-md border-control border-border bg-background"
            >
              <div
                className="h-14 border-b-control border-border"
                style={{ backgroundColor: `var(${token})` }}
              />
              <div className="flex flex-col gap-0.5 p-2">
                <code className="truncate font-mono text-xs">{token}</code>
                <span className="text-xs text-foreground">{roles[lang]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold">{p.pairs}</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {pairs.map((pair, i) => (
              <div
                key={pair}
                className={cn("rounded-md border-control border-border p-4", pair)}
              >
                <div className="text-2xl font-black">Aa</div>
                <div className="mt-1 font-mono text-xs">{p.pairLabels[i][1]}</div>
                <div className="text-xs">{p.pairLabels[i][0]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold">{p.fills}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FILLS.map(({ name, ...roles }) => (
              <div
                key={name}
                className="overflow-hidden rounded-md border-control border-border bg-background"
              >
                <div
                  className="h-14 border-b-control border-border"
                  style={{
                    backgroundColor: `var(--color-${name})`,
                    backgroundImage: `var(--fill-${name})`,
                  }}
                />
                <div className="flex flex-col gap-0.5 p-2">
                  <code className="truncate font-mono text-xs">--fill-{name}</code>
                  <span className="text-xs text-foreground">{roles[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}

const DEMO_BRAND =
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-pill border-control border-border bg-primary px-6 " +
  "control-text text-primary-fg shadow-frame motion-frame " +
  "hover:bg-primary-accent hover:shadow-frame-hover focus-visible:focus-ring";

/* Inset press light cannot interpolate against the outer glow, so the press
   piece keeps the 500ms colour flow but answers box-shadow 0ms: lit on press,
   out on release, with no half-duration discrete flip in between. */
const DEMO_PRESS =
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-pill border-control border-border bg-primary px-6 " +
  "control-text text-primary-fg shadow-frame " +
  "[transition-property:color,background-color,border-color,background-position,box-shadow] " +
  "[transition-duration:300ms,300ms,300ms,500ms,0ms] ease-frame " +
  "hover:bg-primary-accent hover:shadow-frame-hover active:shadow-frame-active focus-visible:focus-ring";

function FlowTrack({ linear, label }: { linear?: boolean; label: string }) {
  return (
    <div>
      <span className="mb-1 block font-mono text-xs text-foreground">{label}</span>
      <div className="group relative h-8 overflow-hidden rounded-md border-control border-border bg-background">
        <div
          className={cn(
            "absolute inset-0 [background-position:0%_50%] transition-[background-position] duration-500 group-hover:[background-position:100%_50%]",
            linear ? "[transition-timing-function:linear]" : "ease-out",
          )}
          style={{ backgroundImage: "var(--fill-primary)", backgroundSize: "200% auto" }}
        />
      </div>
    </div>
  );
}

function LawsBlock({ t }: { t: T }) {
  const l = t.laws;
  return (
    <section id="laws" className={cn(SECTION, "bg-surface text-surface-fg")}>
      <AnimatedContent className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={l.eyebrow} title={l.title} lead={l.lead} onSurface />
        <div className="grid gap-4 md:grid-cols-2">
          {l.items.map((item, i) => (
            <Card key={item.tag} className="h-full">
              <div className="flex items-center gap-2">
                <span className={cn(chipBase, chipVariants.primary)}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-bold text-surface-fg">{item.tag}</h3>
              </div>
              <p className="font-mono text-xs break-all text-surface-fg">{item.code}</p>
              <p className="text-sm text-surface-fg">{item.desc}</p>
              <div className="flex flex-col items-center gap-2 rounded-lg border-control border-border bg-background p-4 text-foreground">
                {i === 0 && (
                  <>
                    <button type="button" className={DEMO_BRAND}>
                      {l.hoverDemo}
                    </button>
                    <p className="text-xs text-foreground">{l.hoverNote}</p>
                    <div className="flex w-full flex-col gap-3">
                      <FlowTrack label={l.calmTrack} />
                      <FlowTrack linear label={l.bounceTrack} />
                      <p className="text-center text-xs text-foreground">{l.trackNote}</p>
                    </div>
                  </>
                )}
                {i === 1 && (
                  <>
                    <button
                      type="button"
                      className={DEMO_PRESS}
                    >
                      {l.pressDemo}
                    </button>
                    <p className="text-xs text-foreground">{l.pressNote}</p>
                  </>
                )}
                {i === 2 && (
                  <>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-pill border-control border-border bg-background px-6 text-xs font-bold text-foreground focus-visible:focus-ring"
                      >
                        {l.focusDemo}
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-pill border-control border-border bg-danger px-6 text-xs font-bold text-danger-fg focus-visible:focus-ring-danger"
                      >
                        {l.focusDangerDemo}
                      </button>
                    </div>
                    <p className="text-xs text-foreground">{l.focusNote}</p>
                  </>
                )}
                {i === 3 && (
                  <>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        className={cn(DEMO_BRAND, "hover:bg-primary")}
                      >
                        {l.glowBrand}
                      </button>
                      <div className="rounded-lg border-control border-border bg-surface px-4 py-2 text-xs font-bold text-surface-fg shadow-block transition-shadow duration-frame ease-frame hover:shadow-block-hover">
                        {l.glowBlock}
                      </div>
                    </div>
                    <p className="text-xs text-foreground">{l.glowNote}</p>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </AnimatedContent>
    </section>
  );
}

function TypeBlock({ t }: { t: T }) {
  const ty = t.type;
  const labelCls = "control-text";
  const groups: {
    caption: string;
    rows: { sample: string; spec: string; className: string; stack?: boolean }[];
  }[] = [
    {
      caption: ty.groupDisplay,
      rows: [
        { sample: "headline", spec: "clamp 2.25–3.75rem / 900", className: "typo-headline", stack: true },
        { sample: "kicker", spec: "1.625rem / 500", className: "typo-kicker" },
      ],
    },
    {
      caption: ty.groupReading,
      rows: [
        { sample: "h1", spec: "2.25rem / 900", className: "typo-h1" },
        { sample: "h2", spec: "1.75rem / 900", className: "typo-h2" },
        { sample: "h3", spec: "1.5rem / 700", className: "typo-h3" },
        { sample: "h4", spec: "1.25rem / 700", className: "typo-h4" },
        { sample: "h5", spec: "1.125rem / 700", className: "typo-h5" },
        { sample: "h6", spec: "1rem / 700", className: "typo-h6" },
        { sample: "body", spec: "1rem / 1.7", className: "typo-body" },
      ],
    },
    {
      caption: ty.groupMechanism,
      rows: [
        { sample: "LABEL", spec: "0.875rem / 800 · 0.08em", className: labelCls },
        { sample: "OVERLINE", spec: "0.75rem / 500", className: "typo-overline" },
        { sample: "code", spec: "0.875rem / mono", className: "font-mono text-sm" },
      ],
    },
  ];
  return (
    <section id="type" className={SECTION}>
      <AnimatedContent className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={ty.eyebrow} title={ty.title} lead={ty.lead} />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <h3 className="text-sm font-bold">{ty.ladder}</h3>
            <div className="flex flex-col gap-5">
              {groups.map(({ caption, rows }) => (
                <div key={caption} className="flex flex-col gap-3">
                  <p className={cn(labelCls, "text-foreground")}>{caption}</p>
                  {rows.map(({ sample, spec, className, stack }) => (
                    <div
                      key={sample}
                      className={
                        stack
                          ? "flex flex-col gap-1"
                          : "flex flex-wrap items-baseline justify-between gap-x-2"
                      }
                    >
                      <span className={className}>{sample}</span>
                      <span className="shrink-0 font-mono text-xs text-foreground">{spec}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="text-sm font-bold">{ty.prose}</h3>
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
          </Card>
        </div>
      </AnimatedContent>
    </section>
  );
}

function RulesBlock({ t }: { t: T }) {
  const r = t.rules;
  return (
    <section id="rules" className={SECTION}>
      <AnimatedContent className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={r.eyebrow} title={r.title} lead={r.lead} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {r.principles.map((p) => (
            <Card key={p.n} className="h-full">
              <div className="flex items-center gap-2">
                <span className={cn(chipBase, chipVariants.outline)}>
                  {p.n}
                </span>
                <h3 className="text-sm font-bold">{p.title}</h3>
              </div>
              <p className="text-sm text-foreground">{p.body}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2 border-b-control border-border pb-3">
              <Check className="size-4" aria-hidden />
              <h3 className="text-sm font-bold tracking-label uppercase">{r.doTitle}</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {r.do.map((item) => (
                <li key={item} className="flex items-start gap-2 font-mono text-xs leading-body">
                  <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <div className="flex items-center gap-2 border-b-control border-border pb-3">
              <X className="size-4" aria-hidden />
              <h3 className="text-sm font-bold tracking-label uppercase">{r.dontTitle}</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {r.dont.map((item) => (
                <li key={item} className="flex items-start gap-2 font-mono text-xs leading-body">
                  <X className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </AnimatedContent>
    </section>
  );
}

function ClosingBlock({ t }: { t: T }) {
  const c = t.closing;
  const icons = [Sun, SwatchBook, Sparkles, ArrowRight, CircleCheck, Printer];
  return (
    <section className={cn(SECTION, "bg-surface text-surface-fg")}>
      <AnimatedContent className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={c.eyebrow} title={c.title} lead={c.lead} onSurface />
        <div className="grid grid-cols-1 overflow-hidden rounded-lg border-control border-border bg-background text-foreground sm:grid-cols-2 lg:grid-cols-3">
          {c.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <div
                key={card.title}
                className={cn(
                  "h-full border-border p-4 md:p-6",
                  i < 5 && "border-b-control",
                  i % 2 === 0 && "sm:border-r-control",
                  i < 4 ? "sm:border-b-control" : "sm:border-b-0",
                  i % 3 !== 2 ? "lg:border-r-control" : "lg:border-r-0",
                  i < 3 ? "lg:border-b-control" : "lg:border-b-0",
                )}
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-md border-control border-border bg-surface text-surface-fg">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mb-1 text-sm font-bold">{card.title}</h3>
                <p className="text-sm text-foreground">{card.body}</p>
              </div>
            );
          })}
        </div>
      </AnimatedContent>
    </section>
  );
}

function SiteFooter({ t, lang }: { t: T; lang: Lang }) {
  const otherLang = lang === "zh" ? "en" : "zh";
  return (
    <footer className="border-t-control border-border bg-surface px-4 py-8 md:px-6 lg:px-8 text-surface-fg">
      <div className={cn(CONTAINER, "flex flex-col gap-4")}>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-sm font-bold text-surface-fg">
            <span className="flex size-6 items-center justify-center bg-primary text-xs font-black text-primary-fg">
              N
            </span>
            Litefy
            <span className="text-xs font-normal text-surface-fg">{t.footer.tagline}</span>
          </span>
          <nav className="ms-auto flex flex-wrap gap-3">
            <Link className="text-sm text-surface-fg hover:underline" to={`/neon/${lang}/docs`}>
              {t.footer.docs}
            </Link>
            <Link className="text-sm text-surface-fg hover:underline" to={`/neon/${lang}/docs/styles`}>
              {t.footer.styles}
            </Link>
            <Link className="text-sm text-surface-fg hover:underline" to={`/neon/${lang}/docs/installation`}>
              {t.footer.install}
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t-control border-border pt-4">
          <span className="text-xs text-surface-fg">{t.footer.rights}</span>
          <Link
            to={`/neon/${otherLang}/showcase/neon-gradient`}
            className={cn(textLinkClass, "ms-auto")}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {otherLang === "en" ? "English" : "中文"}
          </Link>
        </div>
      </div>
    </footer>
  );
}