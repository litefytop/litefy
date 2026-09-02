"use client";

import * as React from "react";

export type VirtualScrollAlign = "start" | "center" | "end";

export interface UseVirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  visibleCount?: number;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
}

export interface UseVirtualScrollResult {
  containerProps: {
    ref: React.RefObject<HTMLDivElement | null>;
    style: React.CSSProperties;
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  };
  totalHeight: number;
  visibleItems: { index: number; top: number }[];
  scrollToIndex: (index: number, align?: VirtualScrollAlign) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export function useVirtualScroll({
  itemCount,
  itemHeight,
  visibleCount = 5,
  overscan = 5,
  onScroll,
}: UseVirtualScrollOptions): UseVirtualScrollResult {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerHeight = visibleCount * itemHeight;
  const totalHeight = itemCount * itemHeight;

  const startIndex = React.useMemo(() => {
    if (containerHeight <= 0) return 0;
    return Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  }, [scrollTop, itemHeight, containerHeight, overscan]);

  const endIndex = React.useMemo(() => {
    if (containerHeight <= 0) return 0;
    const rawEnd = Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan;
    return Math.min(itemCount, rawEnd);
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  const visibleItems = React.useMemo(() => {
    const itemsToRender = [];
    for (let i = startIndex; i < endIndex; i++) {
      itemsToRender.push({ index: i, top: i * itemHeight });
    }
    return itemsToRender;
  }, [startIndex, endIndex, itemHeight]);

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll],
  );

  const scrollToIndex = React.useCallback(
    (index: number, align: VirtualScrollAlign = "start") => {
      const el = containerRef.current;
      if (!el) return;
      const targetTop = index * itemHeight;
      let newScrollTop = targetTop;
      if (align === "center") {
        newScrollTop = targetTop - containerHeight / 2 + itemHeight / 2;
      } else if (align === "end") {
        newScrollTop = targetTop + itemHeight - containerHeight;
      }
      el.scrollTop = Math.max(0, Math.min(newScrollTop, totalHeight - containerHeight));
      setScrollTop(el.scrollTop);
    },
    [containerHeight, itemHeight, totalHeight],
  );

  const scrollToTop = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, []);

  const scrollToBottom = React.useCallback(() => {
    if (containerRef.current) {
      const maxScroll = Math.max(0, totalHeight - containerHeight);
      containerRef.current.scrollTop = maxScroll;
      setScrollTop(maxScroll);
    }
  }, [totalHeight, containerHeight]);

  return {
    containerProps: {
      ref: containerRef,
      style: { height: containerHeight },
      onScroll: handleScroll,
    },
    totalHeight,
    visibleItems,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
  };
}
