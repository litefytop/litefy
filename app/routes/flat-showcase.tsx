import type { LinksFunction, MetaFunction } from "react-router";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import flatShowcaseHref from "./flat-showcase.css?url";
import { AnimatedContent, Button, Card, NavBar } from "@/ui/skins";
import { buttonVariants, chipClasses, cn } from "@/ui/skins";
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
  Keyboard,
  Languages,
  Letters,
  PanelLeft,
  Printer,
  Sun,
  Users,
  X,
} from "@/components/icons";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: flatShowcaseHref }];

type Lang = "zh" | "en";

const tpl = findStyleTemplate("flat-minimal");

export const meta: MetaFunction = ({ params }) => {
  const lang = params.lang === "zh" ? "zh" : "en";
  const name = lang === "zh" ? `${tpl?.name.zh}方案` : `${tpl?.name.en} Style`;
  return [{ title: `${name} — Litefy UI` }, { name: "robots", content: "noindex" }];
};

const SECTION = "scroll-mt-16 border-b border-border px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20";
const CONTAINER = "mx-auto w-full max-w-320";
const EYEBROW = "typo-overline text-surface-fg";
const HEADLINE = "text-h2 leading-head tracking-tight font-bold";
const LEAD = "max-w-[40em] text-base leading-body text-surface-fg";
const textLinkClass = cn(buttonVariants.text, "px-3");

