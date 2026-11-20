"use client";

import { findNeighbour, type Item, type Root } from "fumadocs-core/page-tree";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "@/components/icons";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { stripSchemePrefix, toSchemeHref } from "@/lib/style-templates";
import { useSiteSkin } from "./site-skin";


const labels = {
  en: {
    top: "Back to top",
    bottom: "To bottom",
    prev: "Previous page",
    next: "Next page",
  },
  zh: {
    top: "回到顶部",
    bottom: "到达底部",
    prev: "上一页",
    next: "下一页",
  },
} as const;

function hint(action: string, item?: Item, shortcut?: string) {
  const name = typeof item?.name === "string" ? item.name : undefined;
  return [name ? `${action} · ${name}` : action, shortcut]
    .filter(Boolean)
    .join(" ");
}

export function FloatingNav({ tree }: { tree: Root }) {
  const { Button, buttonVariants, cn } = useSiteSkin();
  const arrowButtonClass = cn(buttonVariants.outline, "px-0 md:px-0 aspect-square rounded-none");
  const rootRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const current = stripSchemePrefix(pathname);
  const t = current.startsWith("/zh") ? labels.zh : labels.en;
  const url = current.replace(/\/$/u, "") || "/";
  const { previous, next } = useMemo(
    () => findNeighbour(tree, url),
    [tree, url],
  );

  const scroll = useCallback((edge: "top" | "bottom") => {
    const el =
      rootRef.current?.closest<HTMLElement>("[data-scroll-root]") ??
      (document.scrollingElement as HTMLElement | null);
    if (!el) return;
    el.scrollTo({ top: edge === "top" ? 0 : el.scrollHeight, behavior: "smooth" });
  }, []);

  const go = useCallback(
    (target?: Item) => {
      if (!target) return;
      navigate(toSchemeHref(pathname, target.url));
    },
    [navigate, pathname],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.isComposing)
        return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.closest("input, textarea, select, [contenteditable]") ||
          el.isContentEditable)
      )
        return;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          scroll("top");
          break;
        case "ArrowDown":
          e.preventDefault();
          scroll("bottom");
          break;
        case "ArrowLeft":
          if (!previous) return;
          e.preventDefault();
          go(previous);
          break;
        case "ArrowRight":
          if (!next) return;
          e.preventDefault();
          go(next);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previous, next, go, scroll]);

  const iconProps = { className: "size-4" } as const;

  return (
    <div
      ref={rootRef}
      className="fixed right-0 bottom-16 z-40 flex flex-col overflow-hidden rounded-l-[var(--radius-xl,0)] border border-r-0 bg-surface-raised shadow-elevated *:border-0 *:shadow-none [&>*+*]:border-t [&>*+*]:border-border"
    >
      <Button
        data-variant="outline"
        className="rounded-none"
        aria-label={t.top}
        title={hint(t.top, undefined, "Ctrl+↑")}
        onClick={() => scroll("top")}
        icon={<ChevronUp {...iconProps} />}
      />
      {previous ? (
        <Link
          to={toSchemeHref(pathname, previous.url)}
          className={arrowButtonClass}
          aria-label={t.prev}
          title={hint(t.prev, previous, "Ctrl+←")}
        >
          <ChevronLeft {...iconProps} />
        </Link>
      ) : (
        <Button
          data-variant="outline"
          className="rounded-none"
          aria-label={t.prev}
          title={hint(t.prev, undefined, "Ctrl+←")}
          disabled
          icon={<ChevronLeft {...iconProps} />}
        />
      )}
      {next ? (
        <Link
          to={toSchemeHref(pathname, next.url)}
          className={arrowButtonClass}
          aria-label={t.next}
          title={hint(t.next, next, "Ctrl+→")}
        >
          <ChevronRight {...iconProps} />
        </Link>
      ) : (
        <Button
          data-variant="outline"
          className="rounded-none"
          aria-label={t.next}
          title={hint(t.next, undefined, "Ctrl+→")}
          disabled
          icon={<ChevronRight {...iconProps} />}
        />
      )}
      <Button
        data-variant="outline"
        className="rounded-none"
        aria-label={t.bottom}
        title={hint(t.bottom, undefined, "Ctrl+↓")}
        onClick={() => scroll("bottom")}
        icon={<ChevronDown {...iconProps} />}
      />
    </div>
  );
}
