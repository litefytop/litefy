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
import { ArrowLeft, ArrowRight, Flag, Github } from "@/components/icons";
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
    back: string;
    hero: { eyebrow: string; cta: string; cta2: string; ramp: string; rampDesc: string };
    nav: { palette: string; tokens: string; type: string; rules: string; more: string };
    navTitle: { palette: string; tokens: string; type: string; rules: string; back: string };
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
      prose: string;
      proseBody: string;
      h3: string;
      bodyLine: string;
      listA: string;
      listB: string;
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
    back: "Back",
    hero: {
      eyebrow: "// style scheme",
      cta: "See the palette",
      cta2: "Read the docs",
      ramp: "Live ramps",
      rampDesc:
        "Every control below repaints as you pick a ramp — the scheme owns the values, the page owns none.",
    },
    nav: { palette: "Palette", tokens: "Tokens", type: "Type", rules: "Rules", more: "Navigation" },
    navTitle: {
      palette: "01 · Palette — the colours, nothing else",
      tokens: "02 · Tokens — every variable name and its role",
      type: "03 · Type — the ladder and the reading scope",
      rules: "04 · The design rules this scheme enforces",
      back: "Back to the docs",
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
      prose: "Reading block",
      proseBody:
        "Inside one container the scheme typesets headings, paragraphs, lists, code and tables — the page writes none of it.",
      h3: "h3 tier",
      bodyLine: "Body copy rides the ladder the container reads from, not a class on this element.",
      listA: "Heading tiers carry their own rhythm",
      listB: "Lists and quotes inherit the reading scope",
    },
    rules: {
      eyebrow: "04 — Design rules",
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
          title: "Near-square radius",
          body: "Four steps plus a pill, on Tailwind's own ladder: sm 4 / md 6 / lg 8 / xl 12px, full for chips and avatars. Each step pairs with a shadow level.",
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
          title: "Four elevation levels",
          body: "faint / subtle / base / elevated. Dark levels carry a white rim and top highlight — never a white blur glow.",
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
          body: "--focus-outline 1px solid --primary-accent with a 3px --focus-glow. Focus is never removed, only restyled.",
        },
        {
          title: "Press, don't move",
          body: "--press-filter darkens by 5%; --translate-crush is 0. Static surfaces never lift on hover.",
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
        "glassmorphism surface",
        "hover-to-reveal control",
        "raw hex in page CSS",
        "white blur glow",
        "double border",
      ],
    },
  },
  zh: {
    back: "返回",
    hero: {
      eyebrow: "// 风格方案",
      cta: "查看色盘",
      cta2: "阅读文档",
      ramp: "实时色阶",
      rampDesc: "切换色阶后本页全部重绘——色值由方案持有，页面一个都不写。",
    },
    nav: { palette: "色盘", tokens: "令牌", type: "排版", rules: "规则", more: "导航" },
    navTitle: {
      palette: "01 · 色盘——只看颜色",
      tokens: "02 · 令牌——每个变量名与它的角色",
      type: "03 · 排版——字阶与长文作用域",
      rules: "04 · 这套方案强制执行的设计规则",
      back: "返回文档",
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
      prose: "正文块",
      proseBody: "一个容器之内，标题、段落、列表、行内代码与表格全由方案排版——页面一个字都不写。",
      h3: "h3 层级",
      bodyLine: "正文读的是容器带来的阶梯，不是这个元素上的类。",
      listA: "标题层级自带排版节奏",
      listB: "列表与引用继承长文作用域",
    },
    rules: {
      eyebrow: "04 — 设计规则",
      title: "本方案的设计规则",
      desc: "每条规则都是方案持有的令牌或属性，而不是风格手册里的口头约定——换方案，规则就换。",
      anti: "反模式",
      antiDesc: "方案一律拒绝，任何页面都不例外。",
      items: [
        { title: "样式单一来源", body: "观感的每一像素都来自方案持有的令牌，页面一个都不写。" },
        {
          title: "近直角圆角",
          body: "四档加胶囊，走 Tailwind 自己的圆角刻度：sm 4 / md 6 / lg 8 / xl 12px，full 留给 chip 与头像。每一档与一个阴影等级一一配对。",
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
          title: "四级阴影",
          body: "faint / subtle / base / elevated。深色层带白色内圈与顶部高光——绝不用白色模糊假造高度。",
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
          body: "--focus-outline 取 1px 的 --primary-accent，配 3px --focus-glow。焦点不移除，只换样式。",
        },
        {
          title: "按压不位移",
          body: "--press-filter 变暗 5%，--translate-crush 为 0。静态表面悬停永不抬升。",
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
      antiItems: [
        "渐变文字",
        "玻璃拟态表面",
        "悬停才显示的控件",
        "页面写死色值",
        "白色模糊假阴影",
        "双线边框",
      ],
    },
  },
};

const BLOCKS = ["palette", "tokens", "type", "rules"] as const;

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
  if (tpl.slug === "clinical") {
    return <Navigate to={`/clinical/${lang === "zh" ? "zh" : "en"}/showcase/clinical`} replace />;
  }
  if (tpl.slug === "neon-gradient") {
    return <Navigate to={`/neon/${lang === "zh" ? "zh" : "en"}/showcase/neon-gradient`} replace />;
  }
  const langNormalized: Lang = lang === "zh" ? "zh" : "en";
  return (
    <TemplateScene
      tpl={tpl}
      lang={langNormalized}
      backHref={`/${langNormalized}`}
      docsHref={`/${langNormalized}/docs`}
    />
  );
}

