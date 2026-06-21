import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/ui/button";

const content = {
  en: {
    badge: "v1.0 Released",
    title1: "Build beautiful interfaces",
    title2: "with less effort",
    description:
      "A lightweight, dependency-free UI library for modern web apps. Accessible, composable, and ready for production.",
    primaryCta: "Get Started",
    secondaryCta: "View on GitHub",
  },
  zh: {
    badge: "v1.0 发布",
    title1: "用更少的工作",
    title2: "构建精美的界面",
    description:
      "面向现代 Web 应用的轻量级、零依赖 UI 库。无障碍、可组合,开箱即用。",
    primaryCta: "开始使用",
    secondaryCta: "在 GitHub 查看",
  },
} as const;

export type LandingDemoProps = {
  locale: "en" | "zh";
};

export default function LandingDemo({ locale }: LandingDemoProps) {
  const t = content[locale] ?? content.en;
  const docsPath = `/${locale}/docs`;

  return (
    <div className="grid w-full gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-primary">
          <Sparkles className="h-3 w-3" />
          {t.badge}
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {t.title1}
          <br />
          {t.title2}
        </h2>
        <p className="mt-3 max-w-md text-sm text-fd-muted-foreground md:text-base">
          {t.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to={docsPath}
            className={`${Button.class.base} ${Button.class.variant.primary}`}
          >
            {t.primaryCta}
            <ArrowRight className="size-4" />
          </Link>
          <Button variant="outline">{t.secondaryCta}</Button>
        </div>
      </div>
      <div className="relative hidden md:block">
        <div className="absolute -inset-6 rounded-3xl bg-linear-to-br from-fd-primary/30 via-fd-primary/5 to-transparent blur-2xl" />
        <div className="relative rounded-2xl border border-fd-border bg-fd-background/80 p-4 shadow-lg backdrop-blur">
          <div className="mb-3 flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
          <div className="space-y-2">
            <div className="h-2.5 w-3/4 rounded bg-fd-muted" />
            <div className="h-2.5 w-1/2 rounded bg-fd-muted" />
            <div className="h-2.5 w-5/6 rounded bg-fd-muted" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-20 rounded-md bg-fd-primary" />
            <div className="h-7 w-20 rounded-md border border-fd-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
