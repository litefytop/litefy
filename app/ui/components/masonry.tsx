"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "..";

export type MasonryBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

export type MasonryColumns =
  | number
  | ({ base?: number } & Partial<Record<MasonryBreakpoint, number>>);

const BREAKPOINTS: [MasonryBreakpoint, number][] = [
  ["sm", 640],
  ["md", 768],
  ["lg", 1024],
  ["xl", 1280],
  ["2xl", 1536],
];

function resolveColumnCount(columns: MasonryColumns, width: number): number {
  if (typeof columns === "number") return Math.max(1, Math.floor(columns));
  let count = columns.base ?? 1;
  for (const [bp, px] of BREAKPOINTS) {
    const at = columns[bp];
    if (width >= px && at !== undefined) count = at;
  }
  return Math.max(1, Math.floor(count));
}

function distribute(count: number, columns: number, heights: number[]): number[][] {
  const cols: number[][] = Array.from({ length: columns }, () => []);
  const colHeights = new Array<number>(columns).fill(0);
  for (let i = 0; i < count; i++) {
    let target = 0;
    for (let c = 1; c < columns; c++) {
      if (colHeights[c] < colHeights[target]) target = c;
    }
    cols[target].push(i);
    colHeights[target] += heights[i] > 0 ? heights[i] : 1;
  }
  return cols;
}

function sameAssignment(a: number[][], b: number[][]) {
  return a.length === b.length && a.every((col, i) => col.join(",") === b[i].join(","));
}

export interface MasonryColumnProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function MasonryColumn({ className, ...props }: MasonryColumnProps) {
  return <div {...props} className={cn("flex min-w-0 flex-col", className)} />;
}

export interface MasonryItemProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function MasonryItem({ className, ...props }: MasonryItemProps) {
  return <div {...props} className={cn("min-w-0", className)} />;
}

export interface MasonryProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => React.Key;
  columns?: MasonryColumns;
  gap?: number;
  className?: ClassNameValue;
  classNames?: {
    column?: ClassNameValue;
    item?: ClassNameValue;
  };
  styles?: {
    column?: React.CSSProperties;
    item?: React.CSSProperties;
  };
}

export function Masonry<T>({
  items,
  renderItem,
  getKey,
  columns = { base: 1, sm: 2, lg: 3, xl: 4 },
  gap = 16,
  className,
  classNames,
  styles,
}: MasonryProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = React.useState(() =>
    resolveColumnCount(columns, 0),
  );
  const [assignment, setAssignment] = React.useState<number[][]>(() =>
    distribute(items.length, columnCount, []),
  );

  const keys = React.useMemo(
    () => items.map((item, index) => String(getKey?.(item, index) ?? index)),
    [items, getKey],
  );
  const columnsKey = JSON.stringify(columns);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const parsed = JSON.parse(columnsKey) as MasonryColumns;
    const update = () => setColumnCount(resolveColumnCount(parsed, el.clientWidth));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [columnsKey]);

  React.useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const heights: number[] = new Array(items.length).fill(0);
    for (const el of root.querySelectorAll<HTMLElement>("[data-masonry-key]")) {
      const index = Number(el.getAttribute("data-masonry-index"));
      if (index >= 0 && index < items.length) heights[index] = el.offsetHeight;
    }
    const next = distribute(items.length, columnCount, heights);
    setAssignment((prev) => (sameAssignment(prev, next) ? prev : next));
  });

  const cols =
    assignment.length === columnCount
      ? assignment
      : distribute(items.length, columnCount, []);

  return (
    <div
      ref={containerRef}
      className={cn("w-full", className)}
      style={{ display: "flex", gap }}
    >
      {cols.map((columnItems, columnIndex) => (
        <MasonryColumn
          key={columnIndex}
          className={classNames?.column}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap,
            ...styles?.column,
          }}
        >
          {columnItems.map((itemIndex) => {
            const key = keys[itemIndex];
            return (
              <MasonryItem
                key={key}
                data-masonry-key={key}
                data-masonry-index={itemIndex}
                className={classNames?.item}
                style={styles?.item}
              >
                {renderItem(items[itemIndex], itemIndex)}
              </MasonryItem>
            );
          })}
        </MasonryColumn>
      ))}
    </div>
  );
}

Masonry.Column = MasonryColumn;
Masonry.Item = MasonryItem;
