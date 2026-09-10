"use client";
import * as React from "react";

export interface UseLoadMoreOptions {
  total: number;
  pageSize?: number;
  initialCount?: number;
  onLoadMore?: (visibleCount: number) => void;
  rootMargin?: string;
  enabled?: boolean;
  root?: React.RefObject<HTMLElement | null>;
}

export interface UseLoadMoreReturn {
  visibleCount: number;
  hasMore: boolean;
  loadMore: () => void;
  sentinelRef: React.RefCallback<HTMLElement>;
}

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