const TOKENS: { token: string; zh: string; en: string }[] = [
  { token: "--background", zh: "页面画布", en: "Page canvas" },
  { token: "--foreground", zh: "正文文字", en: "Body text" },
  { token: "--surface", zh: "次要容器", en: "Secondary surface" },
  { token: "--surface-fg", zh: "次级文字", en: "Secondary text" },
  { token: "--accent", zh: "强调背景", en: "Accent fill" },
  { token: "--accent-fg", zh: "强调文字", en: "Accent text" },
  { token: "--border", zh: "边框描边", en: "Border stroke" },
  { token: "--primary", zh: "品牌色", en: "Brand" },
  { token: "--primary-fg", zh: "品牌文字", en: "Brand text" },
  { token: "--primary-accent", zh: "品牌深化档", en: "Brand pressed" },
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

const COPY: Record<
  Lang,
  {
    brand: string;
    home: string;
    docs: string;
    nav: { palette: string; laws: string; type: string; rules: string; more: string };
    hero: { eyebrow: string; cta1: string; cta2: string; stats: [string, string][] };
    palette: {
      eyebrow: string;
      title: string;
      lead: string;
      pairs: string;
      pairLabels: [string, string][];
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
    brand: "FLAT MINIMAL",
    home: "主页",
    docs: "文档",
    nav: { palette: "色盘", laws: "交互", type: "排版", rules: "规则", more: "导航" },
    hero: {
      eyebrow: "// 风格方案 · 企业后台",
      cta1: "查看组件",
      cta2: "阅读文档",
      stats: [
        ["0px", "圆角半径"],
        ["1px", "描边宽度"],
        ["0", "阴影层级"],
        ["22", "语义令牌"],
      ],
    },
    palette: {
      eyebrow: "01 — 色盘",
      title: "颜色总览",
      lead: "冷白画布、浅天蓝表面、深天蓝品牌。22 枚语义令牌亮暗各一套，色块实时读取当前档位的令牌值——切换外观，整页重绘。颜色永远携带含义，说不出它标的是哪种状态或动作，它就不该出现。",
      pairs: "前景 / 背景对比对",
      pairLabels: [
        ["品牌文字 压 品牌色", "primary-fg / primary"],
        ["正文 压 画布", "foreground / background"],
        ["次级文字 压 表面", "surface-fg / surface"],
        ["强调文字 压 强调背景", "accent-fg / accent"],
      ],
    },
    laws: {
      eyebrow: "02 — 交互法则",
      title: "克制的交互",
      lead: "四条法则定义这套方案的手感：只换色、只压暗、环不消失、时长归令牌。每条都有可玩的演示——悬停、按下、Tab 聚焦，用手感记住它们。",
      items: [
        {
          tag: "法则 01 — 悬停只换色",
          code: "hover:bg-accent hover:text-accent-fg motion-frame",
          desc: "可点条目悬停吃 accent 对，品牌件吃 primary-accent 深化档。不位移、不升阴影——没有阴影可升。",
        },
        {
          tag: "法则 02 — 按压只压暗",
          code: "active:crush motion-frame",
          desc: "crush 是按压唯一入口：位移 0 + brightness(0.95)。禁止位移代替换色，禁止手写压暗串。",
        },
        {
          tag: "法则 03 — 焦点环不消失",
          code: "focus-visible:focus-ring / focus-ring-danger",
          desc: "2px primary 实线 outline、offset 2px、无光晕；危险件转 danger-fg 同形。焦点只换形态，从不移除。",
        },
        {
          tag: "法则 04 — 时长归令牌",
          code: "duration-sm ease-frame · 120ms",
          desc: "微反馈 120ms、小过渡 240ms、大过渡 480ms，缓动统一 cubic-bezier(0.2, 0, 0, 1)。减动效偏好下全部归零。",
        },
      ],
      hoverDemo: "悬停我",
      hoverNote: "背景换 accent 档——没有位移，没有阴影",
      pressDemo: "按住我",
      pressNote: "位移 0 · 亮度 0.95——压暗不压扁",
      focusDemo: "聚焦我",
      focusDangerDemo: "危险件",
      focusNote: "按 Tab 键查看焦点环——实线，无光晕",
      calmTrack: "flat-minimal · 120ms ease-frame",
      bounceTrack: "弹跳缓动（此处禁止）",
      trackNote: "指针划过轨道——感受利落与过冲的差别",
    },
    type: {
      eyebrow: "03 — 排版",
      title: "排版系统",
      lead: "单一 Inter 字族，九档阅读角色。标题行高 1.4、正文行高 1.7——长文阅读留足行间。字阶与长文作用域由方案持有，页面不逐元素写类。",
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
        { n: "01", title: "冷调蓝系", body: "sky 家族承担品牌与表面：冷白画布、浅天蓝表面、深天蓝品牌。颜色带冷静的气质，不暖、不艳。" },
        { n: "02", title: "发丝边界", body: "1px 描边是唯一线宽：control / hair / frame 三档同值。边框色是前景色 14% 透明，随底色自适应亮暗。" },
        { n: "03", title: "全直角", body: "半径阶梯每一档答 0px，含 pill 与 disc。共享代码写来的 rounded-lg 在这里得到直角——切换方案改变的是观感，不是丢失。" },
        { n: "04", title: "零阴影", body: "所有阴影角色答 none，层级只靠边界线、表面阶梯与留白。唯一豁免是选中双环——它是环，不是阴影。" },
        { n: "05", title: "边界建层级", body: "画布 → 表面 → 浮层三级表面阶梯，浮层一律带框。禁止用阴影或透明度补深度。" },
        { n: "06", title: "颜色带语义", body: "状态四族成套取用：静置背景、悬停档、文字色一一对应。状态色只用于状态，不作装饰、不当层级。" },
        { n: "07", title: "克制", body: "动效只换色与淡入淡出，无位移、无弹跳、无戏剧化登场。品牌色稀缺：一屏一个主操作。" },
      ],
      doTitle: "要做",
      dontTitle: "别做",
      do: [
        "border-hair border-border——1px 发丝描边",
        "rounded-none——全直角",
        "hover:bg-accent hover:text-accent-fg——悬停只换色",
        "active:crush——按压位移 0 + 压暗 5%",
        "focus-visible:focus-ring——2px 实线焦点环",
        "motion-frame duration-sm——120ms 令牌时长",
        "bg-<status> text-<status>-fg——状态色成套取用",
        "max-w-[40em]——正文阅读行宽",
      ],
      dont: [
        "rounded-lg / rounded-xl——任何圆角",
        "shadow-md / blur——任何阴影与模糊",
        "hover:-translate-y-1——悬停位移抬升",
        "opacity-50 弱化——透明度调深浅（禁用态除外）",
        "border-gray-*——灰色边框",
        "渐变文字 / 渐变填充——装饰性渐变",
        "弹簧 / 弹性缓动——只允许 ease-frame",
        "primary 大面积铺面——品牌色稀缺",
      ],
    },
    closing: {
      eyebrow: "// 为什么选 flat-minimal",
      title: "为严肃场景而生",
      lead: "企业后台与信息密集应用不需要戏剧性——需要密度、分明与不容歧义。六个理由。",
      cards: [
        { title: "高密度信息", body: "44px 命中区与紧凑字阶并存，一屏放下更多行，每一行仍然点得准、读得清。" },
        { title: "状态一眼分明", body: "语义四族亮暗各一套，静置、悬停、文字三档成套——错误与成功绝不含糊。" },
        { title: "键盘全通路", body: "焦点环从不消失，Tab 顺序即视觉顺序，指针能做的键盘都能做。" },
        { title: "日夜两档成立", body: "亮暗两套令牌各自手工调校，暗档品牌反转为亮天蓝配深字，来回切换无破相。" },
        { title: "打印恒白底", body: "打印车道接管 color-scheme，纸面恒白底黑字——报表与单据不费碳粉。" },
        { title: "无阴影层级", body: "边界线、表面阶梯与留白建立全部纵深，投影为零——界面干净，渲染也干净。" },
      ],
    },
    footer: {
      tagline: "风格方案是一份 CSS 包，不是一个配置文件。",
      docs: "介绍",
      styles: "样式",
      install: "安装",
      rights: "Litefy UI — 本页观感全部由 flat-minimal 方案自身令牌渲染。",
    },
  },
  en: {
    brand: "FLAT MINIMAL",
    home: "Home",
    docs: "Docs",
    nav: { palette: "Palette", laws: "Interaction", type: "Type", rules: "Rules", more: "Navigate" },
    hero: {
      eyebrow: "// style scheme · enterprise",
      cta1: "View components",
      cta2: "Read the docs",
      stats: [
        ["0px", "Border radius"],
        ["1px", "Stroke width"],
        ["0", "Shadow levels"],
        ["22", "Semantic tokens"],
      ],
    },
    palette: {
      eyebrow: "01 — Palette",
      title: "Colour wall",
      lead: "Cool-white canvas, pale-sky surfaces, deep-sky brand. Twenty-two semantic tokens, one authored set per tier — every swatch reads the live token value, so switching appearance repaints the whole page. Colour always carries meaning: if you cannot name the state or action it marks, it should not be there.",
      pairs: "Foreground / background pairs",
      pairLabels: [
        ["Brand text on brand", "primary-fg / primary"],
        ["Body on canvas", "foreground / background"],
        ["Secondary on surface", "surface-fg / surface"],
        ["Accent text on accent", "accent-fg / accent"],
      ],
    },
    laws: {
      eyebrow: "02 — Interaction laws",
      title: "Restrained interaction",
      lead: "Four laws define how this scheme feels: colour shifts only, press darkens only, the ring never vanishes, durations ride tokens. Each has a playable demo — hover, press, Tab through them.",
      items: [
        {
          tag: "Law 01 — Hover shifts colour",
          code: "hover:bg-accent hover:text-accent-fg motion-frame",
          desc: "Clickable rows take the accent pair on hover; brand controls take the primary-accent step. No movement, no shadow lift — there is no shadow to lift.",
        },
        {
          tag: "Law 02 — Press darkens only",
          code: "active:crush motion-frame",
          desc: "crush is the only press entrance: translate 0 + brightness(0.95). No displacement standing in for colour, no hand-written press strings.",
        },
        {
          tag: "Law 03 — The ring never vanishes",
          code: "focus-visible:focus-ring / focus-ring-danger",
          desc: "A 2px solid primary outline, offset 2px, no glow; danger controls switch to danger-fg in the same shape. Focus is restyled, never removed.",
        },
        {
          tag: "Law 04 — Durations ride tokens",
          code: "duration-sm ease-frame · 120ms",
          desc: "Micro-feedback 120ms, small transitions 240ms, large transitions 480ms, one ease cubic-bezier(0.2, 0, 0, 1). Reduced motion zeroes all of them.",
        },
      ],
      hoverDemo: "Hover me",
      hoverNote: "Background steps to accent — no movement, no shadow",
      pressDemo: "Press me",
      pressNote: "Translate 0 · brightness 0.95 — darkens, never flattens",
      focusDemo: "Focus me",
      focusDangerDemo: "Danger",
      focusNote: "Press Tab to see the ring — solid, no glow",
      calmTrack: "flat-minimal · 120ms ease-frame",
      bounceTrack: "Spring easing (forbidden here)",
      trackNote: "Hover a track — crisp against overshoot",
    },
    type: {
      eyebrow: "03 — Type",
      title: "Type system",
      lead: "One Inter family, nine reading roles. Headings at 1.4 line height, body at 1.7 — room to read for long-form pages. The ladder and the reading scope belong to the scheme; the page writes none of it.",
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
        { n: "01", title: "Cool sky family", body: "The sky family carries brand and surface: cool-white canvas, pale-sky surfaces, deep-sky brand. Calm, never warm, never loud." },
        { n: "02", title: "Hairline boundaries", body: "1px is the only stroke: control / hair / frame answer the same value. Border colour is foreground at 14%, adapting to whatever sits beneath." },
        { n: "03", title: "Square everywhere", body: "Every radius step answers 0px, pills and discs included. A shared rounded-lg arrives here as a square corner — switching schemes changes looks, never availability." },
        { n: "04", title: "Zero shadow", body: "Every shadow role answers none; hierarchy rides boundaries, surface steps and whitespace alone. The only exemption is the flat selection ring — a ring, not a shadow." },
        { n: "05", title: "Boundaries build depth", body: "Canvas → surface → raised overlay: three surface steps, every overlay framed. Depth is never patched in with shadow or opacity." },
        { n: "06", title: "Colour carries meaning", body: "The four status families are taken as sets: rest fill, hover step, text colour in pairs. Status colour is for status — never decoration, never hierarchy." },
        { n: "07", title: "Restraint", body: "Motion is colour shifts and fades only — no displacement, no bounce, no dramatic entrances. Brand stays scarce: one primary action per screen." },
      ],
      doTitle: "DO",
      dontTitle: "DON'T",
      do: [
        "border-hair border-border — 1px hairline strokes",
        "rounded-none — square corners always",
        "hover:bg-accent hover:text-accent-fg — hover shifts colour only",
        "active:crush — press at translate 0 + 5% darker",
        "focus-visible:focus-ring — 2px solid focus outline",
        "motion-frame duration-sm — 120ms token timing",
        "bg-<status> text-<status>-fg — status colours taken as sets",
        "max-w-[40em] — the reading line width",
      ],
      dont: [
        "rounded-lg / rounded-xl — any rounding at all",
        "shadow-md / blur — any shadow or blur",
        "hover:-translate-y-1 — hover lift or displacement",
        "opacity-50 dimming — depth via transparency (disabled state excepted)",
        "border-gray-* — gray borders",
        "gradient text / gradient fills — decorative gradients",
        "spring / elastic easing — ease-frame or nothing",
        "primary as a large surface — brand stays scarce",
      ],
    },
    closing: {
      eyebrow: "// Why flat-minimal",
      title: "Built for serious work",
      lead: "Enterprise consoles and information-dense apps do not need drama — they need density, clarity and zero ambiguity. Six reasons.",
      cards: [
        { title: "Dense by design", body: "44px hit targets coexist with a compact type ladder: more rows per screen, every row still precise to click and clear to read." },
        { title: "Unambiguous states", body: "Four status families, one authored set per tier — rest, hover and text in pairs. Error and success never blur together." },
        { title: "Keyboard complete", body: "The focus ring never vanishes, Tab order is visual order, and everything a pointer can do the keyboard can do." },
        { title: "Two authored tiers", body: "Light and dark are hand-tuned token sets; the dark brand inverts to bright sky with dark ink. Toggle back and forth — nothing breaks." },
        { title: "Print stays white", body: "The print lane takes over color-scheme: paper output is always white with black ink — reports and forms save toner." },
        { title: "Depth without shadow", body: "Boundaries, surface steps and whitespace carry all the depth. Zero drop shadows — a clean interface and a clean render." },
      ],
    },
    footer: {
      tagline: "A style scheme is a CSS package, not a config file.",
      docs: "Introduction",
      styles: "Styles",
      install: "Installation",
      rights: "Litefy UI — this page is rendered entirely from the flat-minimal scheme's own tokens.",
    },
  },
};

