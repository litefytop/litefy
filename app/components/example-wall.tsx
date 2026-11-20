"use client";

import { ArrowUpRight } from "@/components/icons";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { toSchemeHref } from "@/lib/style-templates";
import componentMeta from "../../content/docs/component/_meta";
import { Masonry, useLoadMore } from "@/ui";
import { useSiteSkin } from "./site-skin";

type MetaEntry = { name?: string; displayName?: { en: string; zh: string } };
type DemoLoaders = ReturnType<typeof useSiteSkin>["demoModules"];
type DemoLoader = DemoLoaders[string];

const docSlugs = Object.keys(import.meta.glob("../../content/docs/component/*.mdx"))
  .map((path) => path.slice(path.lastIndexOf("/") + 1, -".mdx".length))
  .filter((slug) => !slug.endsWith(".zh"));

const docSlugByLooseName = new Map(
  docSlugs.map((slug) => [slug.replaceAll('-', ""), slug] as const)
);

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
  loader: DemoLoader;
  title: (locale: "en" | "zh") => string;
  href: (locale: "en" | "zh") => string;
}

function folderOf(path: string) {
  const parts = path.split("/");
  return parts.at(-2)!;
}

function fileOf(path: string) {
  const parts = path.split("/");
  return parts.at(-1)!.replace(/\.tsx$/u, "");
}

function buildWallItems(demoModules: DemoLoaders): WallItem[] {
  return Object.entries(demoModules)
    .filter(([path]) => {
      const folder = folderOf(path);
      return !EXCLUDED_FOLDERS.has(folder) && !folder.startsWith("use-");
    })
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([path, loader]) => {
      const folder = folderOf(path);
      const file = fileOf(path);
      const slug = docSlugByLooseName.get(folder.replaceAll('-', "")) ?? folder;
      const meta = (componentMeta as Record<string, MetaEntry>)[slug];
      return {
        path,
        folder,
        loader,
        title: (locale: "en" | "zh") => {
          const componentName =
            meta?.displayName?.[locale] ?? meta?.name ?? titleize(folder);
          const variant = file === "basic" ? "" : ` · ${titleize(file)}`;
          return `${componentName}${variant}`;
        },
        href: (locale: "en" | "zh") => `/${locale}/docs/component/${slug}`,
      };
    });
}

const lazyCache = new Map<DemoLoader, React.LazyExoticComponent<React.ComponentType>>();
const nearCache = new Set<string>();

function getLazyDemo(item: WallItem) {
  let component = lazyCache.get(item.loader);
  if (!component) {
    component = React.lazy(item.loader);
    lazyCache.set(item.loader, component);
  }
  return component;
}

function useNearViewport<T extends HTMLElement>(rootMargin: string, initial = false) {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(initial);

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
    <div className="flex flex-col items-center gap-2 w-full max-w-64">
      <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[1.5rem] w-[66%]" />
      <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[0.5rem] w-full" />
      <div className="block rounded-md bg-accent motion-safe:animate-pulse h-[0.5rem] w-[75%]" />
    </div>
  );
}

function LazyDemo({ Demo }: { Demo: React.ComponentType | React.LazyExoticComponent<React.ComponentType> }) {
  return <Demo />;
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
        <div className="py-6 text-xs text-surface-fg">
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
  const { ref, near } = useNearViewport<HTMLDivElement>("200px", nearCache.has(item.path));
  const { pathname } = useLocation();

  useEffect(() => {
    if (near) nearCache.add(item.path);
  }, [near, item.path]);

  return (
    <div
      ref={ref}
      className="rounded-lg border bg-background shadow-base transition-shadow hover:shadow-elevated"
    >
      <Link
        to={toSchemeHref(pathname, item.href(locale))}
        className="group flex items-center justify-between rounded-t-[inherit] px-4 py-2 border-b text-sm font-medium transition-colors hover:bg-accent hover:text-accent-fg"
      >
        <span>{item.title(locale)}</span>
        <ArrowUpRight className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 size-3.5 text-surface-fg" />
      </Link>
      <div className="p-6 flex items-center justify-center min-h-[9rem] overflow-hidden rounded-b-[inherit] *:max-w-full *:min-w-0">
        <DemoErrorBoundary locale={locale}>
          {near ? (
            <Suspense fallback={<DemoSkeleton />}>
              <LazyDemo Demo={getLazyDemo(item)} />
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
    title: "Overview",
    description:
      "Live examples rendered from the same demos used in the docs. Click a title to open its documentation.",
  },
  zh: {
    title: "总览",
    description: "与文档同源的示例实时渲染，点击标题查看对应文档。",
  },
} as const;

export function ExampleWall({ locale }: { locale: "en" | "zh" }) {
  const { demoModules } = useSiteSkin();
  const wallItems = useMemo(() => buildWallItems(demoModules), [demoModules]);
  const t = wallContent[locale] ?? wallContent.en;
  const { ref, near } = useNearViewport<HTMLDivElement>("400px");
  const scrollRootRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    scrollRootRef.current =
      ref.current?.closest<HTMLElement>("[data-scroll-root]") ?? null;
  }, [ref]);
  const { visibleCount, hasMore, sentinelRef } = useLoadMore({
    total: wallItems.length,
    pageSize: 12,
    root: scrollRootRef,
  });

  return (
    <div
      ref={ref}
      className="flex flex-col gap-6 w-full max-w-288 mx-auto"
    >
      <header className="flex flex-col gap-1">
        <h1 className="typo-h1">{t.title}</h1>
        <p className="text-sm text-surface-fg">
          {t.description}
        </p>
      </header>
      {near && (
        <Masonry
          items={wallItems.slice(0, visibleCount)}
          getKey={(item) => item.path}
          renderItem={(item) => <WallCard key={item.path} item={item} locale={locale} />}
        />
      )}
      {near && hasMore && (
        <div ref={sentinelRef} aria-hidden className="w-full" style={{ height: 1 }} />
      )}
      {near && !hasMore && (
        <p className="text-center text-xs text-surface-fg">
          {locale === "zh"
            ? `已展示全部 ${wallItems.length} 个示例`
            : `All ${wallItems.length} examples shown`}
        </p>
      )}
    </div>
  );
}
