import { HomeLayout } from "fumadocs-ui/layouts/home";
import { lazy, useEffect } from "react";
import { Link } from "react-router";
import { baseOptions } from "@/components/layout-shared";
import { Button } from "@/ui";

export const content = {
  en: {
    title: "Litefy UI - Lightweight React Component Library",

    description:
      "Litefy UI is a lightweight React UI library for building modern web apps.",

    heading: (
      <>
        Native at its core
        <br />
        Lean external tooling
      </>
    ),
    subheading:
      "Lightweight native React components with minimal external tooling",
    viewComponentsButton: "View Components",
  },
  zh: {
    title: "Litefy UI - 轻量级无依赖 React 组件库",
    description:
      "Litefy UI 是一款无依赖、轻量级的 React UI 库，提供开箱即用的组件，助你快速构建现代化、响应式的 Web 应用。适合用于个人项目及企业级开发。",
    heading: <>原生为基底 极简外部依赖</>,
    subheading: "轻量原生 React 组件库，仅保留必要外部工具",
    viewComponentsButton: "查看组件",
  },
} as const;

export type Locale = "en" | "zh";

const LazyLandingDemo = lazy(() => import("../demos/showcase/landing-demo"));

export function HomeContent({ locale }: { locale: Locale }) {
  const t = content[locale] ?? content.en;

  useEffect(() => {
    if (typeof window !== "undefined" && locale) {
      localStorage.setItem("preferred-language", locale);
    }
  }, [locale]);

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="p-4 flex flex-col items-center text-center flex-1 w-full">
        <div className="mt-12 w-full max-w-5xl text-left">
          <LazyLandingDemo locale={locale} />
        </div>
        <h1 className="headline">{t.heading}</h1>
        <p className="text-fd-muted-foreground mb-4">{t.subheading}</p>
        <Link
          to={`${locale}/docs/overview`}
          className={`${Button.class.base} ${Button.class.variant.primary}`}
        >
          {t.viewComponentsButton}
        </Link>
      </div>
    </HomeLayout>
  );
}
