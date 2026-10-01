"use client";

import { findNeighbour, type Item, type Root } from "fumadocs-core/page-tree";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router";

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

const itemClass =
  "size-8 rounded-lg inline-flex items-center justify-center text-muted-foreground hover:bg-hover hover:text-foreground transition-colors";

function hint(action: string, item?: Item, shortcut?: string) {
  const name = typeof item?.name === "string" ? item.name : undefined;
  return [name ? `${action} · ${name}` : action, shortcut]
    .filter(Boolean)
    .join(" ");
}

export function FloatingNav({ tree }: { tree: Root }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const t = pathname.startsWith("/zh") ? labels.zh : labels.en;
  const url = pathname.replace(/\/$/, "") || "/";
  const { previous, next } = useMemo(
    () => findNeighbour(tree, url),
    [tree, url],
  );

  const scroll = (top: number) => {
    window.scrollTo({ top, behavior: "smooth" });
  };

  const go = (target?: Item) => {
    if (!target) return;
    navigate(target.url);
  };

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
          scroll(0);
          break;
        case "ArrowDown":
          e.preventDefault();
          scroll(document.documentElement.scrollHeight);
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
  }, [previous, next]);

  const iconProps = { className: "size-4" } as const;

  return (
    <div className="fixed right-0 bottom-16 z-40 flex flex-col gap-1 p-1.5 rounded-l-xl border border-r-0 bg-surface-raised shadow-elevated">
      <button
        type="button"
        className={itemClass}
        aria-label={t.top}
        title={hint(t.top, undefined, "Ctrl+↑")}
        onClick={() => scroll(0)}
      >
        <ChevronUp {...iconProps} />
      </button>
      {previous ? (
        <Link
          to={previous.url}
          className={itemClass}
          aria-label={t.prev}
          title={hint(t.prev, previous, "Ctrl+←")}
        >
          <ChevronLeft {...iconProps} />
        </Link>
      ) : (
        <button type="button" className={itemClass} aria-label={t.prev} disabled>
          <ChevronLeft {...iconProps} />
        </button>
      )}
      {next ? (
        <Link
          to={next.url}
          className={itemClass}
          aria-label={t.next}
          title={hint(t.next, next, "Ctrl+→")}
        >
          <ChevronRight {...iconProps} />
        </Link>
      ) : (
        <button type="button" className={itemClass} aria-label={t.next} disabled>
          <ChevronRight {...iconProps} />
        </button>
      )}
      <button
        type="button"
        className={itemClass}
        aria-label={t.bottom}
        title={hint(t.bottom, undefined, "Ctrl+↓")}
        onClick={() => scroll(document.documentElement.scrollHeight)}
      >
        <ChevronDown {...iconProps} />
      </button>
    </div>
  );
}
