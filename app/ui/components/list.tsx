"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

const viewportClass = "scrollbar-none [&::-webkit-scrollbar]:hidden";

export type ListControllerProps<T> = {
  items: T[];
  highlightIndex?: number | null;
  onHighlightChange?: (index: number | null) => void;
  onSelect?: (item: T, index: number) => void;
  onScrollBottom?: () => void;
  /** Fired as the pointer moves over a row — pass it `setHighlightIndex` to let hover and keyboard share one highlight. */
  onItemMouseMove?: (item: T, index: number) => void;
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
  onItemMouseMove?: (item: T, index: number) => void;
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

function ListView<T>({
  ordered = false,
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
  onItemMouseMove,
  className,
  style,
  classNames = {},
  styles = {},
}: ListProps<T> & { ordered?: boolean }) {
  const controller = useListController({
    items,
    highlightIndex,
    onHighlightChange,
    onSelect,
    onScrollBottom,
  });

  const hasGroup = !ordered && typeof getGroup === "function" && typeof renderGroupHeader === "function";
  const Tag = ordered ? "ol" : "ul";

  const viewport = (content: React.ReactNode) => (
    <div
      ref={controller.rootRef as React.Ref<HTMLDivElement>}
      tabIndex={0}
      onKeyDown={controller.handleKeyDown}
      onScroll={controller.handleScroll}
      className={cn("overflow-auto overscroll-contain", viewportClass, className)}
      style={style}
    >
      {content}
    </div>
  );

  const row = (item: T, index: number) => (
    <li
      key={getKey?.(item, index) ?? index}
      data-highlighted={controller.highlightIndex === index}
      onClick={() => onSelect?.(item, index)}
      onMouseMove={onItemMouseMove ? () => onItemMouseMove(item, index) : undefined}
      className={cn(
        "px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-hover data-[highlighted=true]:bg-accent",
        classNames.item,
      )}
      style={styles.item}
    >
      {renderItem(item, index)}
    </li>
  );

  if (items.length === 0 && empty !== undefined) {
    return viewport(
      <Tag className={ordered ? "list-decimal pl-6" : "list-none"}>
        <li className="px-3 py-2 text-sm text-neutral">{empty}</li>
      </Tag>,
    );
  }

  if (hasGroup) {
    return viewport(
      <div className="outline-none">
        {groupItems(items, getGroup!).map(([groupName, groupItemsList]) => (
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
            <Tag className="list-none">
              {groupItemsList.map(({ item, index }) => row(item, index))}
            </Tag>
          </div>
        ))}
      </div>,
    );
  }

  return viewport(
    <Tag className={ordered ? "list-decimal pl-6" : "list-none"}>
      {items.map((item, index) => row(item, index))}
    </Tag>,
  );
}

export function List<T>(props: ListProps<T>) {
  return <ListView {...props} />;
}

export function Order<T>(props: OrderProps<T>) {
  return <ListView ordered {...props} />;
}
