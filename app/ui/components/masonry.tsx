"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

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
  const colHeights = Array.from({ length: columns }, () => 0);
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

// Nested masonry renders as static CSS columns, so every breakpoint/count pair
// must appear as a literal class for Tailwind to generate it.
const STATIC_COLUMN_CLASSES: Record<"base" | MasonryBreakpoint, string[]> = {
  base: ["columns-1", "columns-2", "columns-3", "columns-4", "columns-5", "columns-6"],
  sm: [
    "@min-[640px]:columns-1",
    "@min-[640px]:columns-2",
    "@min-[640px]:columns-3",
    "@min-[640px]:columns-4",
    "@min-[640px]:columns-5",
    "@min-[640px]:columns-6",
  ],
  md: [
    "@min-[768px]:columns-1",
    "@min-[768px]:columns-2",
    "@min-[768px]:columns-3",
    "@min-[768px]:columns-4",
    "@min-[768px]:columns-5",
    "@min-[768px]:columns-6",
  ],
  lg: [
    "@min-[1024px]:columns-1",
    "@min-[1024px]:columns-2",
    "@min-[1024px]:columns-3",
    "@min-[1024px]:columns-4",
    "@min-[1024px]:columns-5",
    "@min-[1024px]:columns-6",
  ],
  xl: [
    "@min-[1280px]:columns-1",
    "@min-[1280px]:columns-2",
    "@min-[1280px]:columns-3",
    "@min-[1280px]:columns-4",
    "@min-[1280px]:columns-5",
    "@min-[1280px]:columns-6",
  ],
  "2xl": [
    "@min-[1536px]:columns-1",
    "@min-[1536px]:columns-2",
    "@min-[1536px]:columns-3",
    "@min-[1536px]:columns-4",
    "@min-[1536px]:columns-5",
    "@min-[1536px]:columns-6",
  ],
};

const MAX_STATIC_COLUMNS = STATIC_COLUMN_CLASSES.base.length;

function staticColumnClass(slot: string[], count: number): string {
  const index = Math.min(MAX_STATIC_COLUMNS, Math.max(1, Math.floor(count))) - 1;
  return slot[index];
}

function resolveStaticColumnClasses(columns: MasonryColumns): string {
  if (typeof columns === "number") {
    return staticColumnClass(STATIC_COLUMN_CLASSES.base, columns);
  }
  const classes = [staticColumnClass(STATIC_COLUMN_CLASSES.base, columns.base ?? 1)];
  for (const [bp] of BREAKPOINTS) {
    const at = columns[bp];
    if (at !== undefined) classes.push(staticColumnClass(STATIC_COLUMN_CLASSES[bp], at));
  }
  return classes.join(" ");
}

/**
 * Tracks how many Masonry ancestors an item-driven Masonry has in the React
 * tree. Nested instances render statically (StaticMasonry) so two measuring
 * layouts cannot feed each other resize loops.
 */
const MasonryDepthContext = React.createContext(0);

let warnedNested = false;

export interface MasonryColumnProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function MasonryColumn({ className, ...props }: MasonryColumnProps) {
  return <div {...props} className={cn("flex min-w-0 flex-col", className)} />;
}

export interface MasonryItemProps extends Omit<React.ComponentProps<"div">, "className"> {
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

/**
 * Item-driven masonry. The outermost instance measures and balances columns;
 * an instance nested inside another Masonry degrades to a static CSS columns
 * layout — no measurement, no ResizeObserver, no feedback loop.
 */
export function Masonry<T>(props: MasonryProps<T>) {
  const depth = React.useContext(MasonryDepthContext);
  if (depth > 0) {
    if (process.env.NODE_ENV !== "production" && !warnedNested) {
      warnedNested = true;
      console.warn(
        "[masonry] Nested Masonry detected — rendering a static CSS columns layout (no height balancing). Only the outermost Masonry measures.",
      );
    }
    return <StaticMasonry {...props} />;
  }
  return <MeasuredMasonry {...props} />;
}

function StaticMasonry<T>({
  items,
  renderItem,
  getKey,
  columns = { base: 1, sm: 2, lg: 3, xl: 4 },
  className,
  classNames,
  styles,
}: MasonryProps<T>) {
  return (
    <div className={cn("@container w-full", className)}>
      <div
        className={cn("gap-4", resolveStaticColumnClasses(columns), classNames?.column)}
        style={styles?.column}
      >
        {items.map((item, index) => (
          <div
            key={String(getKey?.(item, index) ?? index)}
            className={cn("mb-4 break-inside-avoid", classNames?.item)}
            style={styles?.item}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

function MeasuredMasonry<T>({
  items,
  renderItem,
  getKey,
  columns = { base: 1, sm: 2, lg: 3, xl: 4 },
  className,
  classNames,
  styles,
}: MasonryProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const depth = React.useContext(MasonryDepthContext);
  const [columnCount, setColumnCount] = React.useState(() => resolveColumnCount(columns, 0));
  const [assignment, setAssignment] = React.useState<number[][]>(() =>
    distribute(items.length, columnCount, []),
  );

  const keys = React.useMemo(
    () => items.map((item, index) => String(getKey?.(item, index) ?? index)),
    [items, getKey],
  );
  const columnsKey = JSON.stringify(columns);
  const parsedColumns = React.useMemo(() => JSON.parse(columnsKey) as MasonryColumns, [columnsKey]);

  const measureRef = React.useRef<() => void>(() => {});
  measureRef.current = () => {
    const root = containerRef.current;
    if (!root) return;
    const count = resolveColumnCount(parsedColumns, root.clientWidth);
    const heights: number[] = Array.from({ length: items.length }, () => 0);
    for (const el of root.querySelectorAll<HTMLElement>("[data-masonry-key]")) {
      const index = Number(el.getAttribute("data-masonry-index"));
      if (index >= 0 && index < items.length) heights[index] = el.offsetHeight;
    }
    const next = distribute(items.length, count, heights);
    setColumnCount(count);
    setAssignment((prev) => (sameAssignment(prev, next) ? prev : next));
  };

  React.useLayoutEffect(() => {
    measureRef.current();
  });

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measureRef.current());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cols =
    assignment.length === columnCount ? assignment : distribute(items.length, columnCount, []);

  return (
    <MasonryDepthContext.Provider value={depth + 1}>
      <div ref={containerRef} className={cn("flex w-full gap-4", className)}>
        {cols.map((columnItems, columnIndex) => (
          <MasonryColumn
            key={columnIndex}
            className={cn("flex-1 gap-4", classNames?.column)}
            style={styles?.column}
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
    </MasonryDepthContext.Provider>
  );
}

Masonry.Column = MasonryColumn;
Masonry.Item = MasonryItem;
