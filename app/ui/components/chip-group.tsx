"use client";
import * as React from "react";
export interface ChipItem {
    value: string;
    label: React.ReactNode;
}
export interface ChipGroupProps {
    items: ChipItem[];
    onOverflowChange?: (hidden: ChipItem[]) => void;
    renderMore?: (hidden: ChipItem[]) => React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        row?: string;
        chip?: string;
        more?: string;
        measure?: string;
    };
    styles?: {
        row?: React.CSSProperties;
        chip?: React.CSSProperties;
        more?: React.CSSProperties;
        measure?: React.CSSProperties;
    };
}
export function ChipGroup({ items, onOverflowChange, renderMore, className, classNames, styles, ...props }: ChipGroupProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const shadowRef = React.useRef<HTMLDivElement>(null);
    const moreRef = React.useRef<HTMLSpanElement>(null);
    const [visibleCount, setVisibleCount] = React.useState(items.length);
    const hiddenKeyRef = React.useRef("");
    const measure = React.useCallback(() => {
        const container = containerRef.current;
        const shadow = shadowRef.current;
        if (!container || !shadow)
            return;
        const available = container.clientWidth;
        const gap = Number.parseFloat(getComputedStyle(shadow).columnGap) || 0;
        const chips = Array.from(shadow.children) as HTMLElement[];
        const fit = (limit: number) => {
            let acc = 0;
            let count = 0;
            for (const chip of chips) {
                const width = (count > 0 ? gap : 0) + chip.offsetWidth;
                if (acc + width > limit)
                    break;
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
    const itemsRef = React.useRef(items);
    React.useEffect(() => {
        itemsRef.current = items;
        measure();
        const container = containerRef.current;
        if (!container)
            return;
        const observer = new ResizeObserver(measure);
        observer.observe(container);
        return () => observer.disconnect();
    }, [measure, items]);
    const hidden = items.slice(visibleCount);
    const hiddenKey = hidden.map((item) => item.value).join("\n");
    React.useEffect(() => {
        if (hiddenKeyRef.current === hiddenKey)
            return;
        hiddenKeyRef.current = hiddenKey;
        onOverflowChange?.(hidden);
    });
    const visible = items.slice(0, visibleCount);
    return (<div {...props} className={className}>
      <div ref={containerRef} className={classNames?.row} style={styles?.row}>
        {visible.map((item) => (<span key={item.value} className={classNames?.chip} style={styles?.chip}>
            {item.label}
          </span>))}
        {renderMore && (<span ref={moreRef} className={classNames?.more} style={styles?.more}>
            {renderMore(hidden)}
          </span>)}
      </div>
      <div ref={shadowRef} aria-hidden inert className={classNames?.measure} style={styles?.measure}>
        {items.map((item) => (<span key={item.value} className={classNames?.chip} style={styles?.chip}>
            {item.label}
          </span>))}
      </div>
    </div>);
}
