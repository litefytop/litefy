"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

const viewportClasses = "scrollbar-none [&::-webkit-scrollbar]:hidden";

export type ListControllerProps<T> = {
  items: T[];
  highlightIndex?: number | null;
  onHighlightChange?: (index: number | null) => void;
  onSelect?: (item: T, index: number) => void;
  onScrollBottom?: () => void;
};

function useListController<T>(props: ListControllerProps<T>) {
  const {
    items,
    highlightIndex: controlledHighlight,
    onHighlightChange,
    onSelect,
    onScrollBottom,
  } = props;
  const rootRef = React.useRef<HTMLUListElement | HTMLDivElement>(null);

  const [uncontrolledHighlight, setUncontrolledHighlight] = React.useState<number | null>(null);
  const isControlled = controlledHighlight !== undefined;
  const highlightIndex = isControlled ? controlledHighlight : uncontrolledHighlight;

  const setHighlightIndex = (next: number | null) => {
    if (!isControlled) setUncontrolledHighlight(next);
    onHighlightChange?.(next);
  };

  React.useLayoutEffect(() => {
    if (highlightIndex === null) return;
    const el = rootRef.current?.querySelector<HTMLElement>("[data-highlighted='true']");
    el?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [highlightIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement | HTMLDivElement>) => {
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = highlightIndex === null ? 0 : Math.min(highlightIndex + 1, items.length - 1);
      setHighlightIndex(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = highlightIndex === null ? items.length - 1 : Math.max(highlightIndex - 1, 0);
      setHighlightIndex(next);
    } else if (e.key === "Enter" || e.key === " ") {
      if (highlightIndex !== null) {
        e.preventDefault();
        onSelect?.(items[highlightIndex], highlightIndex);
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (!onScrollBottom) return;
    const target = e.currentTarget;
    const threshold = 16;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
      onScrollBottom();
    }
  };

  return { rootRef, highlightIndex, setHighlightIndex, handleKeyDown, handleScroll };
}

export interface ListClassNames {
  item?: ClassNameValue;
  groupHeader?: ClassNameValue;
}

export interface ListStyles {
  item?: React.CSSProperties;
  groupHeader?: React.CSSProperties;
}

export interface ListProps<T> {
  items: T[];
  getKey?: (item: T, index: number) => React.Key;
  getGroup?: (item: T, index: number) => string;
  renderGroupHeader?: (groupName: string) => React.ReactNode;
  renderItem: (item: T, index: number) => React.ReactNode;
  empty?: React.ReactNode;
  highlightIndex?: number | null;
  onHighlightChange?: (index: number | null) => void;
  onSelect?: (item: T, index: number) => void;
  onScrollBottom?: () => void;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: ListClassNames;
  styles?: ListStyles;
}

export type OrderProps<T> = Omit<ListProps<T>, "getGroup" | "renderGroupHeader">;

function groupItems<T>(items: T[], getGroup: (item: T, index: number) => string) {
  const map = new Map<string, Array<{ item: T; index: number }>>();
  items.forEach((item, index) => {
    const name = getGroup(item, index);
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push({ item, index });
  });
  return Array.from(map.entries());
}

export function List<T>(props: ListProps<T>) {
  const {
    items,
    getKey,
    getGroup,
    renderGroupHeader,
    renderItem,
    empty,
    highlightIndex,
    onHighlightChange,
    onSelect,
    onScrollBottom,
    className,
    style,
    classNames = {},
    styles = {},
  } = props;

  const controller = useListController({
    items,
    highlightIndex,
    onHighlightChange,
    onSelect,
    onScrollBottom,
  });

  const hasGroup = typeof getGroup === "function" && typeof renderGroupHeader === "function";

  if (items.length === 0 && empty !== undefined) {
    return (
      <div
        ref={controller.rootRef as React.Ref<HTMLDivElement>}
        tabIndex={0}
        onKeyDown={controller.handleKeyDown}
        onScroll={controller.handleScroll}
        className={cn("overflow-auto overscroll-contain", viewportClasses, className)}
        style={style}
      >
        <ul className="list-none">
          <li className="px-3 py-2 text-sm text-neutral">{empty}</li>
        </ul>
      </div>
    );
  }

  if (!hasGroup) {
    return (
      <div
        ref={controller.rootRef as React.Ref<HTMLDivElement>}
        tabIndex={0}
        onKeyDown={controller.handleKeyDown}
        onScroll={controller.handleScroll}
        className={cn("overflow-auto overscroll-contain", viewportClasses, className)}
        style={style}
      >
        <ul className="list-none">
          {items.map((item, index) => (
            <li
              key={getKey?.(item, index) ?? index}
              data-highlighted={controller.highlightIndex === index}
              onClick={() => onSelect?.(item, index)}
              className={cn(
                "px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-hover data-[highlighted=true]:bg-hover",
                classNames.item,
              )}
              style={styles.item}
            >
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const grouped = groupItems(items, getGroup!);

  return (
    <div
      ref={controller.rootRef as React.Ref<HTMLDivElement>}
      tabIndex={0}
      onKeyDown={controller.handleKeyDown}
      onScroll={controller.handleScroll}
      className={cn("overflow-auto overscroll-contain", viewportClasses, className)}
      style={style}
    >
      <div className="outline-none">
        {grouped.map(([groupName, groupItemsList]) => (
          <div key={groupName}>
            <div
              className={cn(
                "px-3 py-1.5 text-xs font-medium text-muted-foreground",
                classNames.groupHeader,
              )}
              style={styles.groupHeader}
            >
              {renderGroupHeader!(groupName)}
            </div>
            <ul className="list-none">
              {groupItemsList.map(({ item, index }) => (
                <li
                  key={getKey?.(item, index) ?? index}
                  data-highlighted={controller.highlightIndex === index}
                  onClick={() => onSelect?.(item, index)}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-hover data-[highlighted=true]:bg-hover",
                    classNames.item,
                  )}
                  style={styles.item}
                >
                  {renderItem(item, index)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Order<T>(props: OrderProps<T>) {
  const {
    getKey,
    items,
    renderItem,
    empty,
    highlightIndex,
    onHighlightChange,
    onSelect,
    onScrollBottom,
    className,
    style,
    classNames = {},
    styles = {},
  } = props;

  const controller = useListController({
    items,
    highlightIndex,
    onHighlightChange,
    onSelect,
    onScrollBottom,
  });

  if (items.length === 0 && empty !== undefined) {
    return (
      <div
        ref={controller.rootRef as React.Ref<HTMLDivElement>}
        tabIndex={0}
        onKeyDown={controller.handleKeyDown}
        onScroll={controller.handleScroll}
        className={cn("overflow-auto overscroll-contain", viewportClasses, className)}
        style={style}
      >
        <ol className="list-decimal pl-6">
          <li className="px-3 py-2 text-sm text-neutral">{empty}</li>
        </ol>
      </div>
    );
  }

  return (
    <div
      ref={controller.rootRef as React.Ref<HTMLDivElement>}
      tabIndex={0}
      onKeyDown={controller.handleKeyDown}
      onScroll={controller.handleScroll}
      className={cn("overflow-auto overscroll-contain", viewportClasses, className)}
      style={style}
    >
      <ol className="list-decimal pl-6">
        {items.map((item, index) => (
          <li
            key={getKey?.(item, index) ?? index}
            data-highlighted={controller.highlightIndex === index}
            onClick={() => onSelect?.(item, index)}
            className={cn(
              "px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-hover data-[highlighted=true]:bg-hover",
              classNames.item,
            )}
            style={styles.item}
          >
            {renderItem(item, index)}
          </li>
        ))}
      </ol>
    </div>
  );
}
