"use client";

import { ArrowUpRight } from "@/components/icons";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { toSchemeHref } from "@/lib/style-templates";
import { useLoadMore } from "@/ui";
import { useSiteSkin } from "./site-skin";

type MetaEntry = { name?: string; displayName?: { en: string; zh: string } };
type DemoLoaders = ReturnType<typeof useSiteSkin>["demoModules"];
type DemoLoader = DemoLoaders[string];

const docByLooseName = new Map<string, { section: string; slug: string }>();
for (const path of Object.keys(import.meta.glob("../../content/docs/**/*.mdx"))) {
  const parts = path.slice(path.indexOf("/docs/") + "/docs/".length).split("/");
  if (parts.length !== 2 || parts[1].endsWith(".zh.mdx")) continue;
  const slug = parts[1].slice(0, -".mdx".length);
  docByLooseName.set(slug.replaceAll("-", ""), { section: parts[0], slug });
}

const metaBySection = new Map<string, Record<string, MetaEntry>>();
for (const [path, mod] of Object.entries(
  import.meta.glob("../../content/docs/*/_meta.ts", { eager: true }) as Record<
    string,
    { default: Record<string, MetaEntry> }
  >,
)) {
  metaBySection.set(path.split("/").at(-2)!, mod.default);
}

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

function buildWallItems(demoModules: DemoLoaders): WallItem[] {
  return Object.entries(demoModules)
    .filter(([path]) => {
      const folder = folderOf(path);
      return path.endsWith("/basic.tsx") && !EXCLUDED_FOLDERS.has(folder) && !folder.startsWith("use-");
    })
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([path, loader]) => {
      const folder = folderOf(path);
      const doc = docByLooseName.get(folder.replaceAll("-", ""));
      const section = doc?.section ?? "component";
      const slug = doc?.slug ?? folder;
      const meta = metaBySection.get(section)?.[slug];
      return {
        path,
        folder,
        loader,
        title: (locale: "en" | "zh") => {
          return meta?.displayName?.[locale] ?? meta?.name ?? titleize(folder);
        },
        href: (locale: "en" | "zh") => `/${locale}/docs/${section}/${slug}`,
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
      <div className="block rounded-md bg-accent motion-safe:animate-pulse h-6 w-2/3" />
      <div className="block rounded-md bg-accent motion-safe:animate-pulse h-2 w-full" />
      <div className="block rounded-md bg-accent motion-safe:animate-pulse h-2 w-3/4" />
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
        <div className="py-6 text-xs text-foreground">
          {this.props.locale === "zh" ? "该示例加载失败" : "Failed to load this example"}
        </div>
      );
    }
    return this.props.children;
  }
}

function DemoFitBox({ children }: { children: React.ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number; top: number } | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    let frame = 0;
    const measure = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const availableHeight = box.clientHeight;
        const availableWidth = box.clientWidth;
        const naturalHeight = inner.offsetHeight;
        const naturalWidth = inner.scrollWidth;
        if (!availableHeight || !availableWidth || !naturalHeight) return;
        const scale = Math.min(1, availableHeight / naturalHeight, availableWidth / naturalWidth);
        const height = naturalHeight * scale;
        setFit({ scale, height, top: Math.max(0, (availableHeight - height) / 2) });
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(inner);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={boxRef} className="relative h-full w-full">
      <div
        className="absolute inset-x-0 flex items-start justify-center"
        style={fit ? { top: fit.top, height: fit.height } : { top: 0 }}
      >
        <div
          ref={innerRef}
          className="flex w-full flex-col items-center"
          style={fit ? { transform: `scale(${fit.scale})`, transformOrigin: "top center" } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
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
        <ArrowUpRight className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 size-3.5 text-foreground group-hover:text-accent-fg" />
      </Link>
      <div className="relative h-64 overflow-hidden rounded-b-[inherit] p-6">
        <DemoErrorBoundary locale={locale}>
          <DemoFitBox>
            {near ? (
              <Suspense fallback={<DemoSkeleton />}>
                <LazyDemo Demo={getLazyDemo(item)} />
              </Suspense>
            ) : (
              <DemoSkeleton />
            )}
          </DemoFitBox>
        </DemoErrorBoundary>
      </div>
    </div>
  );
}

const wallContent = {
  en: {
    title: "Overview",
    description:
      "Default examples rendered from the same demos used in the docs. Click a title to open its documentation.",
  },
  zh: {
    title: "总览",
    description: "与文档同源的默认示例实时渲染，点击标题查看完整文档。",
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
        <p className="text-sm text-foreground">
          {t.description}
        </p>
      </header>
      {near && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wallItems.slice(0, visibleCount).map((item) => (
            <WallCard key={item.path} item={item} locale={locale} />
          ))}
        </div>
      )}
      {near && hasMore && (
        <div ref={sentinelRef} aria-hidden className="w-full" style={{ height: 1 }} />
      )}
      {near && !hasMore && (
        <p className="text-center text-xs text-foreground">
          {locale === "zh"
            ? `已展示全部 ${wallItems.length} 个示例`
            : `All ${wallItems.length} examples shown`}
        </p>
      )}
    </div>
  );
}
