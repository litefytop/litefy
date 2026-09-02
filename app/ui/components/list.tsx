"use client";

import * as React from "react";
import type { Key, ReactNode } from "react";
import { type ClassNameValue, cn } from "..";

export interface ListRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ListRoot({ className, ...props }: ListRootProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-y-auto outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
    />
  );
}

export interface ListItemProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ListItem({ className, ...props }: ListItemProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm cursor-pointer transition-colors",
        "hover:bg-hover data-highlighted:bg-hover",
        className,
      )}
    />
  );
}

export interface ListHeaderProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ListHeader({ className, ...props }: ListHeaderProps) {
  return (
    <div
      {...props}
      className={cn("px-3 py-1.5 text-xs font-medium text-muted-foreground", className)}
    />
  );
}

export interface ListClassNames {
  root?: ClassNameValue;
  item?: ClassNameValue;
  header?: ClassNameValue;
}

export interface ListStyles {
  root?: React.CSSProperties;
  item?: React.CSSProperties;
  header?: React.CSSProperties;
}

export interface ListProps<T> {
  ref?: React.Ref<HTMLDivElement>;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey?: (item: T, index: number) => Key;
  empty?: ReactNode;
  highlightIndex?: number | null;
  onHighlightChange?: (index: number | null) => void;
  getGroup?: (item: T, index: number) => string;
  renderGroupHeader?: (label: string) => ReactNode;
  onSelect?: (item: T, index: number) => void;
  onScrollBottom?: () => void;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: ListClassNames;
  styles?: ListStyles;
}

export function List<T>({
  ref,
  items,
  renderItem,
  getKey,
  empty,
  highlightIndex: controlledHighlight,
  onHighlightChange,
  getGroup,
  renderGroupHeader,
  onSelect,
  onScrollBottom,
  className,
  style,
  classNames,
  styles,
}: ListProps<T>) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [uncontrolledHighlight, setUncontrolledHighlight] = React.useState<number | null>(null);
  const isHighlightControlled = controlledHighlight !== undefined;
  const highlightIndex = isHighlightControlled ? controlledHighlight : uncontrolledHighlight;

  const setHighlightIndex = (next: number | null) => {
    if (!isHighlightControlled) setUncontrolledHighlight(next);
    onHighlightChange?.(next);
  };

  React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);

  React.useLayoutEffect(() => {
    if (highlightIndex === null) return;
    rootRef.current
      ?.querySelector<HTMLElement>("[data-highlighted]")
      ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [highlightIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length === 0) return;
      setHighlightIndex(
        highlightIndex === null || highlightIndex >= items.length - 1 ? 0 : highlightIndex + 1,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length === 0) return;
      setHighlightIndex(
        highlightIndex === null || highlightIndex <= 0 ? items.length - 1 : highlightIndex - 1,
      );
    } else if (e.key === "Enter" && highlightIndex !== null && highlightIndex < items.length) {
      e.preventDefault();
      onSelect?.(items[highlightIndex], highlightIndex);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onScrollBottom) return;
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) onScrollBottom();
  };

  return (
    <ListRoot
      ref={rootRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
      className={cn("divide-y divide-border", className, classNames?.root)}
      style={{ ...style, ...styles?.root }}
    >
      {items.length === 0 && empty !== undefined
        ? empty
        : (() => {
            let lastGroup: string | undefined;
            return items.map((item, index) => {
              const group = getGroup?.(item, index);
              const showHeader = group !== undefined && group !== lastGroup;
              if (group !== undefined) lastGroup = group;
              return (
                <React.Fragment key={getKey?.(item, index) ?? index}>
                  {showHeader && (
                    <ListHeader className={classNames?.header} style={styles?.header}>
                      {renderGroupHeader ? renderGroupHeader(group) : group}
                    </ListHeader>
                  )}
                  <ListItem
                    data-highlighted={index === highlightIndex || undefined}
                    onClick={() => onSelect?.(item, index)}
                    className={classNames?.item}
                    style={styles?.item}
                  >
                    {renderItem(item, index)}
                  </ListItem>
                </React.Fragment>
              );
            });
          })()}
    </ListRoot>
  );
}
