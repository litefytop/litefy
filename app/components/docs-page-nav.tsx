"use client";

import { findNeighbour, type Root } from "fumadocs-core/page-tree";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { useLocation } from "react-router";
import { stripSchemePrefix, toSchemeHref } from "@/lib/style-templates";
import { CardLink } from "./card-link";

const labels = {
  en: { nav: "Page navigation", prev: "Previous", next: "Next" },
  zh: { nav: "文档页导航", prev: "上一页", next: "下一页" },
} as const;

function pageName(name: unknown) {
  return typeof name === "string" ? name : "";
}

export function DocsPageNav({ tree }: { tree: Root }) {
  const { pathname } = useLocation();
  const current = stripSchemePrefix(pathname);
  const t = current.startsWith("/zh") ? labels.zh : labels.en;
  const url = current.replace(/\/$/u, "") || "/";
  const { previous, next } = findNeighbour(tree, url);
  if (!previous && !next) return null;

  return (
    <nav aria-label={t.nav} className="not-typography mt-12 grid gap-4 sm:grid-cols-2">
      {previous && (
        <CardLink to={toSchemeHref(pathname, previous.url)} className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-foreground">
            <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
            {t.prev}
            <kbd aria-hidden className="kbd ms-auto">Ctrl ←</kbd>
          </span>
          <span className="text-base font-medium">{pageName(previous.name)}</span>
        </CardLink>
      )}
      {next && (
        <CardLink
          to={toSchemeHref(pathname, next.url)}
          className="flex flex-col items-end gap-1 text-end sm:col-start-2"
        >
          <span className="flex w-full items-center gap-2 text-xs font-semibold tracking-wide text-foreground">
            <kbd aria-hidden className="kbd me-auto">Ctrl →</kbd>
            {t.next}
            <ArrowRight className="size-3.5 shrink-0" aria-hidden />
          </span>
          <span className="text-base font-medium">{pageName(next.name)}</span>
        </CardLink>
      )}
    </nav>
  );
}
