"use client";

import { findNeighbour, type Root } from "fumadocs-core/page-tree";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { Link, useLocation } from "react-router";
import { stripSchemePrefix, toSchemeHref } from "@/lib/style-templates";
import { useSiteSkin } from "./site-skin";

const labels = {
  en: { nav: "Page navigation", prev: "Previous", next: "Next" },
  zh: { nav: "文档页导航", prev: "上一页", next: "下一页" },
} as const;

function pageName(name: unknown) {
  return typeof name === "string" ? name : "";
}

export function DocsPageNav({ tree }: { tree: Root }) {
  const { chipClasses, cn } = useSiteSkin();
  const { pathname } = useLocation();
  const current = stripSchemePrefix(pathname);
  const t = current.startsWith("/zh") ? labels.zh : labels.en;
  const url = current.replace(/\/$/u, "") || "/";
  const { previous, next } = findNeighbour(tree, url);
  if (!previous && !next) return null;

  const chipClass = cn(chipClasses, "bg-background");

  return (
    <nav
      aria-label={t.nav}
      className="not-typography mt-8 flex flex-wrap items-center justify-between gap-2 sm:mt-12"
    >
      {previous && (
        <Link
          to={toSchemeHref(pathname, previous.url)}
          aria-label={`${t.prev}：${pageName(previous.name)}`}
          className={chipClass}
        >
          <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
          <span className="max-w-40 truncate">{pageName(previous.name)}</span>
        </Link>
      )}
      {next && (
        <Link
          to={toSchemeHref(pathname, next.url)}
          aria-label={`${t.next}：${pageName(next.name)}`}
          className={cn(chipClass, "ms-auto")}
        >
          <span className="max-w-40 truncate">{pageName(next.name)}</span>
          <ArrowRight className="size-3.5 shrink-0" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
