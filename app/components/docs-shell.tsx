"use client";
import { type Folder, type Item, type Root, type Separator } from "fumadocs-core/page-tree";
import { ChevronDown, Languages, Letters, PanelLeft, Search, X } from "@/components/icons";
import * as React from "react";
import { Link, useLocation, useNavigate, useNavigationType } from "react-router";
import logoRaw from "../assets/logo.svg?raw";
import { appName, gitConfig, siteUrl } from "../lib/shared";
import { schemePrefixOf, stripSchemePrefix, toSchemeHref } from "../lib/style-templates";
import { copyText } from "../lib/clipboard";
import { Github } from "@/components/icons";
import { AppearancePanel } from "./appearance-panel";
import { StyleMenu, StyleSelect } from "./style-select";
import { DocsSearchDialog, DocsSearchTrigger, useSearchHotkey } from "./docs-search";
import { MotionPreferenceNotice } from "./motion-preference-notice";
import { type TocItem, type TreeNodeConfig } from "@/ui";
import { useSiteSkin } from "./site-skin";

type TreeNode = Folder | Item | Separator;

const LABELS = {
  en: { toc: "On this page", menu: "Menu", docs: "Docs" },
  zh: { toc: "本页目录", menu: "菜单", docs: "文档" },
} as const;

function swapLocale(pathname: string, locale: string) {
  return `${schemePrefixOf(pathname)}/${locale}${stripSchemePrefix(pathname).replace(/^\/(en|zh)/u, "")}`;
}

function folderContains(node: Folder, pathname: string): boolean {
  return (node.children ?? []).some((child) => {
    if (child.type === "page") return child.url === pathname;
    if (child.type === "folder") return folderContains(child, pathname);
    return false;
  });
}

function toTreeItems(nodes: TreeNode[], pathname: string, locale: string): TreeNodeConfig[] {
  const current = stripSchemePrefix(pathname);
  return nodes.map((node) => {
    if (node.type === "separator") {
      return { type: "separator", label: typeof node.name === "string" ? node.name : "" };
    }
    if (node.type === "folder") {
      const folder = node as Folder;
      const label = typeof folder.name === "string" ? folder.name : "";
      return {
        label,
        value: `folder:${label}`,
        defaultOpen: folderContains(folder, current) || folder.defaultOpen === true,
        children: toTreeItems(folder.children ?? [], pathname, locale),
      };
    }
    const page = node as Item;
    const href = toSchemeHref(
      pathname,
      page.url?.startsWith("/") ? page.url : `/${locale}${page.url ?? ""}`,
    );
    return {
      label: typeof page.name === "string" ? page.name : "",
      value: href,
      href,
    };
  });
}

function SidebarFooter({ locale }: { locale: string }) {
  const { buttonVariants, cn } = useSiteSkin();
  const githubButtonClass = cn(buttonVariants.outline, "px-0 md:px-0 aspect-square");
  return (
    <div className="flex flex-col gap-2 px-3 py-3 border-t">
      <StyleSelect lang={locale === "zh" ? "zh" : "en"} className="w-full" />
      <div className="flex items-center justify-end gap-1">
        <AppearancePanel lang={locale === "zh" ? "zh" : "en"} />
        <LangSwitch locale={locale} />
        <a
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
          target="_blank"
          rel="noreferrer"
          className={githubButtonClass}
          aria-label="GitHub"
          title="GitHub"
        >
          <Github className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}

function SidebarPanel({
  tree,
  locale,
  onOpenSearch,
  onCollapse,
  onClose,
}: {
  tree: Root;
  locale: string;
  onOpenSearch: () => void;
  onCollapse?: () => void;
  onClose?: () => void;
}) {
  const { Button, Tree } = useSiteSkin();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const treeItems = React.useMemo(
    () => toTreeItems(tree.children ?? [], pathname, locale),
    [tree, pathname, locale],
  );
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          to={toSchemeHref(pathname, `/${locale}`)}
          className="flex items-center gap-2 font-medium"
        >
          <span dangerouslySetInnerHTML={{ __html: logoRaw }} className="size-8 fill-foreground" />
          {appName}
        </Link>
        {onCollapse && (
          <Button
            type="button"
            data-variant="text"
            aria-label={locale === "zh" ? "收起侧栏" : "Collapse sidebar"}
            title={locale === "zh" ? "收起侧栏" : "Collapse sidebar"}
            onClick={onCollapse}
            className="ms-auto"
            icon={<PanelLeft className="size-4" aria-hidden />}
          />
        )}
        {onClose && (
          <Button
            type="button"
            data-variant="text"
            aria-label={LABELS[locale as "zh"]?.menu ?? LABELS.en.menu}
            title={LABELS[locale as "zh"]?.menu ?? LABELS.en.menu}
            onClick={onClose}
            className="ms-auto"
            icon={<X className="size-4" aria-hidden />}
          />
        )}
      </div>
      <div className="px-4" style={{ paddingBlockEnd: "calc(var(--spacing) * 3)" }}>
        <DocsSearchTrigger locale={locale} onOpen={onOpenSearch} className="w-full" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav
          aria-label={LABELS[locale as "zh"]?.docs ?? LABELS.en.docs}
          className="flex flex-col"
          style={{ paddingBlockEnd: "calc(var(--spacing) * 6)" }}
          onClick={(e) => {
            if (onClose && (e.target as HTMLElement).closest("a")) onClose();
          }}
        >
          <Tree items={treeItems} value={pathname} navigate={(href) => navigate(href)} />
        </nav>
      </div>
      <SidebarFooter locale={locale} />
    </>
  );
}

