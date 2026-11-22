import { HomeShell } from "@/components/docs-shell";
import { ArrowRight } from "@/components/icons";
import { CardLink } from "@/components/card-link";
import { useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { ShowcaseCard } from "@/components/showcase-card";
import { siteDefaultLanguage } from "@/lib/i18n";
import { jsonLdScript } from "@/lib/seo";
import { appName, gitConfig, siteUrl } from "@/lib/shared";
import { SiteSkinProvider, useSiteSkin } from "@/components/site-skin";
import { siteSkin } from "@/components/site-skin-bundle";
import {
  LANGUAGES,
  SCHEME_PREFIXES,
  findStyleTemplateByPath,
  toSchemeHref,
} from "@/lib/style-templates";

export type Locale = "en" | "zh";

export const homeContent = {
  en: {
    title: "Litefy UI - Lightweight React Component Library",
    description:
      "Litefy UI is a lightweight React UI library for building modern web apps.",
    hero: {
      eyebrow: "Headless base · swappable schemes",
      title: (
        <>
          Ready out of the box.
          <br />
          Flexible by design.
        </>
      ),
      body: "Litefy UI is a modern React component library for the web: the headless base carries behaviour and accessibility, the scheme stylesheet carries the look. Iterate fast, keep everything consistent, and swap the whole page's design language whenever you want a new one.",
      componentsCta: "View components",
      docsCta: "Read the docs",
    },
    steps: {
      eyebrow: "how it is put together",
      title: "Two pieces, installed in this order",
      body: "The library is the behaviour; a scheme is the look. Nothing in the first piece depends on the second.",
      baseLabel: "1 · Base",
      baseTitle: "Install the library and you already have behaviour",
      baseBody: "Focus management, keyboard paths, ARIA wiring and the structural mechanics all live in the skeleton — a working control before a single style rule is loaded.",
      baseCta: "Open the installation guide",
      schemeLabel: "2 · Scheme",
      schemeTitle: "One self-contained stylesheet per style",
      schemeBody: "Tokens, focus rings, shadows, spacing and every control's look live in a single package. A page loads exactly one of them; switching styles means navigating, not swapping CSS at runtime.",
      schemeCta: "Open the scheme stylesheets",
    },
  },
  zh: {
    title: "Litefy UI - 轻量级无依赖 React 组件库",
    description:
      "Litefy UI 是一款无依赖、轻量级的 React UI 库，提供开箱即用的组件，助你快速构建现代化、响应式的 Web 应用。适合用于个人项目及企业级开发。",
    hero: {
      eyebrow: "无头基座 · 皮肤可换",
      title: (
        <>
          开箱即用，
          <br />
          灵活可定制。
        </>
      ),
      body: "Litefy UI 是面向 Web 的现代 React 组件库：无头基座交出行为与无障碍，方案样式表交出外观。助你快速迭代、保持风格一致，需要时整页换一套设计语言。",
      componentsCta: "查看组件",
      docsCta: "阅读文档",
    },
    steps: {
      eyebrow: "它是怎么拼起来的",
      title: "两块东西，按这个顺序装",
      body: "库负责行为，方案负责外观。第一块不依赖第二块也能正常工作。",
      baseLabel: "1 · 基座",
      baseTitle: "装上库，先拿到行为",
      baseBody: "焦点管理、键盘路径、ARIA 接线与结构性机制都在骨架里，一条样式规则都没加载时控件也已经能用。",
      baseCta: "看安装说明",
      schemeLabel: "2 · 方案",
      schemeTitle: "每种风格一份自足的样式表",
      schemeBody: "令牌、焦点环、阴影、间距和每个控件的外观都住在同一个包里。一个页面只加载其中一份，换风格靠跳转，而不是运行期替换 CSS。",
      schemeCta: "打开方案样式表",
    },
  },
} as const;

function LandingHero({ locale, pathname }: { locale: Locale; pathname: string }) {
  const { buttonVariants } = useSiteSkin();
  const t = homeContent[locale].hero;
  const docsHref = toSchemeHref(pathname, `/${locale}/docs`);
  const componentsHref = toSchemeHref(pathname, `/${locale}/docs/overview`);

  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 border-b bg-surface text-on-surface">
      <div className="grid gap-6 mx-auto w-full max-w-320 md:grid-cols-[1.2fr_1fr] md:items-center">
        <header className="flex flex-col gap-3">
          <p className="m-0 scroll-mt-20 typo-kicker">
            {t.eyebrow}
          </p>
          <h1 className="m-0 scroll-mt-20 py-4 mb-4 typo-headline">
            {t.title}
          </h1>
          <p className="max-w-256 text-sm text-surface-fg">{t.body}</p>
          <div className="flex flex-wrap gap-2">
            <Link to={componentsHref} className={buttonVariants.primary}>
              {t.componentsCta}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link to={docsHref} className={buttonVariants.outline}>
              {t.docsCta}
            </Link>
          </div>
        </header>
        <ShowcaseCard lang={locale} template={findStyleTemplateByPath(pathname)} />
      </div>
    </section>
  );
}

