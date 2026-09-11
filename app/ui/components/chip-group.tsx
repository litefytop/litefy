"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface ChipItem {
  value: string;
  label: React.ReactNode;
}

export interface ChipGroupProps {
  items: ChipItem[];
  onOverflowChange?: (hidden: ChipItem[]) => void;
  renderMore?: (hidden: ChipItem[]) => React.ReactNode;
  className?: ClassNameValue;
  classNames?: {
    chip?: ClassNameValue;
  };
}

const chipClass =
  "max-w-40 shrink-0 truncate rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap";

export function ChipGroup({
  items,
  onOverflowChange,
  renderMore,
  className,
  classNames,
}: ChipGroupProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const shadowRef = React.useRef<HTMLDivElement>(null);
  const moreRef = React.useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = React.useState(items.length);
  const hiddenKeyRef = React.useRef("");

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const shadow = shadowRef.current;
    if (!container || !shadow) return;
    const available = container.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(shadow).columnGap) || 0;
    const chips = Array.from(shadow.querySelectorAll<HTMLElement>("[data-chip]"));
    const fit = (limit: number) => {
      let acc = 0;
      let count = 0;
      for (const chip of chips) {
        const width = (count > 0 ? gap : 0) + chip.offsetWidth;
        if (acc + width > limit) break;
        acc += width;
        count++;
      }
      return count;
    };
    let count = fit(available);
    const more = moreRef.current;
    if (count < chips.length && more) {
      count = fit(available - (more.offsetWidth + gap));
    }
    setVisibleCount(count);
  }, []);

  React.useEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure, items]);

  const hidden = items.slice(visibleCount);
  const hiddenKey = hidden.map((item) => item.value).join("\n");
  React.useEffect(() => {
    if (hiddenKeyRef.current === hiddenKey) return;
    hiddenKeyRef.current = hiddenKey;
    onOverflowChange?.(hidden);
  });

  const visible = items.slice(0, visibleCount);

  return (
    <div className={cn("max-w-full overflow-hidden", className)}>
      <div ref={containerRef} className="flex min-w-0 items-center gap-1.5">
        {visible.map((item) => (
          <span key={item.value} className={cn(chipClass, classNames?.chip)}>
            {item.label}
          </span>
        ))}
        {renderMore && (
          <span ref={moreRef} className="inline-flex shrink-0">
            {renderMore(hidden)}
          </span>
        )}
      </div>
      <div
        ref={shadowRef}
        aria-hidden
        className="pointer-events-none absolute top-[-9999px] left-[-9999px] flex items-center gap-1.5"
      >
        {items.map((item) => (
          <span key={item.value} data-chip className={cn(chipClass, classNames?.chip)}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