function ShellFloatingBar({
  locale,
  onOpenSidebar,
  onOpenSearch,
  className,
}: {
  locale: string;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  className?: string;
}) {
  const { Button } = useSiteSkin();
  return (
    <div
      className={
        "flex items-center gap-1 p-1 fixed left-4 z-50 rounded-md border bg-surface shadow-base " +
        (className ?? "")
      }
      style={{ top: "calc(calc(var(--spacing) * 4) + var(--motion-banner-h, 0px))" }}
    >
      <Button
        type="button"
        data-variant="text"
        aria-label={LABELS[locale as "zh"]?.menu ?? LABELS.en.menu}
        title={LABELS[locale as "zh"]?.menu ?? LABELS.en.menu}
        onClick={onOpenSidebar}
        icon={<PanelLeft className="size-4" aria-hidden />}
      />
      <Button
        type="button"
        data-variant="text"
        aria-label={locale === "zh" ? "搜索文档" : "Search docs"}
        title={locale === "zh" ? "搜索文档" : "Search docs"}
        onClick={onOpenSearch}
        icon={<Search className="size-4" aria-hidden />}
      />
    </div>
  );
}

const LANGUAGES = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
] as const;

function LangSwitch({ locale }: { locale: string }) {
  const { Button } = useSiteSkin();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const zh = locale === "zh";
  const target = zh ? "en" : "zh";
  const Icon = zh ? Letters : Languages;
  const label = LANGUAGES.find((option) => option.value === target)!.label;

  return (
    <Button
      type="button"
      data-variant="outline"
      aria-label={label}
      title={label}
      onClick={() => navigate(swapLocale(pathname, target))}
      icon={<Icon className="size-4" aria-hidden />}
    />
  );
}

export interface TocHeading {
  title: string;
  url: string;
  depth: number;
}