function StepsSection({ locale, pathname }: { locale: Locale; pathname: string }) {
  const t = homeContent[locale].steps;
  const steps = [
    {
      label: t.baseLabel,
      title: t.baseTitle,
      body: t.baseBody,
      cta: t.baseCta,
      to: `/${locale}/docs/installation`,
    },
    {
      label: t.schemeLabel,
      title: t.schemeTitle,
      body: t.schemeBody,
      cta: t.schemeCta,
      to: `/${locale}/docs/styles`,
    },
  ];

  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
      <div className="flex flex-col gap-4 mx-auto w-full max-w-320">
        <div className="flex flex-col gap-2">
          <p className="m-0 scroll-mt-20 typo-overline">
            {t.eyebrow}
          </p>
          <h2 className="text-2xl font-medium">{t.title}</h2>
          <p className="max-w-256 text-sm text-surface-fg">{t.body}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <CardLink
              key={step.to}
              to={toSchemeHref(pathname, step.to)}
              className="flex flex-col gap-2"
            >
              <p className="m-0 scroll-mt-20 text-surface-fg text-xs font-semibold tracking-wide">
                {step.label}
              </p>
              <h3 className="text-base font-medium">{step.title}</h3>
              <p className="text-sm text-surface-fg">{step.body}</p>
              <span
                className="flex items-center gap-1 text-sm font-medium text-primary"
              >
                {step.cta}
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </CardLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeRoute() {
  const params = useParams<{ lang: string }>();
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const lang = params.lang ?? siteDefaultLanguage;
  const schemePrefix = SCHEME_PREFIXES.find((p) => p.replace(/^\//u, "") === lang);
  useEffect(() => {
    if (schemePrefix) {
      navigate(`${schemePrefix}/${siteDefaultLanguage}`, { replace: true });
    }
  }, [schemePrefix, navigate]);
  const locale = (LANGUAGES.includes(lang) ? lang : siteDefaultLanguage) as Locale;
  return (
    <SiteSkinProvider skin={siteSkin}>
      <HomeContent locale={locale} pathname={pathname} />
    </SiteSkinProvider>
  );
}

export function HomeContent({ locale, pathname }: { locale: Locale; pathname: string }) {
  const t = homeContent[locale] ?? homeContent.en;

  useEffect(() => {
    if (typeof window !== "undefined" && locale) {
      localStorage.setItem("preferred-language", locale);
    }
  }, [locale]);

  return (
    <HomeShell locale={locale}>
      <LandingHero locale={locale} pathname={pathname} />
      <StepsSection locale={locale} pathname={pathname} />
      {jsonLdScript([
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: appName,
          url: `${siteUrl}/`,
          inLanguage: locale,
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: appName,
          url: `${siteUrl}/`,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          description: t.description,
          author: {
            "@type": "Organization",
            name: "Litefy",
            url: `https://github.com/${gitConfig.user}`,
          },
        },
      ])}
    </HomeShell>
  );
}
