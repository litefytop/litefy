"use client";

import * as React from "react";
import {
  type LinksFunction,
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import globalHref from "../global.css?url";
import { AnimatedContent, Button, Card, NavBar, Separator } from "@/ui/skins";
import { buttonVariants, chipClasses, cn } from "@/ui/skins";
import { ArrowRight, Flag, Github, House, Languages, Letters } from "@/components/icons";
import { findStyleTemplate, type StyleTemplate } from "../lib/style-templates";
import { PaletteSection } from "../components/palette-section";
import { AppearancePanel } from "../components/appearance-panel";
import { StyleMenu } from "../components/style-select";
import { BareNotFound } from "../components/bare-not-found";
import { SiteSkinProvider } from "@/components/site-skin";
import { siteSkin } from "@/components/site-skin-bundle";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: globalHref }];

const textLinkClass = cn(buttonVariants.text, "px-3");
const outlineLinkClass = buttonVariants.outline;

type Lang = "zh" | "en";

const TOKENS: { token: string; en: string; zh: string }[] = [
  { token: "--background", en: "Page canvas", zh: "页面画布" },
  { token: "--foreground", en: "Body text", zh: "正文" },
  { token: "--surface-fg", en: "Secondary text", zh: "次级文字" },
  { token: "--success-fg", en: "Success", zh: "成功" },
  { token: "--info-fg", en: "Info", zh: "信息" },
  { token: "--warning-fg", en: "Warning", zh: "警告" },
  { token: "--danger-fg", en: "Danger", zh: "危险" },
];