function toTocItems(toc: TocHeading[]): TocItem[] {
  return toc.map((h) => ({
    id: decodeURIComponent(h.url.replace(/^#/u, "")),
    label: h.title,
    depth: h.depth,
  }));
}

function ShellHeader({
  locale,
  showSearch,
  onOpenSearch,
}: {
  locale: string;
  showSearch?: boolean;
  onOpenSearch: () => void;
}) {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b bg-surface">
      <div className="flex h-[3.5rem] items-center gap-3 px-4 md:px-6 lg:px-8 mx-auto w-full max-w-320">
        <Link
          to={toSchemeHref(pathname, `/${locale}`)}
          className="flex items-center gap-2 font-medium"
        >
          <span dangerouslySetInnerHTML={{ __html: logoRaw }} className="size-8 fill-foreground" />
          <span className="max-sm:hidden">{appName}</span>
        </Link>
        <div className="flex ms-auto items-center gap-3">
          {showSearch && (
            <DocsSearchTrigger
              locale={locale}
              onOpen={onOpenSearch}
              className="min-w-0 max-sm:aspect-square max-sm:justify-center max-sm:px-0 sm:w-64"
            />
          )}
          <StyleMenu lang={locale === "zh" ? "zh" : "en"} />
          <AppearancePanel lang={locale === "zh" ? "zh" : "en"} />
          <LangSwitch locale={locale} />
        </div>
      </div>
    </header>
  );
}

const EMPTY_TOC: TocHeading[] = [];

export function DocsShell({
  tree,
  locale,
  toc = EMPTY_TOC,
  children,
}: {
  tree: Root;
  locale: string;
  toc?: TocHeading[];
  children: React.ReactNode;
}) {
  const { Drawer, Sidebar, Toc, cn } = useSiteSkin();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleSearch = React.useCallback(() => {
    if (searchOpen) {
      setSearchOpen(false);
      return;
    }
    setDrawerOpen(false);
    setSearchOpen(true);
  }, [searchOpen]);
  useSearchHotkey(toggleSearch);

  const navTree = React.useMemo<Root>(
    () => ({
      ...tree,
      children: [
        ...(tree.children ?? []),
        {
          type: "page",
          name: locale === "zh" ? "颜色工具" : "Color Tools",
          url: `/${locale}/tools/color`,
        } satisfies Item,
      ],
    }),
    [tree, locale],
  );

  const openSidebar = React.useCallback(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) setSidebarOpen(true);
    else setDrawerOpen(true);
  }, []);

  const scrollRef = React.useRef<HTMLElement>(null);
  const location = useLocation();
  const navType = useNavigationType();
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || location.hash) return;
    if (navType === "POP") {
      let saved: number;
      try {
        saved = Number(sessionStorage.getItem(`litefy.docs-scroll:${location.pathname}`)) || 0;
      } catch {
        saved = 0;
      }
      el.scrollTop = saved;
      return;
    }
    el.scrollTop = 0;
  }, [location.pathname, location.hash, navType]);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame = 0;
    const save = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        try {
          sessionStorage.setItem(`litefy.docs-scroll:${location.pathname}`, String(el.scrollTop));
        } catch {
          // Storage unavailable: scroll restoration silently degrades to top.
        }
      });
    };
    el.addEventListener("scroll", save, { passive: true });
    return () => {
      el.removeEventListener("scroll", save);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  return (
    <div className="grid h-dvh overflow-hidden grid-rows-[auto_1fr] grid-cols-1 lg:grid-cols-[auto_1fr] [grid-template-areas:'banner_banner'_'sidebar_main'] max-lg:[grid-template-areas:'banner'_'main'] bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:border focus:bg-surface focus:px-4 focus:py-2 focus:text-foreground focus:shadow-base"
      >
        {locale === "zh" ? "跳到主要内容" : "Skip to content"}
      </a>
      <MotionPreferenceNotice />

      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        className={cn("hidden w-64 border-r [grid-area:sidebar]", sidebarOpen && "lg:flex")}
      >
        <SidebarPanel
          tree={navTree}
          locale={locale}
          onOpenSearch={toggleSearch}
          onCollapse={() => setSidebarOpen(false)}
        />
      </Sidebar>

      <ShellFloatingBar
        locale={locale}
        onOpenSidebar={openSidebar}
        onOpenSearch={toggleSearch}
        className={sidebarOpen ? "lg:hidden" : ""}
      />

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} placement="left">
        {tree && (
          <Sidebar className="h-full">
            <SidebarPanel
              tree={navTree}
              locale={locale}
              onOpenSearch={toggleSearch}
              onClose={() => setDrawerOpen(false)}
            />
          </Sidebar>
        )}
      </Drawer>

      <main
        ref={scrollRef}
        id="main-content"
        tabIndex={-1}
        data-scroll-root=""
        className="flex min-w-0 gap-6 overflow-y-auto scroll-pt-6 px-4 pt-20 pb-6 md:px-6 xl:pt-6 lg:px-8 [grid-area:main]"
      >
        {children}
        {toc.length > 0 && (
          <Toc
            variant="line"
            items={toTocItems(toc)}
            title={LABELS[locale as "zh"]?.toc ?? LABELS.en.toc}
            styles={{
              rail: { top: "2rem" },
              scroll: { maxHeight: "calc(100dvh - 8rem)" },
              status: { top: "1rem" },
            }}
          />
        )}
      </main>
      <DocsSearchDialog open={searchOpen} onOpenChange={setSearchOpen} locale={locale} />
    </div>
  );
}