function TemplateScene({
  tpl,
  lang,
  backHref,
  docsHref,
}: {
  tpl: StyleTemplate;
  lang: Lang;
  backHref: string;
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
      <header className="flex h-[3.5rem] items-center gap-2 px-4 md:px-6 lg:px-8 sticky top-0 z-40 border-b bg-surface">
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
            title={otherLang === "en" ? "Switch to English" : "切换到中文"}
            data-variant="outline"
            className="shrink-0"
          >
            {otherLang === "en" ? "EN" : "中文"}
          </Button>
          <Link to={backHref} className={cn(textLinkClass, "shrink-0")} title={t.navTitle.back}>
            <ArrowLeft className="size-4" aria-hidden />
            {t.back}
          </Link>
        </div>
      </header>

      <main className="flex flex-col flex-1 w-full">
        <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 border-b bg-surface text-on-surface">
          <div className="grid gap-6 mx-auto w-full max-w-320 md:grid-cols-[1.2fr_1fr] md:items-center">
            <header className="flex flex-col gap-3">
              <p className="m-0 scroll-mt-20 text-xs font-medium tracking-widest uppercase">
                {t.hero.eyebrow}
              </p>
              <h1 className="m-0 scroll-mt-20 py-4 mb-4 text-[2.25rem] leading-10 tracking-tight font-bold sm:text-[3rem] sm:leading-none lg:text-[3.75rem] lg:leading-none">
                {templateTitle(tpl, lang)}
              </h1>
              <p className="max-w-256 text-sm text-surface-fg">{tpl.desc[lang]}</p>
              <div className="flex flex-wrap gap-2">
                <a href="#palette" className={buttonVariants.primary}>
                  {t.hero.cta}
                  <ArrowRight className="size-4" aria-hidden />
                </a>
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
            <Link to={backHref} className={cn(textLinkClass, "ms-auto")}>
              <ArrowLeft className="size-4" aria-hidden />
              {t.back}
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
      <p className="m-0 scroll-mt-20 text-xs font-medium tracking-widest uppercase">{eyebrow}</p>
      <h2 className="text-2xl font-medium">{title}</h2>
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
                className="h-[3.5rem] rounded-sm border"
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
            <p className="m-0 scroll-mt-20 py-4 mb-4 text-[2.25rem] leading-10 tracking-tight font-bold sm:text-[3rem] sm:leading-none lg:text-[3.75rem] lg:leading-none">
              headline
            </p>
            <h4 className="m-0 scroll-mt-20 font-semibold leading-head text-h4 mt-[1.5em]">
              h4 tier
            </h4>
            <p className="m-0 scroll-mt-20 text-surface-fg text-base leading-6 sm:text-lg sm:leading-7">
              {ty.proseBody}
            </p>
            <span className="m-0 scroll-mt-20 text-surface-fg text-xs font-semibold tracking-wide">
              label
            </span>
            <p className="m-0 scroll-mt-20 text-xs font-medium tracking-widest uppercase">
              overline
            </p>
            <code className="text-xs text-primary-accent">
              {"headline · h4 · description · label · overline"}
            </code>
          </Card>

          <Card className="flex flex-col gap-3 lg:col-span-2">
            <div className="typography flex flex-col gap-2">
              <h2>{ty.prose}</h2>
              <p>{ty.proseBody}</p>
              <h3>{ty.h3}</h3>
              <p>{ty.bodyLine}</p>
              <ul>
                <li>{ty.listA}</li>
                <li>{ty.listB}</li>
              </ul>
            </div>
            <code className="text-xs text-primary-accent">
              {"typography class · headings, body and list need no annotation"}
            </code>
          </Card>
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
