import { HomeLayout } from "fumadocs-ui/layouts/home";
import { lazy, useEffect } from "react";
import { ShowcaseBlocks } from "@/components/showcase-blocks";
import { baseOptions } from "@/lib/layout.shared";

export const content = {
  en: {
    title: "Litefy UI",
    description: "Welcome to Litefy UI!",
    heading: (
      <>
        Native at its core
        <br />
        Lean external tooling
      </>
    ),
    subheading:
      "Lightweight native React components with minimal external tooling",
  },
  zh: {
    title: "Litefy UI",
    description: "欢迎来到 Litefy UI！",
    heading: <>原生为基底 极简外部依赖</>,
    subheading: "轻量原生 React 组件库，仅保留必要外部工具",
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
        <div className="mt-12 w-full max-w-5xl text-left">
          <ShowcaseBlocks locale={locale} />
        </div>
      </div>
    </HomeLayout>
  );
}