const COPY: Record<
  Lang,
  {
    home: string;
    hero: { eyebrow: string; cta: string; cta2: string; ramp: string; rampDesc: string };
    nav: {
      palette: string;
      tokens: string;
      type: string;
      interact: string;
      rules: string;
      more: string;
    };
    navTitle: {
      palette: string;
      tokens: string;
      type: string;
      interact: string;
      rules: string;
    };
    palette: { eyebrow: string; title: string; desc: string; semantic: string; ramp: string };
    tokens: {
      eyebrow: string;
      title: string;
      desc: string;
      semantic: string;
      ramp: string;
      colToken: string;
      colRole: string;
    };
    type: {
      eyebrow: string;
      title: string;
      desc: string;
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
    interact: {
      eyebrow: string;
      title: string;
      desc: string;
      items: {
        n: string;
        demo: "lift" | "press" | "shadow" | "duration";
        cta: string;
        title: string;
        body: string;
      }[];
    };
    rules: {
      eyebrow: string;
      title: string;
      desc: string;
      anti: string;
      antiDesc: string;
      items: { title: string; body: string }[];
    };
    footer: {
      tagline: string;
      docs: string;
      styles: string;
      install: string;
      components: string;
      rights: string;
    };
    misc: { antiItems: string[] };
  }
> = {
  en: {
    home: "Home",
    hero: {
      eyebrow: "// style scheme",
      cta: "View components",
      cta2: "Read the docs",
      ramp: "Live ramps",
      rampDesc:
        "Every control below repaints as you pick a ramp — the scheme owns the values, the page owns none.",
    },
    nav: {
      palette: "Palette",
      tokens: "Tokens",
      type: "Type",
      interact: "Interaction",
      rules: "Rules",
      more: "Navigation",
    },
    navTitle: {
      palette: "01 · Palette — the colours, nothing else",
      tokens: "02 · Tokens — every variable name and its role",
      type: "03 · Type — the ladder and the reading scope",
      interact: "04 · Interaction — the laws you can feel",
      rules: "05 · The design rules this scheme enforces",
    },
    palette: {
      eyebrow: "01 — Palette",
      title: "Colour wall",
      desc: "This band is colour only. Names, roles and the attributes that switch them live in the next band.",
      semantic: "Semantic colours",
      ramp: "Scheme ramps",
    },
    tokens: {
      eyebrow: "02 — Tokens",
      title: "Token & attribute list",
      desc: "The scheme ships semantic tokens only, and this list is the fixed core — canvas, secondary ink and status. The brand and surface lanes ride the palette attributes below. Restating a hex code in page CSS is a contract violation — pick a role, never a colour.",
      semantic: "Semantic tokens",
      ramp: "Ramp attributes",
      colToken: "Token",
      colRole: "Role",
    },
    type: {
      eyebrow: "03 — Type",
      title: "Type system",
      desc: "Text is part of the design. The ladder and the reading scope belong to the scheme — the page writes none of it.",
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
    interact: {
      eyebrow: "04 — Interaction",
      title: "Interaction laws",
      desc: "Four laws you can feel, each driven by a token the scheme owns. The bricks are teaching canvases — the raw utilities are the lesson.",
      items: [
        {
          n: "01",
          demo: "lift",
          cta: "Hover me",
          title: "Hover lifts half a step",
          body: "hover:lift raises the box by half a spacing step and the fill deepens to primary-accent. Static surfaces never move.",
        },
        {
          n: "02",
          demo: "press",
          cta: "Press and hold",
          title: "Press settles, then sinks",
          body: "active:crush returns the box first; the inset shadow follows --press-inset-delay (80ms) late. Release snaps back with no delay.",
        },
        {
          n: "03",
          demo: "shadow",
          cta: "",
          title: "Tinted soft shadows",
          body: "faint / subtle / base / elevated, each diffusion layer carrying a brand-tinted glow — switch the brand ramp and the glow follows the hue. Dark keeps pure black plus a white rim.",
        },
        {
          n: "04",
          demo: "duration",
          cta: "Hover for the transition",
          title: "Quiet durations",
          body: "Micro feedback rides motion-frame at 150ms; large transitions take 300 / 500ms. Reduced motion collapses all three to zero.",
        },
      ],
    },
    rules: {
      eyebrow: "05 — Design rules",
      title: "Design rules of this scheme",
      desc: "Each rule is a token or an attribute the scheme enforces — not a note in a style guide. Change the scheme, change the rule.",
      anti: "Anti-patterns",
      antiDesc: "Rejected by the scheme, in any page.",
      items: [
        {
          title: "One source of style",
          body: "Every pixel of the look comes from the tokens the scheme holds; the page writes none.",
        },
        {
          title: "Soft radius ladder",
          body: "Four steps plus a pill: sm 8 / md 12 / lg 16 / xl 24px, pill by default for buttons. Each step pairs with a shadow level.",
        },
        {
          title: "Numeric whitespace",
          body: "Gap and padding are written as numbers — gap-3, p-6 — off a 0.25rem base. The scheme's five steps (0.25 / 0.5 / 0.75 / 1 / 1.5rem) say which are in style; a gap off the scale is a mistake, not a nuance.",
        },
        {
          title: "Block rhythm is responsive",
          body: "Section padding steps with the viewport: py-12 → md:py-16 → lg:py-20. --pad-block carries the same three numbers for the few inline styles a class cannot reach — the two must stay equal.",
        },
        {
          title: "Tinted soft shadows",
          body: "faint / subtle / base / elevated. Light diffusion layers carry a brand-tinted soft glow — switch the brand ramp and the glow follows the hue. Dark keeps pure black plus a white rim — never a white blur glow.",
        },
        {
          title: "Surface layering",
          body: "Bars and bands take surface, the canvas takes background, floating overlays take surface-raised. Primary is never a surface.",
        },
        {
          title: "Hand-tuned contrast",
          body: "Light and dark are two authored token sets; status hues are re-picked per mode to stay AA.",
        },
        {
          title: "Dividers are hairlines",
          body: "One 1px border at --border (accent at 50%). No double rules, no shadow-as-border.",
        },
        {
          title: "Focus is a ring plus a halo",
          body: "--focus-outline 1px solid --primary with a 3px --focus-glow. Focus is never removed, only restyled.",
        },
        {
          title: "Settle, then sink",
          body: "--press-filter darkens by 5%; --translate-crush is 0; the inset shadow follows --press-inset-delay late and release snaps back. The half-step hover lift belongs to buttons and interactive cards — static surfaces never lift.",
        },
        {
          title: "Three motion steps",
          body: "150 / 300 / 500ms, and prefers-reduced-motion collapses all three to 0ms.",
        },
      ],
    },
    footer: {
      tagline: "A style scheme is a CSS package, not a config file.",
      docs: "Introduction",
      styles: "Styles",
      install: "Installation",
      components: "Components",
      rights: "Litefy UI — scheme showcase rendered from the scheme's own tokens.",
    },
    misc: {
      antiItems: [
        "gradient text",
        "hover-to-reveal control",
        "raw hex in page CSS",
        "double border",
      ],
    },
  },
  zh: {
    home: "主页",
    hero: {
      eyebrow: "// 风格方案",
      cta: "查看组件",
      cta2: "阅读文档",
      ramp: "实时色阶",
      rampDesc: "切换色阶后本页全部重绘——色值由方案持有，页面一个都不写。",
    },
    nav: {
      palette: "色盘",
      tokens: "令牌",
      type: "排版",
      interact: "交互",
      rules: "规则",
      more: "导航",
    },
    navTitle: {
      palette: "01 · 色盘——只看颜色",
      tokens: "02 · 令牌——每个变量名与它的角色",
      type: "03 · 排版——字阶与长文作用域",
      interact: "04 · 交互——可感知的四条法则",
      rules: "05 · 这套方案强制执行的设计规则",
    },
    palette: {
      eyebrow: "01 — 色盘",
      title: "颜色总览",
      desc: "这一屏只放颜色。变量名、角色与切换它们用的属性，都在下一屏的令牌清单里。",
      semantic: "语义色",
      ramp: "方案色阶",
    },
    tokens: {
      eyebrow: "02 — 令牌",
      title: "令牌与属性清单",
      desc: "方案只发布语义令牌，此处只列固定不变的语义核心——画布、次要文字与状态色；品牌与表面车道随下方色阶属性切换。在页面 CSS 里重写一个色值就是违约——选角色，不选颜色。",
      semantic: "语义令牌",
      ramp: "色阶属性",
      colToken: "令牌",
      colRole: "角色",
    },
    type: {
      eyebrow: "03 — 排版",
      title: "排版系统",
      desc: "文字也是设计的一部分。字阶与长文作用域由方案持有，页面不逐元素写类。",
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
    interact: {
      eyebrow: "04 — 交互",
      title: "交互法则",
      desc: "四条可感知的法则，每条都由方案持有的令牌驱动。演示砖是教学画布——裸 utility 就是教学内容。",
      items: [
        {
          n: "01",
          demo: "lift",
          cta: "悬停我",
          title: "悬停上移半步",
          body: "hover:lift 把盒子上移半个间距步，填充加深到 primary-accent。静态表面永不移动。",
        },
        {
          n: "02",
          demo: "press",
          cta: "按住我",
          title: "按压先落回再内凹",
          body: "active:crush 先归位；内凹阴影经 --press-inset-delay（80ms）延迟跟进。松开无延迟立即回弹。",
        },
        {
          n: "03",
          demo: "shadow",
          cta: "",
          title: "染色柔影",
          body: "faint / subtle / base / elevated 四级，扩散层带品牌染色柔光——切换品牌色阶，柔光随主色相染色。暗档维持纯黑加白亮环。",
        },
        {
          n: "04",
          demo: "duration",
          cta: "悬停看过渡",
          title: "克制的时长",
          body: "微反馈走 motion-frame 150ms；大过渡 300 / 500ms。减动效三档全部归零。",
        },
      ],
    },
    rules: {
      eyebrow: "05 — 设计规则",
      title: "本方案的设计规则",
      desc: "每条规则都是方案持有的令牌或属性，而不是风格手册里的口头约定——换方案，规则就换。",
      anti: "反模式",
      antiDesc: "方案一律拒绝，任何页面都不例外。",
      items: [
        { title: "样式单一来源", body: "观感的每一像素都来自方案持有的令牌，页面一个都不写。" },
        {
          title: "大圆角阶梯",
          body: "四档加胶囊：sm 8 / md 12 / lg 16 / xl 24px，按钮族默认胶囊。每一档与一个阴影等级一一配对。",
        },
        {
          title: "留白写数字",
          body: "gap 与 p 直接写数字——gap-3、p-6——基准 0.25rem。方案的五档（0.25 / 0.5 / 0.75 / 1 / 1.5rem）说明哪些在风格内；不在刻度上的间距是错误，不是细腻。",
        },
        {
          title: "区块节奏按断点",
          body: "纵向留白随视口升档：py-12 → md:py-16 → lg:py-20。同一组数值另有 --pad-block（3 / 4 / 5rem）供类位置到不了的内联样式读取——两者必须同值。",
        },
        {
          title: "染色柔影",
          body: "faint / subtle / base / elevated。亮档扩散层带品牌染色柔光——换品牌色阶柔光随主色相染色；暗档维持纯黑投影加白亮环，绝不用白色模糊假造高度。",
        },
        {
          title: "表面分层",
          body: "顶栏、色带与 hero 用 surface，画布用 background，浮动层用 surface-raised。primary 永不做表面。",
        },
        { title: "手工调校对比度", body: "浅深两套令牌各自成立，状态色按模式重新取色以保持 AA。" },
        {
          title: "分隔只用细线",
          body: "1px 的 --border（accent 50%）。不加双线，也不用阴影当边框。",
        },
        {
          title: "焦点是环加光晕",
          body: "--focus-outline 取 1px 的 --primary，配 3px --focus-glow。焦点不移除，只换样式。",
        },
        {
          title: "先落回再内凹",
          body: "--press-filter 变暗 5%，--translate-crush 为 0；内凹阴影经 --press-inset-delay 延迟跟进，松开立即回弹。悬停上移半步归按钮与交互卡，静态表面永不抬升。",
        },
        { title: "三档动效", body: "150 / 300 / 500ms，prefers-reduced-motion 下三档全部归零。" },
      ],
    },
    footer: {
      tagline: "风格方案是一份 CSS 包，不是一个配置文件。",
      docs: "介绍",
      styles: "样式",
      install: "安装",
      components: "组件",
      rights: "Litefy UI — 本页观感全部由方案自身令牌渲染。",
    },
    misc: {
      antiItems: ["渐变文字", "悬停才显示的控件", "页面写死色值", "双线边框"],
    },
  },
};

const BLOCKS = ["palette", "tokens", "type", "interact", "rules"] as const;

/* Teaching bricks for the interaction laws (blueprint: 法则演示画布豁免).
   Literal class strings so Tailwind can see every utility. */
const SHADOW_DEMOS = {
  faint: "shadow-faint",
  subtle: "shadow-subtle",
  base: "shadow-base",
  elevated: "shadow-elevated",
} as const;

type ShadowLevel = keyof typeof SHADOW_DEMOS;
type DemoKind = "lift" | "press" | "shadow" | "duration";

function templateTitle(tpl: StyleTemplate, lang: Lang) {
  return lang === "zh" ? `${tpl.name.zh}方案` : `${tpl.name.en} Style`;
}

export function meta({ params }: { params: { lang?: string; slug?: string } }) {
  const lang = params.lang === "zh" ? "zh" : "en";
  const tpl = findStyleTemplate(params.slug);
  const t = tpl ? templateTitle(tpl, lang) : "Template";
  return [{ title: `${t} — Litefy UI` }, { name: "robots", content: "noindex" }];
}

export default function ShowcaseRoute() {
  return (
    <SiteSkinProvider skin={siteSkin}>
      <ShowcasePage />
    </SiteSkinProvider>
  );
}

function ShowcasePage() {
  const { lang, slug } = useParams<{ lang?: string; slug: string }>();
  const tpl = findStyleTemplate(slug);
  if (!tpl) return <BareNotFound />;
  if (tpl.slug === "neo-brutalist") {
    return <Navigate to={`/neo/${lang === "zh" ? "zh" : "en"}/showcase/neo-brutalist`} replace />;
  }
  if (tpl.slug === "flat-minimal") {
    return <Navigate to={`/flat/${lang === "zh" ? "zh" : "en"}/showcase/flat-minimal`} replace />;
  }
  if (tpl.slug === "neon-gradient") {
    return <Navigate to={`/neon/${lang === "zh" ? "zh" : "en"}/showcase/neon-gradient`} replace />;
  }
  const langNormalized: Lang = lang === "zh" ? "zh" : "en";
  return (
    <TemplateScene
      tpl={tpl}
      lang={langNormalized}
      homeHref={`/${langNormalized}`}
      docsHref={`/${langNormalized}/docs`}
    />
  );
}

function TemplateScene({
  tpl,
  lang,
  homeHref,
  docsHref,
}: {
  tpl: StyleTemplate;
  lang: Lang;
  homeHref: string;
  docsHref: string;
}) {
  const t = COPY[lang];
  const navigate = useNavigate();
  const location = useLocation();
  const otherLang = lang === "zh" ? "en" : "zh";
  const switchLang = () => {
    navigate(
      `${location.pathname.replace(/^\/(en|zh)/u, `/${otherLang}`)}${location.hash}${location.search}`,
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-14 items-center gap-2 px-4 md:px-6 lg:px-8 sticky top-0 z-40 border-b bg-surface">
        <NavBar
          items={[...BLOCKS]}
          getKey={(id) => id}
          more={t.nav.more}
          renderItem={(id) => (
            <a href={`#${id}`} title={t.navTitle[id]} className={textLinkClass}>
              {t.nav[id]}
            </a>
          )}
        />
        <div className="flex shrink-0 ms-auto items-center gap-1">
          <StyleMenu lang={lang} />
          <AppearancePanel lang={lang} />
          <Button
            type="button"
            onClick={switchLang}
            aria-label={otherLang === "en" ? "Switch to English" : "切换到中文"}
            title={otherLang === "en" ? "Switch to English" : "切换到中文"}
            data-variant="outline"
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
            to={homeHref}
            aria-label={t.home}
            title={t.home}
            className={cn(
              outlineLinkClass,
              "relative aspect-square shrink-0 px-0 after:absolute after:-inset-hit after:content-['']",
            )}
          >
            <House className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <main className="flex flex-col flex-1 w-full">
        <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 border-b bg-surface text-on-surface">
          <div className="grid gap-6 mx-auto w-full max-w-320 md:grid-cols-[1.2fr_1fr] md:items-center">
            <header className="flex flex-col gap-3">
              <p className="typo-kicker">{t.hero.eyebrow}</p>
              <h1 className="typo-headline">{templateTitle(tpl, lang)}</h1>
              <p className="max-w-256 text-sm text-surface-fg">{tpl.desc[lang]}</p>
              <div className="flex flex-wrap gap-2">
                <Link to={`${docsHref}/overview`} className={buttonVariants.primary}>
                  {t.hero.cta}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <Link to={docsHref} className={outlineLinkClass}>
                  {t.hero.cta2}
                </Link>
              </div>
            </header>
            <Card className="flex flex-col gap-3">
              <h2 className="text-sm font-medium">{t.hero.ramp}</h2>
              <p className="text-xs text-surface-fg">{t.hero.rampDesc}</p>
              <PaletteSection palettes={tpl.palettes} lang={lang} />
            </Card>
          </div>
        </section>

        <PaletteBlock tpl={tpl} lang={lang} />
        <TokensBlock tpl={tpl} lang={lang} />
        <TypeBlock t={t} />
        <InteractionBlock t={t} />
        <RulesBlock t={t} />
      </main>

      <footer className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 border-t bg-surface text-on-surface">
        <div className="flex flex-col gap-4 mx-auto w-full max-w-320">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2 font-medium">
              <Flag className="size-4 text-primary" aria-hidden />
              Litefy
              <span className="text-xs text-surface-fg">{t.footer.tagline}</span>
            </span>
            <nav className="flex flex-wrap ms-auto gap-3">
              <Link className="text-sm hover:underline" to={docsHref}>
                {t.footer.docs}
              </Link>
              <Link className="text-sm hover:underline" to={`${docsHref}/styles`}>
                {t.footer.styles}
              </Link>
              <Link className="text-sm hover:underline" to={`${docsHref}/installation`}>
                {t.footer.install}
              </Link>
              <Link className="text-sm hover:underline" to={`${docsHref}/component/chip`}>
                {t.footer.components}
              </Link>
              <a
                className="text-sm hover:underline"
                href="https://github.com/litefytop/litefy"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="size-4" aria-hidden />
              </a>
            </nav>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-surface-fg">{t.footer.rights}</span>
            <Link to={homeHref} className={cn(textLinkClass, "ms-auto")}>
              <House className="size-4" aria-hidden />
              {t.home}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="typo-overline">{eyebrow}</p>
      <h2 className="typo-h2">{title}</h2>
      <p className="max-w-256 text-sm text-surface-fg">{desc}</p>
    </div>
  );
}

function PaletteBlock({ tpl, lang }: { tpl: StyleTemplate; lang: Lang }) {
  const t = COPY[lang].palette;
  return (
    <section
      id="palette"
      className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 scroll-mt-16 border-b"
    >
      <AnimatedContent className="flex flex-col gap-6 mx-auto w-full max-w-320">
        <SectionHead eyebrow={t.eyebrow} title={t.title} desc={t.desc} />

        <Card className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">{t.semantic}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TOKENS.map(({ token, ...roles }) => (
              <span
                key={token}
                className="h-14 rounded-sm border"
                title={`${token} · ${roles[lang]}`}
                style={{ backgroundColor: `var(${token})` }}
              />
            ))}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {tpl.palettes.map((cfg) => (
            <Card key={cfg.storageKey} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">{cfg.label[lang]}</h3>
              <div className="flex flex-wrap gap-3">
                {cfg.options.map((o) => (
                  <span
                    key={o.name}
                    {...{ [cfg.attr]: o.name }}
                    title={o.label}
                    className="size-10 rounded-sm border"
                    style={{ backgroundColor: `var(${cfg.dotVar})` }}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </AnimatedContent>
    </section>
  );
}

function TokensBlock({ tpl, lang }: { tpl: StyleTemplate; lang: Lang }) {
  const t = COPY[lang].tokens;
  const rows = TOKENS.map(({ token, ...roles }) => ({ token, role: roles[lang] }));

  return (
    <section
      id="tokens"
      className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 scroll-mt-16 border-b"
    >
      <AnimatedContent className="flex flex-col gap-6 mx-auto w-full max-w-320">
        <SectionHead eyebrow={t.eyebrow} title={t.title} desc={t.desc} />

        <Card className="flex flex-col gap-3">
          <h3 className="text-sm font-medium">{t.semantic}</h3>
          <div className="flex flex-col divide-y">
            <div className="flex gap-2 py-2 text-xs uppercase text-surface-fg">
              <span className="flex-1">{t.colToken}</span>
              <span className="shrink-0">{t.colRole}</span>
            </div>
            {rows.map((row) => (
              <div key={row.token} className="flex items-center gap-2 py-2">
                <span
                  className="size-4 shrink-0 rounded-sm border"
                  style={{ backgroundColor: `var(${row.token})` }}
                  aria-hidden="true"
                />
                <code className="flex-1 truncate text-xs">{row.token}</code>
                <span className="shrink-0 text-xs text-surface-fg">{row.role}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {tpl.palettes.map((cfg) => (
            <Card key={cfg.storageKey} className="flex flex-col gap-3">
              <h3 className="text-sm font-medium">{t.ramp}</h3>
              <code className="text-xs text-primary-accent">{cfg.attr}</code>
              <div className="flex flex-wrap gap-1">
                {cfg.options.map((o) => (
                  <code key={o.name} className="text-xs text-surface-fg">
                    {o.name}
                  </code>
                ))}
              </div>
              <span className="text-xs text-surface-fg">{cfg.label[lang]}</span>
            </Card>
          ))}
        </div>
      </AnimatedContent>
    </section>
  );
}

type Copy = (typeof COPY)["en"];

function TypeBlock({ t }: { t: Copy }) {
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
        { sample: "h1", spec: "1.75rem / 600", className: "typo-h1" },
        { sample: "h2", spec: "1.375rem / 600", className: "typo-h2" },
        { sample: "h3", spec: "1.25rem / 600", className: "typo-h3" },
        { sample: "h4", spec: "1.125rem / 600", className: "typo-h4" },
        { sample: "h5", spec: "1.0625rem / 600", className: "typo-h5" },
        { sample: "h6", spec: "1rem / 600", className: "typo-h6" },
        { sample: "body", spec: "1rem / 1.75", className: "typo-body" },
      ],
    },
    {
      caption: ty.groupMechanism,
      rows: [
        { sample: "label", spec: "0.875rem / 600", className: labelCls },
        { sample: "OVERLINE", spec: "0.75rem / 500", className: "typo-overline" },
        { sample: "code", spec: "0.875rem / mono", className: "font-mono text-sm" },
      ],
    },
  ];
  return (
    <section
      id="type"
      className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 scroll-mt-16 border-b"
    >
      <AnimatedContent className="flex flex-col gap-6 mx-auto w-full max-w-320">
        <SectionHead eyebrow={ty.eyebrow} title={ty.title} desc={ty.desc} />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">{ty.ladder}</h3>
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

          <Card className="flex flex-col gap-3 lg:col-span-2">
            <h3 className="text-sm font-medium">{ty.prose}</h3>
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

function DemoBrick({ demo, cta }: { demo: DemoKind; cta: string }) {
  if (demo === "shadow") {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(Object.keys(SHADOW_DEMOS) as ShadowLevel[]).map((level) => (
          <div
            key={level}
            className={cn(
              "flex h-20 items-end justify-center rounded-lg bg-background pb-2",
              SHADOW_DEMOS[level],
            )}
          >
            <span className="font-mono text-xs text-surface-fg">{level}</span>
          </div>
        ))}
      </div>
    );
  }
  if (demo === "press") {
    return (
      <button
        type="button"
        className="flex h-11 w-full cursor-pointer items-center justify-center rounded-pill bg-surface text-sm text-foreground shadow-frame motion-frame hover:lift active:crush active:shadow-frame-active focus-visible:focus-ring"
      >
        {cta}
      </button>
    );
  }
  if (demo === "duration") {
    return (
      <button
        type="button"
        className="flex h-11 w-full cursor-pointer items-center justify-center rounded-pill bg-surface text-sm text-foreground motion-frame hover:bg-primary hover:text-primary-fg focus-visible:focus-ring"
      >
        {cta}
      </button>
    );
  }
  return (
    <button
      type="button"
      className="flex h-11 w-full cursor-pointer items-center justify-center rounded-pill bg-primary text-sm text-primary-fg motion-frame hover:lift hover:bg-primary-accent focus-visible:focus-ring"
    >
      {cta}
    </button>
  );
}

function InteractionBlock({ t }: { t: Copy }) {
  const it = t.interact;
  return (
    <section
      id="interact"
      className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 scroll-mt-16 border-b"
    >
      <AnimatedContent className="flex flex-col gap-6 mx-auto w-full max-w-320">
        <SectionHead eyebrow={it.eyebrow} title={it.title} desc={it.desc} />
        <div className="grid gap-4 md:grid-cols-2">
          {it.items.map((item) => (
            <Card key={item.n} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className={chipClasses} data-variant="outline">
                  {item.n}
                </span>
                <h3 className="text-sm font-medium">{item.title}</h3>
              </div>
              <DemoBrick demo={item.demo} cta={item.cta} />
              <p className="text-sm text-surface-fg">{item.body}</p>
            </Card>
          ))}
        </div>
      </AnimatedContent>
    </section>
  );
}

function RulesBlock({ t }: { t: Copy }) {
  const r = t.rules;
  const m = t.misc;
  return (
    <section
      id="rules"
      className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 scroll-mt-16 border-b"
    >
      <AnimatedContent className="flex flex-col gap-6 mx-auto w-full max-w-320">
        <SectionHead eyebrow={r.eyebrow} title={r.title} desc={r.desc} />
        <div className="grid gap-4 md:grid-cols-2">
          {r.items.map((item, i) => (
            <Card key={item.title} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={chipClasses} data-variant="outline">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-medium">{item.title}</h3>
              </div>
              <p className="text-sm text-surface-fg">{item.body}</p>
            </Card>
          ))}
        </div>
        <Card className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className={chipClasses} data-variant="danger">
              {r.anti}
            </span>
            <span className="text-xs text-surface-fg">{r.antiDesc}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {m.antiItems.map((bad) => (
              <span key={bad} className={chipClasses} data-variant="outline">
                {bad}
              </span>
            ))}
          </div>
        </Card>
      </AnimatedContent>
    </section>
  );
}
