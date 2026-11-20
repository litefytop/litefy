import browserCollections from "collections/browser";
import type { Root } from "fumadocs-core/page-tree";
import { DocsArticle, DocsShell, type TocHeading } from "@/components/docs-shell";
import { ExampleWall } from "@/components/example-wall";
import { type FC, useSyncExternalStore } from "react";
import { useParams } from "react-router";
import { useMDXComponents } from "@/components/mdx";
import { pageTrees } from "@/generated/page-trees";
import { siteDefaultLanguage } from "@/lib/i18n";
import { FloatingNav } from "@/components/floating-nav";
import { buildMarkdownUrl } from "@/lib/markdown-url";
import { jsonLdScript, socialMetaTags } from "@/lib/seo";
import { stripSchemePrefix } from "@/lib/style-templates";
import { appName, siteUrl } from "@/lib/shared";

type Locale = keyof typeof pageTrees;

function docPageMeta(path: string): { locale: "en" | "zh"; url: string } {
  const locale: "en" | "zh" = path.endsWith(".zh.mdx") ? "zh" : "en";
  const base = path.replace(/\.mdx$/u, "").replace(/\.zh$/u, "");
  return {
    locale,
    url: `${siteUrl}/${locale}/docs${base === "index" ? "" : `/${base}`}`,
  };
}

type Crumb = { name: string; url?: string };

function collectCrumbs(tree: Root, url: string): Crumb[] {
  const walk = (nodes: Root["children"], ancestors: Crumb[]): Crumb[] | null => {
    for (const node of nodes) {
      if (node.type === "folder") {
        const found = walk(node.children ?? [], [...ancestors, { name: String(node.name) }]);
        if (found) return found;
      } else if (node.type === "page" && node.url === url) {
        return [...ancestors, { name: String(node.name), url: node.url }];
      }
    }
    return null;
  };
  return walk(tree.children ?? [], []) ?? [];
}

const docsIndexI18n = {
  en: {
    title: "Overview",
    description: "Browse every component, CSS utility, and hook available in Litefy UI.",
  },
  zh: {
    title: "总览",
    description: "浏览 Litefy UI 中所有可用的组件、CSS 工具类与工具函数。",
  },
} as const;

const EMPTY_TOC: TocHeading[] = [];
const tocStore = new Map<string, TocHeading[]>();
const tocListeners = new Set<() => void>();
function subscribeToc(onStoreChange: () => void) {
  tocListeners.add(onStoreChange);
  return () => tocListeners.delete(onStoreChange);
}
function setToc(path: string, toc: TocHeading[]) {
  const prev = tocStore.get(path);
  if (prev === toc || (prev && prev.length === toc.length)) return;
  tocStore.set(path, toc);
  tocListeners.forEach((listener) => listener());
}

const clientLoader = browserCollections.docs.createClientLoader({
  component: function DocsPage(
    { toc: pageToc, frontmatter, default: Mdx },
    {
      markdownUrl,
      path,
    }: {
      markdownUrl: string;
      path: string;
    },
  ) {
    const { locale, url } = docPageMeta(path);
    const pageTitle = frontmatter.title.includes(appName)
      ? frontmatter.title
      : `${frontmatter.title} - ${appName}`;
    const description = frontmatter.description ?? "";
    const crumbs = collectCrumbs(pageTrees[locale].data as unknown as Root, new URL(url).pathname);
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: appName, item: `${siteUrl}/${locale}` },
        ...crumbs.map((crumb, i) => Object.assign(
          { "@type": "ListItem", position: i + 2, name: crumb.name },
          crumb.url ? { item: `${siteUrl}${crumb.url}` } : {},
        )),
      ],
    };

    const toc: TocHeading[] = (pageToc as TocHeading[] | undefined) ?? [];
    setToc(new URL(url).pathname, toc);
    return (
      <>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        {socialMetaTags({ title: pageTitle, description, url, locale })}
        {jsonLdScript(breadcrumb)}
        <DocsArticle
          title={String(frontmatter.title)}
          description={frontmatter.description ? String(frontmatter.description) : undefined}
          locale={locale}
          markdownUrl={markdownUrl}
          githubPath={`content/docs/${path}`}
        >
          <Mdx components={useMDXComponents()} />
        </DocsArticle>
      </>
    );
  },
});

const mdxFiles = new Set(
  Object.keys(browserCollections.docs.raw).map((key) => (key.startsWith("./") ? key.slice(2) : key)),
);

export async function preloadDocsPage(pathname: string): Promise<void> {
  const match = /^\/(en|zh)\/docs\/(.*)$/u.exec(stripSchemePrefix(pathname));
  if (!match) return;
  const [, lang, rest] = match;
  const slugs = rest.split("/").filter(Boolean);
  if (slugs[0] === "overview") return;
  const path = `${slugs.length === 0 ? "index" : slugs.join("/")}${lang === "zh" ? ".zh" : ""}.mdx`;
  if (mdxFiles.has(path)) await clientLoader.preload(path);
}

function resolveLocale(input: string | undefined): Locale {
  if (input && input in pageTrees) return input as Locale;
  return siteDefaultLanguage as Locale;
}

function DocPage({ Page, markdownUrl, path }: { Page: FC<{ markdownUrl: string; path: string }>; markdownUrl: string; path: string }) {
  return <Page markdownUrl={markdownUrl} path={path} />;
}

export default function DocsView() {
  const routeParams = useParams<{ lang: string; "*"?: string }>();
  const locale = resolveLocale(routeParams.lang);
  const wildcard = routeParams["*"] ?? "";
  const slugs = wildcard ? wildcard.split("/").filter((v: string) => v.length > 0) : [];
  const shellToc = useSyncExternalStore(
    subscribeToc,
    () => tocStore.get(`/${locale}/docs/${wildcard}`) ?? EMPTY_TOC,
    () => EMPTY_TOC,
  );

  const t = docsIndexI18n[locale] || docsIndexI18n.en;
  const rawTree = pageTrees[locale].data as unknown as Root;

  const isOverview = slugs[0] === "overview";
  const isIndexRoot = slugs.length === 0;
  const effectiveSlugs = isIndexRoot ? ["index"] : slugs;

  if (isOverview) {
    // overview：无正文文案，页面主体只有示例墙
    const pageTitle = `${t.title} - ${appName}`;
    const url = `${siteUrl}/${locale}/docs/overview`;
    return (
      <DocsShell tree={rawTree} locale={locale}>
        <title>{pageTitle}</title>
        <meta name="description" content={t.description} />
        {socialMetaTags({ title: pageTitle, description: t.description, url, locale })}
        <ExampleWall locale={locale === "zh" ? "zh" : "en"} />
        <FloatingNav tree={rawTree} />
      </DocsShell>
    );
  }

  const basePath = effectiveSlugs.join("/");
  const fullPath = locale === "zh" ? `${basePath}.zh.mdx` : `${basePath}.mdx`;
  const PageContent = clientLoader.getComponent(fullPath);

  if (PageContent) {
    const markdownUrl = buildMarkdownUrl(locale, isIndexRoot ? [] : slugs).url;
    return (
      <DocsShell tree={rawTree} locale={locale} toc={shellToc}>
        <DocPage Page={PageContent} markdownUrl={markdownUrl} path={fullPath} />
        <FloatingNav tree={rawTree} />
      </DocsShell>
    );
  }

  // 兜底：mdx 未就绪或未知路径，同总览页只展示示例墙
  return (
    <DocsShell tree={rawTree} locale={locale}>
      <ExampleWall locale={locale === "zh" ? "zh" : "en"} />
      <FloatingNav tree={rawTree} />
    </DocsShell>
  );
}
