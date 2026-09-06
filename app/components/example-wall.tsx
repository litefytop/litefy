"use client";

import { ArrowUpRight } from "lucide-react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import componentMeta from "../../content/docs/component/_meta";
import { Masonry, cn, useLoadMore } from "@/ui";

type DemoModule = { default: React.ComponentType };
type MetaEntry = { name?: string; displayName?: { en: string; zh: string } };

const demoModules = import.meta.glob<DemoModule>("../demos/**/*.tsx");

const EXCLUDED_FOLDERS = new Set([
  "virtual-scroll",
  "use-drag",
  "use-pagination",
  "use-remote-pagination",
  "use-theme",
]);

function titleize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

interface WallItem {
  path: string;
  folder: string;
  title: (locale: "en" | "zh") => string;
  href: (locale: "en" | "zh") => string;
}

const wallItems: WallItem[] = Object.entries(demoModules)
  .map(([path, loader]) => ({ path, loader }))
  .filter(({ path }) => {
    const folder = path.split("/")[2];
    return !EXCLUDED_FOLDERS.has(folder) && !folder.startsWith("use-");
  })
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(({ path }) => {
    const parts = path.split("/");
    const folder = parts[2];
    const file = parts[3].replace(/\.tsx$/, "");
    const meta = (componentMeta as Record<string, MetaEntry>)[folder];
    return {
      path,
      folder,
      title: (locale: "en" | "zh") => {
        const componentName =
          meta?.displayName?.[locale] ?? meta?.name ?? titleize(folder);
        const variant = file === "basic" ? "" : ` · ${titleize(file)}`;
        return `${componentName}${variant}`;
      },
      href: (locale: "en" | "zh") => `/${locale}/docs/component/${folder}`,
    };
  });

const lazyCache = new Map<string, React.LazyExoticComponent<React.ComponentType>>();

function getLazyDemo(path: string) {
  let component = lazyCache.get(path);
  if (!component) {
    component = React.lazy(demoModules[path]);
    lazyCache.set(path, component);
  }
  return component;
}

function useNearViewport<T extends HTMLElement>(rootMargin: string) {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return { ref, near };
}

function DemoSkeleton() {
  return (
    <div className="flex w-full max-w-56 flex-col items-center gap-2.5">
      <div className="h-7 w-2/3 animate-pulse rounded-md bg-fd-muted" />
      <div className="h-2.5 w-full animate-pulse rounded bg-fd-muted" />
      <div className="h-2.5 w-3/4 animate-pulse rounded bg-fd-muted" />
    </div>
  );
}

class DemoErrorBoundary extends React.Component<
  { locale: "en" | "zh"; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("[example-wall]", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="py-8 text-xs text-fd-muted-foreground">
          {this.props.locale === "zh" ? "该示例加载失败" : "Failed to load this example"}
        </div>
      );
    }
    return this.props.children;
  }
}

function WallCard({
  item,
  locale,
}: {
  item: WallItem;
  locale: "en" | "zh";
}) {
  const { ref, near } = useNearViewport<HTMLDivElement>("200px");
  const Demo = near ? getLazyDemo(item.path) : null;

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border bg-background transition-shadow hover:shadow-md"
    >
      <Link
        to={item.href(locale)}
        className="group flex items-center justify-between border-b px-4 py-2.5 text-sm font-medium transition-colors hover:bg-fd-muted/50"
      >
        <span>{item.title(locale)}</span>
        <ArrowUpRight className="size-3.5 text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
      <div className="flex min-h-36 items-center justify-center overflow-hidden p-6">
        <DemoErrorBoundary locale={locale}>
          {Demo ? (
            <Suspense fallback={<DemoSkeleton />}>
              <Demo />
            </Suspense>
          ) : (
            <DemoSkeleton />
          )}
        </DemoErrorBoundary>
      </div>
    </div>
  );
}

const wallContent = {
  en: {
    title: "Example Wall",
    description:
      "Live examples rendered from the same demos used in the docs. Click a title to open its documentation.",
  },
  zh: {
    title: "示例墙",
    description: "与文档同源的示例实时渲染，点击标题查看对应文档。",
  },
} as const;

export function ExampleWall({ locale }: { locale: "en" | "zh" }) {
  const t = wallContent[locale] ?? wallContent.en;
  const { ref, near } = useNearViewport<HTMLDivElement>("400px");
  const { visibleCount, hasMore, sentinelRef } = useLoadMore({
    total: wallItems.length,
    pageSize: 12,
  });

  return (
    <div ref={ref} className="mt-20 w-full max-w-6xl text-left">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.title}</h2>
          <p className="mt-1 text-sm text-fd-muted-foreground">
            {t.description}
          </p>
        </div>
        <Link
          to={`/${locale}/docs/overview`}
          className={cn(
            "shrink-0 text-sm font-medium text-fd-primary hover:underline",
          )}
        >
          {locale === "zh" ? "查看全部组件" : "View all components"}
        </Link>
      </div>
      {near && (
        <Masonry
          items={wallItems.slice(0, visibleCount)}
          getKey={(item) => item.path}
          renderItem={(item) => <WallCard key={item.path} item={item} locale={locale} />}
        />
      )}
      {near && hasMore && (
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      )}
      {near && !hasMore && (
        <p className="mt-6 text-center text-xs text-fd-muted-foreground">
          {locale === "zh"
            ? `已展示全部 ${wallItems.length} 个示例`
            : `All ${wallItems.length} examples shown`}
        </p>
      )}
    </div>
  );
}