export function DocsArticle({
  title,
  description,
  locale,
  markdownUrl,
  githubPath,
  children,
}: {
  title: string;
  description?: string;
  locale: string;
  markdownUrl?: string;
  githubPath?: string;
  children: React.ReactNode;
}) {
  const { Button, DropdownMenu } = useSiteSkin();
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    if (!markdownUrl) return;
    if (await copyText(markdownUrl)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <article className="typography min-w-0 mx-auto w-full max-w-160 [&>*:first-child]:mt-0 [&>blockquote]:mt-5 [&>blockquote]:max-w-[40em] [&>blockquote]:mx-auto [&>div>table]:w-full [&>div>table]:border-collapse [&>div>table]:text-sm [&>div>table_td]:border [&>div>table_td]:p-2 [&>div>table_td]:wrap-anywhere [&>div>table_th]:border [&>div>table_th]:bg-surface/50 [&>div>table_th]:p-2 [&>div>table_th]:text-start [&>div>table_th]:wrap-anywhere [&>div:has(>table)]:mt-5 [&>h2]:mt-14 [&>h3]:mt-11 [&>h4]:mt-8 [&>h5]:mt-8 [&>h6]:mt-8 [&>h2]:mb-5 [&>h3]:mb-5 [&>h4]:mb-5 [&>h5]:mb-5 [&>h6]:mb-5 [&>hr]:mb-8 [&>hr]:mt-8 [&>ol]:mt-5 [&>ol]:max-w-[40em] [&>ol]:mx-auto [&>p]:mt-5 [&>p]:max-w-[40em] [&>p]:mx-auto [&>ul]:mt-5 [&>ul]:max-w-[40em] [&>ul]:mx-auto [&>ol>li+li]:mt-1.5 [&>ul>li+li]:mt-1.5">
      <h1
        style={{ marginBlockEnd: "calc(var(--spacing) * 2)" }}
      >
        {title}
      </h1>
      {description && (
        <p
          className="m-0 scroll-mt-20 text-surface-fg text-base leading-6 sm:text-lg sm:leading-7"
          style={{ marginBlockEnd: "calc(var(--spacing) * 4)" }}
        >
          {description}
        </p>
      )}
      <div
        className="flex flex-wrap items-center gap-2 border-b"
        style={{ marginBlockEnd: "calc(var(--spacing) * 6)", paddingBlockEnd: "calc(var(--spacing) * 6)" }}
      >
        {markdownUrl && (
          <Button data-variant="outline" onClick={copy}>
            {copied
              ? locale === "zh"
                ? "已复制"
                : "Copied!"
              : locale === "zh"
                ? "复制 Markdown"
                : "Copy Markdown"}
          </Button>
        )}
        {markdownUrl && (
          <DropdownMenu
            alignX="end"
            trigger={
              <>
                {locale === "zh" ? "打开" : "Open"}
                <ChevronDown className="size-4" aria-hidden />
              </>
            }
            items={[
              {
                label: locale === "zh" ? "查看 Markdown" : "View as Markdown",
                onClick: () => window.open(markdownUrl, "_blank", "noreferrer"),
              },
              {
                label: locale === "zh" ? "在 ChatGPT 打开" : "Open in ChatGPT",
                onClick: () =>
                  window.open(
                    `https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read this docs page in full, then answer my questions about it: ${siteUrl}${markdownUrl}`)}`,
                    "_blank",
                    "noreferrer",
                  ),
              },
              {
                label: locale === "zh" ? "在 Claude 打开" : "Open in Claude",
                onClick: () =>
                  window.open(
                    `https://claude.ai/new?q=${encodeURIComponent(`Read this docs page in full, then answer my questions about it: ${siteUrl}${markdownUrl}`)}`,
                    "_blank",
                    "noreferrer",
                  ),
              },
              ...(githubPath
                ? [
                    {
                      label: locale === "zh" ? "在 GitHub 打开" : "Open in GitHub",
                      onClick: () =>
                        window.open(
                          `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${githubPath}`,
                          "_blank",
                          "noreferrer",
                        ),
                    },
                  ]
                : []),
            ]}
          />
        )}
      </div>
      {children}
    </article>
  );
}

export function HomeShell({ locale, children }: { locale: string; children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const toggleSearch = React.useCallback(() => setSearchOpen((prev) => !prev), []);
  useSearchHotkey(toggleSearch);
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ShellHeader locale={locale} showSearch onOpenSearch={toggleSearch} />
      <DocsSearchDialog open={searchOpen} onOpenChange={setSearchOpen} locale={locale} />
      <main className="flex flex-col flex-1">{children}</main>
      <footer className="py-6 border-t bg-surface">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 mx-auto w-full max-w-320 text-sm text-on-surface">
          <span>
            © {new Date().getFullYear()} {appName}
          </span>
          <Link
            to={toSchemeHref(pathname, `/${locale}/docs`)}
            className="transition-colors hover:text-foreground"
          >
            {LABELS[locale as "zh"]?.docs ?? LABELS.en.docs}
          </Link>
        </div>
      </footer>
    </div>
  );
}