type T = (typeof COPY)["zh"];

const NAV_ANCHORS = ["palette", "laws", "type", "rules"] as const;

export default function FlatShowcaseRoute() {
  return (
    <SiteSkinProvider skin={siteSkin}>
      <FlatShowcasePage />
    </SiteSkinProvider>
  );
}

function FlatShowcasePage() {
  const { lang, slug } = useParams<{ lang?: string; slug?: string }>();
  if (slug !== "flat-minimal") return <BareNotFound />;
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
      `${location.pathname.replace(/^\/flat\/(en|zh)/u, `/flat/${otherLang}`)}${location.hash}${location.search}`,
    );
  };
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="flex h-14 items-center gap-2 px-4 md:px-6 lg:px-8">
        <Link
          to={`/flat/${lang}/docs`}
          className="flex shrink-0 items-center gap-2 no-underline"
          title={t.docs}
        >
          <span className="flex size-8 items-center justify-center bg-primary text-sm font-bold text-primary-fg">
            C
          </span>
          <span className="text-sm font-bold tracking-tight max-sm:hidden">{t.brand}</span>
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
  return (
    <section className="border-b border-border bg-surface px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className={cn(CONTAINER, "flex flex-col gap-6")}>
        <div className="flex flex-col gap-3">
          <p className="typo-kicker text-surface-fg">{t.hero.eyebrow}</p>
          <h1 className="typo-headline">
            {lang === "zh" ? tpl?.name.zh : tpl?.name.en}
          </h1>
          <p className={LEAD}>{lang === "zh" ? tpl?.desc.zh : tpl?.desc.en}</p>
          <div className="flex flex-wrap gap-2">
            <Link to={`/flat/${lang}/docs/overview`} className={buttonVariants.primary}>
              {t.hero.cta1}
              <ArrowRight aria-hidden />
            </Link>
            <Link to={`/flat/${lang}/docs`} className={buttonVariants.outline}>
              {t.hero.cta2}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
          {t.hero.stats.map(([value, label], i) => (
            <div
              key={label}
              className={cn(
                "border-border p-4",
                i < 3 && "md:border-r",
                i % 2 === 0 && "max-md:border-r",
                i < 2 && "max-md:border-b",
              )}
            >
              <div className="text-3xl font-bold tabular-nums">{value}</div>
              <div className={cn(EYEBROW, "mt-1")}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className={HEADLINE}>{title}</h2>
      <p className={LEAD}>{lead}</p>
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
      <AnimatedContent distance={0} className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {TOKENS.map(({ token, ...roles }) => (
            <div key={token} className="border border-border bg-background">
              <div
                className="h-14 border-b border-border"
                style={{ backgroundColor: `var(${token})` }}
              />
              <div className="flex flex-col gap-0.5 p-2">
                <code className="truncate font-mono text-xs">{token}</code>
                <span className="text-xs text-surface-fg">{roles[lang]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold">{p.pairs}</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {pairs.map((pair, i) => (
              <div key={pair} className={cn("border border-border p-4", pair)}>
                <div className="text-2xl font-bold">Aa</div>
                <div className="mt-1 font-mono text-xs">{p.pairLabels[i][1]}</div>
                <div className="text-xs">{p.pairLabels[i][0]}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}

function LawsBlock({ t }: { t: T }) {
  const l = t.laws;
  return (
    <section id="laws" className={cn(SECTION, "bg-surface")}>
      <AnimatedContent distance={0} className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={l.eyebrow} title={l.title} lead={l.lead} />
        <div className="grid gap-4 md:grid-cols-2">
          {l.items.map((item, i) => (
            <Card key={item.tag} className="h-full">
              <div className="flex items-center gap-2">
                <span className={chipClasses} data-variant="outline">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold">{item.tag}</h3>
              </div>
              <p className="font-mono text-xs break-all text-surface-fg">{item.code}</p>
              <p className="text-sm text-surface-fg">{item.desc}</p>
              <div className="flex flex-col items-center gap-2 border border-border bg-background p-4">
                {i === 0 && (
                  <>
                    <button
                      type="button"
                      className="cursor-pointer border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground motion-frame hover:bg-accent hover:text-accent-fg focus-visible:focus-ring"
                    >
                      {l.hoverDemo}
                    </button>
                    <p className="text-xs text-surface-fg">{l.hoverNote}</p>
                  </>
                )}
                {i === 1 && (
                  <>
                    <button
                      type="button"
                      className="cursor-pointer border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground motion-frame active:crush focus-visible:focus-ring"
                    >
                      {l.pressDemo}
                    </button>
                    <p className="text-xs text-surface-fg">{l.pressNote}</p>
                  </>
                )}
                {i === 2 && (
                  <>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        className="cursor-pointer border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground focus-visible:focus-ring"
                      >
                        {l.focusDemo}
                      </button>
                      <button
                        type="button"
                        data-danger
                        className="cursor-pointer border border-border bg-background px-4 py-2 text-sm font-semibold text-danger-fg focus-visible:focus-ring-danger"
                      >
                        {l.focusDangerDemo}
                      </button>
                    </div>
                    <p className="text-xs text-surface-fg">{l.focusNote}</p>
                  </>
                )}
                {i === 3 && (
                  <div className="flex w-full flex-col gap-3">
                    <div>
                      <span className="mb-1 block font-mono text-xs text-surface-fg">
                        {l.calmTrack}
                      </span>
                      <div className="group relative h-8 overflow-hidden border border-border bg-background">
                        <div className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-accent transition-transform duration-sm ease-frame group-hover:scale-x-100" />
                      </div>
                    </div>
                    <div>
                      <span className="mb-1 block font-mono text-xs text-surface-fg">
                        {l.bounceTrack}
                      </span>
                      <div className="group relative h-8 overflow-hidden border border-border bg-background">
                        <div className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-x-100" />
                      </div>
                    </div>
                    <p className="text-center text-xs text-surface-fg">{l.trackNote}</p>
                  </div>
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
  const labelCls = "text-label leading-label tracking-label font-label";
  const groups: {
    caption: string;
    rows: { sample: string; spec: string; className: string; stack?: boolean }[];
  }[] = [
    {
      caption: ty.groupDisplay,
      rows: [
        { sample: "headline", spec: "clamp 2.25–3.75rem / 700", className: "typo-headline", stack: true },
        { sample: "kicker", spec: "1.625rem / 500", className: "typo-kicker" },
      ],
    },
    {
      caption: ty.groupReading,
      rows: [
        { sample: "h1", spec: "1.75rem / 700", className: "typo-h1" },
        { sample: "h2", spec: "1.375rem / 700", className: "typo-h2" },
        { sample: "h3", spec: "1.25rem / 600", className: "typo-h3" },
        { sample: "h4", spec: "1.125rem / 600", className: "typo-h4" },
        { sample: "h5", spec: "1.0625rem / 600", className: "typo-h5" },
        { sample: "h6", spec: "1rem / 600", className: "typo-h6" },
        { sample: "body", spec: "1rem / 1.7", className: "typo-body" },
      ],
    },
    {
      caption: ty.groupMechanism,
      rows: [
        { sample: "label", spec: "0.8125rem / 700", className: labelCls },
        { sample: "OVERLINE", spec: "0.75rem / 500", className: "typo-overline" },
        { sample: "code", spec: "0.875rem / mono", className: "font-mono text-sm" },
      ],
    },
  ];
  return (
    <section id="type" className={SECTION}>
      <AnimatedContent distance={0} className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={ty.eyebrow} title={ty.title} lead={ty.lead} />
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <h3 className="text-sm font-semibold">{ty.ladder}</h3>
            <div className="flex flex-col gap-5">
              {groups.map(({ caption, rows }) => (
                <div key={caption} className="flex flex-col gap-3">
                  <p className={cn(labelCls, "text-surface-fg")}>{caption}</p>
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
                      <span className="shrink-0 font-mono text-xs text-surface-fg">{spec}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="text-sm font-semibold">{ty.prose}</h3>
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
      <AnimatedContent distance={0} className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={r.eyebrow} title={r.title} lead={r.lead} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {r.principles.map((p) => (
            <Card key={p.n} className="h-full">
              <div className="flex items-center gap-2">
                <span className={chipClasses} data-variant="outline">
                  {p.n}
                </span>
                <h3 className="text-sm font-semibold">{p.title}</h3>
              </div>
              <p className="text-sm text-surface-fg">{p.body}</p>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Check className="size-4" aria-hidden />
              <h3 className="text-sm font-semibold tracking-label uppercase">{r.doTitle}</h3>
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
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <X className="size-4" aria-hidden />
              <h3 className="text-sm font-semibold tracking-label uppercase">{r.dontTitle}</h3>
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
  const icons = [Users, CircleCheck, Keyboard, Sun, Printer, PanelLeft];
  return (
    <section className={cn(SECTION, "bg-surface")}>
      <AnimatedContent distance={0} className={cn(CONTAINER, "flex flex-col gap-6")}>
        <SectionHead eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
        <div className="grid grid-cols-1 border border-border bg-background sm:grid-cols-2 lg:grid-cols-3">
          {c.cards.map((card, i) => {
            const Icon = icons[i];
            return (
              <div
                key={card.title}
                className={cn(
                  "h-full border-border p-4 md:p-6",
                  i < 5 && "border-b",
                  i % 2 === 0 && "sm:border-r",
                  i < 4 ? "sm:border-b" : "sm:border-b-0",
                  i % 3 !== 2 ? "lg:border-r" : "lg:border-r-0",
                  i < 3 ? "lg:border-b" : "lg:border-b-0",
                )}
              >
                <div className="mb-3 flex size-10 items-center justify-center border border-border bg-surface">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mb-1 text-sm font-semibold">{card.title}</h3>
                <p className="text-sm text-surface-fg">{card.body}</p>
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
    <footer className="border-t border-border bg-surface px-4 py-8 md:px-6 lg:px-8">
      <div className={cn(CONTAINER, "flex flex-col gap-4")}>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-sm font-bold">
            <span className="flex size-6 items-center justify-center bg-primary text-xs font-bold text-primary-fg">
              C
            </span>
            Litefy
            <span className="text-xs font-normal text-surface-fg">{t.footer.tagline}</span>
          </span>
          <nav className="ms-auto flex flex-wrap gap-3">
            <Link className="text-sm hover:underline" to={`/flat/${lang}/docs`}>
              {t.footer.docs}
            </Link>
            <Link className="text-sm hover:underline" to={`/flat/${lang}/docs/styles`}>
              {t.footer.styles}
            </Link>
            <Link className="text-sm hover:underline" to={`/flat/${lang}/docs/installation`}>
              {t.footer.install}
            </Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <span className="text-xs text-surface-fg">{t.footer.rights}</span>
          <Link
            to={`/flat/${otherLang}/showcase/flat-minimal`}
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