"use client";
import * as React from "react";
export type MasonryBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";
export type MasonryColumns = number | ({
    base?: number;
} & Partial<Record<MasonryBreakpoint, number>>);
const BREAKPOINTS: [
    MasonryBreakpoint,
    number
][] = [
    ["sm", 640],
    ["md", 768],
    ["lg", 1024],
    ["xl", 1280],
    ["2xl", 1536],
];
const DEFAULT_COLUMNS: MasonryColumns = { base: 1, sm: 2, lg: 3, xl: 4 };
function resolveColumnCount(columns: MasonryColumns, width: number): number {
    if (typeof columns === "number")
        return Math.max(1, Math.floor(columns));
    let count = columns.base ?? 1;
    for (const [bp, px] of BREAKPOINTS) {
        const at = columns[bp];
        if (width >= px && at !== undefined)
            count = at;
    }
    return Math.max(1, Math.floor(count));
}
type MasonryColumnAssignment = { key: number; items: number[] };
function distribute(count: number, columns: number, heights: number[]): MasonryColumnAssignment[] {
    const cols: MasonryColumnAssignment[] = Array.from({ length: columns }, (_, key) => ({ key, items: [] }));
    const colHeights = Array.from({ length: columns }, () => 0);
    for (let i = 0; i < count; i++) {
        let target = 0;
        for (let c = 1; c < columns; c++) {
            if (colHeights[c] < colHeights[target])
                target = c;
        }
        cols[target].items.push(i);
        colHeights[target] += heights[i] > 0 ? heights[i] : 1;
    }
    return cols;
}
function sameAssignment(a: MasonryColumnAssignment[], b: MasonryColumnAssignment[]) {
    return a.length === b.length && a.every((col, i) => col.items.join(",") === b[i].items.join(","));
}
const MasonryDepthContext = React.createContext(0);
let warnedNested = false;
const GAP = "1rem";
const ROOT_STYLE: React.CSSProperties = { display: "flex", width: "100%", minWidth: 0, gap: GAP };
const COLUMN_STYLE: React.CSSProperties = {
    display: "flex",
    flex: "1 1 0%",
    flexDirection: "column",
    minWidth: 0,
    gap: GAP,
};
const ITEM_STYLE: React.CSSProperties = { minWidth: 0 };
const STATIC_ROOT_STYLE: React.CSSProperties = { width: "100%", minWidth: 0 };
export interface MasonryColumnProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function MasonryColumn(props: MasonryColumnProps) {
    return <div {...props} style={{ ...COLUMN_STYLE, ...props.style }}/>
}
export interface MasonryItemProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function MasonryItem(props: MasonryItemProps) {
    return <div {...props} style={{ ...ITEM_STYLE, ...props.style }}/>
}
export interface MasonryProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey?: (item: T, index: number) => React.Key;
    columns?: MasonryColumns;
    layout?: "balanced" | "static";
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        column?: string;
        item?: string;
    };
    styles?: {
        column?: React.CSSProperties;
        item?: React.CSSProperties;
    };
}
export function Masonry<T>(props: MasonryProps<T>) {
    const depth = React.useContext(MasonryDepthContext);
    const nested = depth > 0;
    React.useEffect(() => {
        if (process.env.NODE_ENV !== "production" && nested && props.layout !== "static" && !warnedNested) {
            warnedNested = true;
            console.warn("[masonry] Nested Masonry detected — rendering a static CSS columns layout (no height balancing). Only the outermost Masonry measures item heights.");
        }
    }, [nested, props.layout]);
    if (nested || props.layout === "static") {
        return <StaticMasonry {...props}/>;
    }
    return <MeasuredMasonry {...props}/>;
}
function useResolvedColumnCount(columns: MasonryColumns, ref: React.RefObject<HTMLDivElement | null>) {
    const columnsKey = JSON.stringify(columns);
    const parsed = React.useMemo(() => JSON.parse(columnsKey) as MasonryColumns, [columnsKey]);
    const [count, setCount] = React.useState(() => resolveColumnCount(parsed, 0));
    React.useLayoutEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        const measure = () => setCount((prev) => {
            const next = resolveColumnCount(parsed, el.clientWidth);
            return prev === next ? prev : next;
        });
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [parsed, ref]);
    return count;
}
function StaticMasonry<T>({ items, renderItem, getKey, columns = DEFAULT_COLUMNS, className, style, classNames, styles, }: MasonryProps<T>) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const depth = React.useContext(MasonryDepthContext);
    const count = useResolvedColumnCount(typeof columns === "number" ? { base: columns } : columns, rootRef);
    return (<MasonryDepthContext.Provider value={depth + 1}>
      <div ref={rootRef} className={className} style={{ ...STATIC_ROOT_STYLE, ...style }}>
      <div className={classNames?.column} style={{ columnCount: count, columnGap: GAP, ...styles?.column }}>
        {items.map((item, index) => (<div key={String(getKey?.(item, index) ?? index)} className={classNames?.item} style={{ breakInside: "avoid", marginBottom: GAP, ...ITEM_STYLE, ...styles?.item }}>
            {renderItem(item, index)}
          </div>))}
      </div>
      </div>
    </MasonryDepthContext.Provider>);
}
function MeasuredMasonry<T>({ items, renderItem, getKey, columns = DEFAULT_COLUMNS, className, style, classNames, styles, }: MasonryProps<T>) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const depth = React.useContext(MasonryDepthContext);
    const [columnCount, setColumnCount] = React.useState(() => resolveColumnCount(columns, 0));
    const [assignment, setAssignment] = React.useState<MasonryColumnAssignment[]>(() => distribute(items.length, columnCount, []));
    const keys = React.useMemo(() => items.map((item, index) => String(getKey?.(item, index) ?? index)), [items, getKey]);
    const columnsKey = JSON.stringify(columns);
    const parsedColumns = React.useMemo(() => JSON.parse(columnsKey) as MasonryColumns, [columnsKey]);
    const measureRef = React.useRef<() => void>(() => { });
    React.useLayoutEffect(() => {
        measureRef.current = () => {
            const root = containerRef.current;
            if (!root)
                return;
            const count = resolveColumnCount(parsedColumns, root.clientWidth);
            const heights: number[] = Array.from({ length: items.length }, () => 0);
            for (const el of root.querySelectorAll<HTMLElement>("[data-masonry-key]")) {
                const index = Number(el.dataset.masonryIndex);
                if (index >= 0 && index < items.length)
                    heights[index] = el.offsetHeight;
            }
            const next = distribute(items.length, count, heights);
            setColumnCount(count);
            setAssignment((prev) => (sameAssignment(prev, next) ? prev : next));
        };
    });
    React.useLayoutEffect(() => {
        measureRef.current();
    });
    React.useEffect(() => {
        const el = containerRef.current;
        if (!el)
            return;
        const observer = new ResizeObserver(() => measureRef.current());
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    const cols = assignment.length === columnCount ? assignment : distribute(items.length, columnCount, []);
    return (<MasonryDepthContext.Provider value={depth + 1}>
      <div ref={containerRef} className={className} style={{ ...ROOT_STYLE, ...style }}>
        {cols.map(({ key: columnKey, items: columnItems }) => (<MasonryColumn key={columnKey} className={classNames?.column} style={styles?.column}>
            {columnItems.map((itemIndex) => {
                const key = keys[itemIndex];
                return (<MasonryItem key={key} data-masonry-key={key} data-masonry-index={itemIndex} className={classNames?.item} style={styles?.item}>
                  {renderItem(items[itemIndex], itemIndex)}
                </MasonryItem>);
            })}
          </MasonryColumn>))}
      </div>
    </MasonryDepthContext.Provider>);
}
