"use client";
import { create } from "@orama/orama";
import { createTokenizer } from "@orama/tokenizers/mandarin";
import { useDocsSearch } from "fumadocs-core/search/client";
import { oramaStaticClient } from "fumadocs-core/search/client/orama-static";
import { Loader2, Search } from "@/components/icons";
import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { toSchemeHref } from "@/lib/style-templates";
import { type CommandItemConfig, useSpin } from "@/ui";
import { useSiteSkin } from "./site-skin";

function SearchSpinner() {
  const ref = useSpin<SVGSVGElement>();
  return <Loader2 ref={ref} className="size-4 shrink-0 text-foreground" aria-hidden />;
}

function initOrama(locale?: string) {
  if (locale === "zh") {
    return create({
      schema: { _: "string" },
      components: {
        tokenizer: createTokenizer(),
      },
    });
  }
  return create({
    schema: { _: "string" },
    language: "english",
  });
}

export function DocsSearchDialog({
  open,
  onOpenChange,
  locale,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
}) {
  const { Command } = useSiteSkin();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [keyword, setKeyword] = React.useState("");
  const { setSearch, query } = useDocsSearch({
    client: oramaStaticClient({
      initOrama,
      locale,
      from: `/${locale}/api/search`,
    }),
  });

  const items = React.useMemo<CommandItemConfig[]>(() => {
    const data = query.data;
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    const rows: CommandItemConfig[] = [];
    for (const [i, item] of data.entries()) {
      const rec = item as unknown as {
        content?: unknown;
        breadcrumbs?: unknown[];
        url?: unknown;
      };
      const title =
        typeof rec.content === "string" || typeof rec.content === "number"
          ? String(rec.content).replaceAll(/<\/?mark>/gu, "")
          : `Result ${i + 1}`;
      const breadcrumb = Array.isArray(rec.breadcrumbs)
        ? rec.breadcrumbs.map(String).join(" / ")
        : undefined;
      const url = typeof rec.url === "string" ? rec.url : "";
      const value = url || `result-${i}`;
      if (seen.has(value)) continue;
      seen.add(value);
      rows.push({
        value,
        label: (
          <span className="block">
            <span className="block truncate text-sm text-foreground">{title}</span>
            {breadcrumb && (
              <span className="block truncate text-xs text-foreground">{breadcrumb}</span>
            )}
          </span>
        ),
      });
    }
    return rows;
  }, [query.data]);

  const hasKeyword = keyword.trim().length > 0;
  const empty =
    !hasKeyword || query.isLoading
      ? null
      : locale === "zh"
        ? "没有匹配的结果"
        : "No results found";

  return (
    <Command
      open={open}
      onOpenChange={onOpenChange}
      items={hasKeyword ? items : []}
      filter={() => true}
      onKeywordChange={(next) => {
        setKeyword(next);
        setSearch(next);
      }}
      onSelect={(item) => {
        if (item.value?.startsWith("/")) navigate(toSchemeHref(pathname, item.value));
      }}
      placeholder={locale === "zh" ? "搜索文档…" : "Search docs…"}
      empty={empty}
      trailing={query.isLoading ? <SearchSpinner /> : undefined}
      hints={{
        navigate: locale === "zh" ? "导航" : "Navigate",
        open: locale === "zh" ? "打开" : "Open",
        close: locale === "zh" ? "关闭" : "Close",
      }}
    />
  );
}

export function DocsSearchTrigger({
  locale,
  onOpen,
  className,
}: {
  locale: string;
  onOpen: () => void;
  className?: string;
}) {
  const { Button } = useSiteSkin();
  const label = locale === "zh" ? "搜索文档" : "Search docs";
  return (
    <Button
      type="button"
      data-variant="outline"
      onClick={onOpen}
      className={className}
      aria-label={label}
      title={label}
    >
      <Search className="shrink-0 size-4" aria-hidden />
      <span className="max-sm:hidden flex-1 truncate text-left">{label}</span>
      <kbd className="kbd max-md:hidden">
        Ctrl K
      </kbd>
    </Button>
  );
}

export function useSearchHotkey(onToggle: () => void) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onToggle]);
}
