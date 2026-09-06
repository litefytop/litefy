"use client";
import * as React from "react";

export interface UseLoadMoreOptions {
  /** Total number of items in the local dataset. */
  total: number;
  /** How many items to reveal per step. Default `12`. */
  pageSize?: number;
  /** Initial visible count. Defaults to `pageSize`. */
  initialCount?: number;
  /** Called after the visible count grows. */
  onLoadMore?: (visibleCount: number) => void;
  /** Distance from the viewport at which the sentinel triggers. Default `"400px"`. */
  rootMargin?: string;
  /** Set to `false` to pause automatic sentinel loading. Default `true`. */
  enabled?: boolean;
  /** Observation root. Defaults to the viewport; pass a scrollable element to scope loading to an inner container. */
  root?: React.RefObject<HTMLElement | null>;
}

export interface UseLoadMoreReturn {
  /** Number of items currently visible — slice your data with `items.slice(0, visibleCount)`. */
  visibleCount: number;
  /** Whether the dataset still has hidden items. */
  hasMore: boolean;
  /** Reveal the next page manually. */
  loadMore: () => void;
  /** Attach to a sentinel element (usually an empty div) placed after the list. */
  sentinelRef: React.RefCallback<HTMLElement>;
}

// Scroll-driven paging for local (in-memory) data: grows the visible slice as
// the sentinel element approaches the viewport, via IntersectionObserver. The
// observer re-arms on every growth, so short pages keep auto-loading until the
// sentinel is pushed out of the root margin.
export function useLoadMore({
  total,
  pageSize = 12,
  initialCount,
  onLoadMore,
  rootMargin = "400px",
  enabled = true,
  root: rootRef,
}: UseLoadMoreOptions): UseLoadMoreReturn {
  const [visibleCount, setVisibleCount] = React.useState(() =>
    Math.min(initialCount ?? pageSize, total),
  );
  const [sentinel, setSentinel] = React.useState<HTMLElement | null>(null);
  const onLoadMoreRef = React.useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  const hasMore = visibleCount < total;

  const loadMore = React.useCallback(() => {
    setVisibleCount((prev) => {
      if (prev >= total) return prev;
      const next = Math.min(prev + pageSize, total);
      if (next !== prev) onLoadMoreRef.current?.(next);
      return next;
    });
  }, [total, pageSize]);

  const sentinelRef = React.useCallback((el: HTMLElement | null) => setSentinel(el), []);

  React.useEffect(() => {
    if (!sentinel || !enabled || !hasMore) return;
    const root = rootRef?.current ?? null;
    if (rootRef && !root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin, root },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, enabled, hasMore, visibleCount, loadMore, rootMargin, rootRef]);

  return { visibleCount, hasMore, loadMore, sentinelRef };
}
