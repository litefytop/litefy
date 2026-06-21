"use client";

import { HourglassIcon } from "lucide-react";
import { lazy, Suspense } from "react";
import { cn } from "@/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import SignupDemo from "../demos/showcase/signup-demo";

export type ShowcaseLocale = "en" | "zh";

const LazySettingsDemo = lazy(() => import("../demos/showcase/settings-demo"));

const tabLabels = {
  signup: { en: "Sign-up Form", zh: "注册表单" },
  settings: { en: "Settings Panel", zh: "设置面板" },
  comingSoon: { en: "More Examples", zh: "更多示例" },
} as const;

const comingSoonContent = {
  en: {
    title: "More examples coming soon",
    description:
      "We're building more showcase blocks. Check back later for updates.",
  },
  zh: {
    title: "更多示例即将推出",
    description: "我们正在构建更多展示块，敬请期待后续更新。",
  },
} as const;

const PANEL_BASE =
  "mx-auto w-full max-w-[800px] min-h-[600px] p-8 flex items-center justify-center";

function BlockSkeleton() {
  return (
    <div className="flex h-full min-h-[600px] w-full items-center justify-center">
      <div className="h-3/4 w-full max-w-3xl animate-pulse rounded-xl bg-fd-muted/50" />
    </div>
  );
}

interface ShowcaseBlocksProps {
  locale: ShowcaseLocale;
  className?: string;
}

export function ShowcaseBlocks({ locale, className }: ShowcaseBlocksProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-fd-border bg-fd-card text-fd-card-foreground shadow-sm",
        className,
      )}
    >
      <Tabs className="gap-0" defaultValue="signup">
        <TabsList className="p-2">
          <TabsTrigger value="signup">{tabLabels.signup[locale]}</TabsTrigger>
          <TabsTrigger value="settings">
            {tabLabels.settings[locale]}
          </TabsTrigger>
          <TabsTrigger value="coming-soon">
            {tabLabels.comingSoon[locale]}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <div className={PANEL_BASE}>
            <SignupDemo />
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className={PANEL_BASE}>
            <Suspense fallback={<BlockSkeleton />}>
              <LazySettingsDemo />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="coming-soon">
          <div className={cn(PANEL_BASE, "flex-col gap-3 text-center")}>
            <div className="flex size-12 items-center justify-center rounded-full bg-fd-muted text-fd-muted-foreground">
              <HourglassIcon className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-fd-foreground">
              {comingSoonContent[locale].title}
            </h3>
            <p className="max-w-sm text-sm text-fd-muted-foreground">
              {comingSoonContent[locale].description}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
