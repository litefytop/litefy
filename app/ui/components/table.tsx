"use client";
import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical, Minus } from "./icons";
import { Checkbox, type CheckboxClassNames } from "./checkbox";
import { useVirtualScroll } from "../utils/use-virtual-scroll";
export type SortDirection = "asc" | "desc";
export type SortState<T> = {
    key: keyof T & string;
    direction: SortDirection;
} | null;
export interface TableColumn<T> {
    key: keyof T & string;
    header?: React.ReactNode;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
    compare?: (a: T, b: T) => number;
    align?: "left" | "right" | "center";
    className?: string;
    span?: number;
    collapse?: boolean;
}
export interface TableClassNames {
    table?: string;
    caption?: string;
    col?: string;
    head?: string;
    headRow?: string;
    headCell?: string;
    headLabel?: string;
    sortIcon?: string;
    dragHandle?: string;
    body?: string;
    row?: string;
    cell?: string;
    empty?: string;
    checkbox?: CheckboxClassNames;
    cellCollapse?: string;
}
export interface TableProps<T> extends Omit<React.ComponentProps<"div">, "className" | "ref"> {
    data: T[];
    columns: TableColumn<T>[];
    getKey?: (row: T, index: number) => React.Key;
    sort?: SortState<T> | null;
    onSortChange?: (sort: SortState<T>) => void;
    initialSortDirection?: SortDirection;
    empty?: React.ReactNode;
    caption?: React.ReactNode;
    headExtra?: React.ReactNode;
    selectable?: boolean;
    rowKey?: (row: T) => string;
    selected?: string[];
    defaultSelected?: string[];
    onSelectionChange?: (selected: string[]) => void;
    zebra?: boolean;
    virtual?: boolean;
    rowHeight?: number;
    columnDrag?: boolean;
    columnOrder?: string[];
    defaultColumnOrder?: string[];
    onColumnsChange?: (keys: string[]) => void;
    dragHandleLabel?: string;
    loading?: boolean;
    selectAllLabel?: string;
    rowLabel?: string;
    className?: string;
    classNames?: TableClassNames;
    styles?: {
        wrapper?: React.CSSProperties;
        table?: React.CSSProperties;
    };
}
export interface TableRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function TableRoot(props: TableRootProps) {
    return <div {...props}/>;
}
export interface TableHeadProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function TableHead(props: TableHeadProps) {
    return <div {...props}/>;
}
export interface TableBodyProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function TableBody(props: TableBodyProps) {
    return <div {...props}/>;
}
export interface TableBaseProps extends Omit<React.ComponentProps<"table">, "className"> {
    className?: string;
}
export function TableBase(props: TableBaseProps) {
    return <table {...props} style={{ tableLayout: "fixed", ...props.style }}/>;
}
const SELECTION_KEY = "__selection";
const EMPTY_SELECTION: string[] = [];
const EMPTY_ORDER: string[] = [];
const INTERACTIVE_ROW_SELECTOR = "button, a, input, select, textarea, label, [role='button'], [data-no-row-select]";
const DEFAULT_ROW_HEIGHT = 45;
const MIN_COLUMN_WIDTH = 64;
const SELECTION_COLUMN_WIDTH = 44;
function CollapseCell({ content, title, className }: { content: React.ReactNode; title?: string; className?: string }) {
    const [expanded, setExpanded] = React.useState(false);
    const [truncated, setTruncated] = React.useState(false);
    const ref = React.useRef<HTMLButtonElement>(null);
    React.useLayoutEffect(() => {
        const node = ref.current;
        if (!node || expanded) {
            setTruncated(false);
            return;
        }
        const measure = () => setTruncated(node.scrollWidth > node.clientWidth);
        measure();
        const observer = new ResizeObserver(() => measure());
        observer.observe(node);
        return () => observer.disconnect();
    }, [expanded]);
    return (<button type="button" ref={ref} className={className} data-expanded={expanded || undefined} title={truncated ? title : undefined} onClick={() => setExpanded(true)}>{content}</button>);
}
export function Table<T extends object>({ data, columns, getKey, sort: controlledSort, onSortChange, initialSortDirection = "asc", empty, caption, headExtra, selectable = false, rowKey, selected, defaultSelected = EMPTY_SELECTION, onSelectionChange, zebra = false, virtual = false, rowHeight = DEFAULT_ROW_HEIGHT, columnDrag = false, columnOrder, defaultColumnOrder = EMPTY_ORDER, onColumnsChange, dragHandleLabel = "Reorder column", loading, selectAllLabel = "Select all on this page", rowLabel = "Select this row", className, classNames, styles, ...props }: TableProps<T>) {
    const isControlled = controlledSort !== undefined;
    const [internalSort, setInternalSort] = React.useState<SortState<T>>(null);
    const sort = isControlled ? (controlledSort ?? null) : internalSort;
    const handleHeaderClick = (column: TableColumn<T>) => {
        if (!column.sortable)
            return;
        let next: SortState<T>;
        if (sort?.key !== column.key) {
            next = { key: column.key, direction: initialSortDirection };
        }
        else if (sort.direction === "asc") {
            next = { key: column.key, direction: "desc" };
        }
        else {
            next = null;
        }
        if (!isControlled)
            setInternalSort(next);
        onSortChange?.(next);
    };
    const isSelectionControlled = selected !== undefined;
    const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultSelected);
    const selected$ = isSelectionControlled ? selected : internalSelected;
    const selectedSet = React.useMemo(() => new Set(selected$), [selected$]);
    const keyOf = (row: T, index: number) => rowKey ? rowKey(row) : String(getKey?.(row, index) ?? index);
    const pageKeys = React.useMemo(() => data.map((row, index) => (rowKey ? rowKey(row) : String(getKey?.(row, index) ?? index))), [data, rowKey, getKey]);
    const selectedOnPage = pageKeys.filter((key) => selectedSet.has(key)).length;
    const allSelected = data.length > 0 && selectedOnPage === data.length;
    const someSelected = selectedOnPage > 0 && !allSelected;
    const notify = (next: string[]) => {
        if (!isSelectionControlled)
            setInternalSelected(next);
        onSelectionChange?.(next);
    };
    const toggleAll = () => {
        if (allSelected) {
            notify(selected$.filter((key) => !pageKeys.includes(key)));
        }
        else {
            notify([...selected$, ...pageKeys.filter((key) => !selectedSet.has(key))]);
        }
    };
    const toggleRow = (key: string) => {
        notify(selectedSet.has(key) ? selected$.filter((k) => k !== key) : [...selected$, key]);
    };
    const isOrderControlled = columnOrder !== undefined;
    const [internalOrder, setInternalOrder] = React.useState<string[]>(defaultColumnOrder);
    const order$ = isOrderControlled ? columnOrder : internalOrder;
    const notifyOrder = (next: string[]) => {
        if (!isOrderControlled)
            setInternalOrder(next);
        onColumnsChange?.(next);
    };
    const orderedColumns = React.useMemo(() => {
        if (order$.length === 0)
            return columns;
        const rank = new Map(order$.map((key, index) => [key, index]));
        const known = columns
            .filter((column) => rank.has(column.key))
            .toSorted((a, b) => rank.get(a.key)! - rank.get(b.key)!);
        const rest = columns.filter((column) => !rank.has(column.key));
        return [...known, ...rest];
    }, [columns, order$]);
    const orderedKeys: string[] = orderedColumns.map((column) => column.key);
    const moveColumn = (from: string, to: string) => {
        const keys = [...orderedKeys];
        const fromIndex = keys.indexOf(from);
        const toIndex = keys.indexOf(to);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
            return;
        keys.splice(toIndex, 0, keys.splice(fromIndex, 1)[0]);
        notifyOrder(keys);
    };
    const dragKeyRef = React.useRef<string | null>(null);
    const [dragOverKey, setDragOverKey] = React.useState<string | null>(null);
    const clearDrag = () => {
        dragKeyRef.current = null;
        setDragOverKey(null);
    };
    const [grabbedKey, setGrabbedKey] = React.useState<string | null>(null);
    const grabOrderRef = React.useRef<string[] | null>(null);
    const handleGrabKeyDown = (event: React.KeyboardEvent, key: string) => {
        event.stopPropagation();
        if (grabbedKey === null) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                grabOrderRef.current = [...orderedKeys];
                setGrabbedKey(key);
            }
            return;
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            const keys = [...orderedKeys];
            const index = keys.indexOf(grabbedKey);
            const next = event.key === "ArrowLeft" ? index - 1 : index + 1;
            if (index === -1 || next < 0 || next >= keys.length)
                return;
            keys.splice(next, 0, keys.splice(index, 1)[0]);
            notifyOrder(keys);
        }
        else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            grabOrderRef.current = null;
            setGrabbedKey(null);
        }
        else if (event.key === "Escape") {
            if (grabOrderRef.current)
                notifyOrder(grabOrderRef.current);
            grabOrderRef.current = null;
            setGrabbedKey(null);
        }
    };
    const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, key: string) => {
        const target = event.target as HTMLElement;
        if (target.closest("[data-selection-cell]"))
            return;
        if (target.closest(INTERACTIVE_ROW_SELECTOR))
            return;
        toggleRow(key);
    };
    const selectionColumn: TableColumn<T> = {
        key: SELECTION_KEY as keyof T & string,
        header: (<Checkbox classNames={classNames?.checkbox} aria-label={selectAllLabel} checked={allSelected || someSelected} indicator={someSelected ? <Minus /> : undefined} onCheckedChange={toggleAll}/>),
    };
    const allColumns = selectable ? [selectionColumn, ...orderedColumns] : orderedColumns;
    const rows = React.useMemo(() => {
        if (!sort)
            return data;
        const column = columns.find((c) => c.key === sort.key);
        if (!column)
            return data;
        const compare = column.compare ??
            ((a: T, b: T) => {
                const av = a[sort.key];
                const bv = b[sort.key];
                if (av === bv)
                    return 0;
                return av > bv ? 1 : -1;
            });
        return [...data].toSorted((a, b) => (sort.direction === "asc" ? compare(a, b) : compare(b, a)));
    }, [data, columns, sort]);
    const rowHeight$ = rowHeight;
    const virtualizer = useVirtualScroll({ itemCount: virtual ? rows.length : 0, itemHeight: rowHeight$, visibleCount: 10, overscan: 8 });
    const startIndex = virtual ? (virtualizer.visibleItems.at(0)?.index ?? 0) : 0;
    const endIndex = virtual ? ((virtualizer.visibleItems.at(-1)?.index ?? -1) + 1) : rows.length;
    const visibleRows = rows.slice(startIndex, endIndex);
    const totalSpan = orderedColumns.reduce((sum, column) => sum + (column.span ?? 1), 0);
    const scrollMinWidth = selectable
        ? `calc(${SELECTION_COLUMN_WIDTH}px + ${MIN_COLUMN_WIDTH}px * ${orderedColumns.length})`
        : `calc(${MIN_COLUMN_WIDTH}px * ${orderedColumns.length})`;
    const colGroup = (<colgroup>
      {allColumns.map((column) => {
        const isSelection = selectable && column.key === SELECTION_KEY;
        const width = isSelection
            ? `${SELECTION_COLUMN_WIDTH}px`
            : selectable
                ? `max(${MIN_COLUMN_WIDTH}px, calc((100% - ${SELECTION_COLUMN_WIDTH}px) * ${column.span ?? 1} / ${totalSpan}))`
                : `max(${MIN_COLUMN_WIDTH}px, calc(${column.span ?? 1} * 100% / ${totalSpan}))`;
        return (<col key={column.key} className={classNames?.col} style={{ width }}/>);
    })}
    </colgroup>);
    const rowKeyOf = (row: T, index: number) => (selectable && rowKey ? rowKey(row) : getKey?.(row, index) ?? index);
    return (<TableRoot {...props} className={className} style={{ ...styles?.wrapper }}>
      <TableHead className={classNames?.head} style={{ minWidth: scrollMinWidth }}>
        <TableBase className={classNames?.table} style={styles?.table}>
          {caption !== null && caption !== undefined && <caption className={classNames?.caption}>{caption}</caption>}
          {colGroup}
          <thead>
            <tr className={classNames?.headRow}>
              {allColumns.map((column, ci) => {
            const isSelection = selectable && ci === 0;
            const sorted = sort?.key === column.key;
            const SortIcon = !sorted
                ? ArrowUpDown
                : sort!.direction === "asc"
                    ? ArrowUp
                    : ArrowDown;
            const draggable = columnDrag && !isSelection && orderedColumns.length > 1;
            const dragOver = dragOverKey === column.key;
            const grabbed = grabbedKey === column.key;
            const thProps = draggable
                ? {
                    draggable: true,
                    onDragStart: (event: React.DragEvent<HTMLTableCellElement>) => {
                        dragKeyRef.current = column.key;
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", column.key);
                    },
                    onDragOver: (event: React.DragEvent<HTMLTableCellElement>) => {
                        if (!dragKeyRef.current || dragKeyRef.current === column.key)
                            return;
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        if (!dragOver)
                            setDragOverKey(column.key);
                    },
                    onDrop: (event: React.DragEvent<HTMLTableCellElement>) => {
                        event.preventDefault();
                        const from = dragKeyRef.current;
                        if (from)
                            moveColumn(from, column.key);
                        clearDrag();
                    },
                    onDragEnd: clearDrag,
                }
                : undefined;
            return (<th key={column.key} scope="col" aria-sort={sorted ? (sort!.direction === "asc" ? "ascending" : "descending") : undefined} data-align={isSelection ? "center" : column.align ?? "left"} data-sortable={column.sortable || undefined} data-sorted={sorted || undefined} data-drag-over={dragOver || undefined} className={[column.className, classNames?.headCell].filter(Boolean).join(" ")} onClick={column.sortable ? () => handleHeaderClick(column) : undefined} {...thProps}>
                    <span className={classNames?.headLabel} data-align={column.align ?? "left"}>
                      {column.header ?? column.key}
                      {column.sortable && (<SortIcon aria-hidden className={classNames?.sortIcon} data-active={sorted || undefined}/>)}
                      {draggable && (<button type="button" aria-label={dragHandleLabel} aria-pressed={grabbed} data-grabbed={grabbed || undefined} className={classNames?.dragHandle} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => handleGrabKeyDown(event, column.key)}>
                          <GripVertical aria-hidden/>
                        </button>)}
                    </span>
                  </th>);
        })}
            </tr>
            {headExtra}
          </thead>
        </TableBase>
      </TableHead>
      <TableBody className={classNames?.body} style={{ minWidth: scrollMinWidth }} {...(virtual ? { ref: virtualizer.containerProps.ref, onScroll: virtualizer.containerProps.onScroll } : {})}>
        <TableBase className={classNames?.table} style={styles?.table}>
            {colGroup}
            <tbody>
              {rows.length === 0 ? (<tr>
                  <td colSpan={allColumns.length} className={classNames?.empty}>
                    {empty ?? (loading ? "Loading..." : "No data")}
                  </td>
                </tr>) : (<>
                  {virtual && startIndex > 0 ? (<tr aria-hidden="true" style={{ height: startIndex * rowHeight$ }}>
                      <td aria-label="placeholder" colSpan={allColumns.length}/>
                    </tr>) : null}
                  {visibleRows.map((row, ri) => {
            const i = startIndex + ri;
            return (<tr key={rowKeyOf(row, i)} className={classNames?.row} data-selectable={selectable || undefined} data-zebra={zebra && i % 2 === 1 ? "odd" : undefined} onClick={selectable ? (event) => handleRowClick(event, keyOf(row, i)) : undefined}>
                  {allColumns.map((column, ci) => {
                const isSelection = selectable && ci === 0;
                const value = column.render ? column.render(row) : String(row[column.key] ?? "");
                return (<td key={column.key} data-align={isSelection ? "center" : column.align ?? "left"} data-label={isSelection || typeof column.header !== "string" ? undefined : column.header} data-selection-cell={isSelection || undefined} className={[column.className, classNames?.cell].filter(Boolean).join(" ")}>
                      {isSelection ? (<Checkbox classNames={classNames?.checkbox} aria-label={rowLabel} checked={selectedSet.has(keyOf(row, i))} onCheckedChange={() => toggleRow(keyOf(row, i))}/>) : column.collapse ? (<CollapseCell className={classNames?.cellCollapse} content={value} title={typeof value === "string" ? value : undefined}/>) : value}
                    </td>);
            })}
                </tr>);
        })}
                  {virtual && endIndex < rows.length ? (<tr aria-hidden="true" style={{ height: (rows.length - endIndex) * rowHeight$ }}>
                      <td aria-label="placeholder" colSpan={allColumns.length}/>
                    </tr>) : null}
                </>)}
            </tbody>
          </TableBase>
      </TableBody>
    </TableRoot>);
}
