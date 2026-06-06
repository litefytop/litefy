"use client";

import { cn } from "@/lib";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
} from "react";

export interface VirtualScrollProps<T> extends Omit<
  React.ComponentProps<"div">,
  "ref" | "onScroll"
> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  className?: string;
  visibleCount?: number;
  ref?: React.Ref<VirtualScrollHandle>;
}

export interface VirtualScrollHandle {
  scrollToIndex: (index: number, align?: "start" | "center" | "end") => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export function VirtualScroll<T>(
  {
    items,
    itemHeight,
    visibleCount = 5,
    renderItem,
    overscan = 5,
    onScroll,
    className,
    ref,
    ...props
  }: VirtualScrollProps<T>
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerHeight = visibleCount * itemHeight;
  const totalHeight = items.length * itemHeight;

  const startIndex = useMemo(() => {
    if (containerHeight <= 0) return 0;
    const rawStart = Math.floor(scrollTop / itemHeight) - overscan;
    return Math.max(0, rawStart);
  }, [scrollTop, itemHeight, containerHeight, overscan]);

  const endIndex = useMemo(() => {
    if (containerHeight <= 0) return 0;
    const rawEnd =
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan;
    return Math.min(items.length, rawEnd);
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    const itemsToRender = [];
    for (let i = startIndex; i < endIndex; i++) {
      itemsToRender.push({
        item: items[i],
        index: i,
        top: i * itemHeight,
      });
    }
    return itemsToRender;
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll],
  );

  const scrollToIndex = useCallback(
    (index: number, align: "start" | "center" | "end" = "start") => {
      if (!containerRef.current) return;
      const targetTop = index * itemHeight;
      let newScrollTop = targetTop;
      if (align === "center") {
        newScrollTop = targetTop - containerHeight / 2 + itemHeight / 2;
      } else if (align === "end") {
        newScrollTop = targetTop + itemHeight - containerHeight;
      }
      containerRef.current.scrollTop = Math.max(
        0,
        Math.min(newScrollTop, totalHeight - containerHeight),
      );
      setScrollTop(containerRef.current.scrollTop);
    },
    [containerHeight, itemHeight, totalHeight],
  );

  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      const maxScroll = Math.max(0, totalHeight - containerHeight);
      containerRef.current.scrollTop = maxScroll;
      setScrollTop(maxScroll);
    }
  }, [totalHeight, containerHeight]);

  useImperativeHandle(ref, () => ({
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
  }));

  useEffect(() => {
    if (containerRef.current && containerRef.current.scrollTop !== scrollTop) {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div className={cn("relative")} style={{ height: totalHeight }}>
        {visibleItems.map(({ item, index, top }) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${top}px)`,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

