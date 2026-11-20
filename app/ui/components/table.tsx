"use client";
import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Minus } from "./icons";
import { Checkbox, type CheckboxClassNames } from "./checkbox";
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
    body?: string;
    row?: string;
    cell?: string;
    empty?: string;
    bulkRow?: string;
    bulkBar?: string;
    bulkCount?: string;
    bulkLabel?: string;
    bulkActions?: string;
    bulkClear?: string;
    checkbox?: CheckboxClassNames;
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
    loading?: boolean;
    selectAllLabel?: string;
    rowLabel?: string;
    bulkActions?: React.ReactNode;
    selectedLabel?: string;
    clearLabel?: string;
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
const columnsStyle = (count: number): React.CSSProperties => ({
    ["--litefy-cols" as string]: count,
});
export function Table<T extends object>({ data, columns, getKey, sort: controlledSort, onSortChange, initialSortDirection = "asc", empty, caption, headExtra, selectable = false, rowKey, selected, defaultSelected = EMPTY_SELECTION, onSelectionChange, loading, selectAllLabel = "Select all on this page", rowLabel = "Select this row", bulkActions, selectedLabel = "selected", clearLabel = "Clear", className, classNames, styles, ...props }: TableProps<T>) {
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
    const selectionColumn: TableColumn<T> = {
        key: SELECTION_KEY as keyof T & string,
        header: (<Checkbox classNames={classNames?.checkbox} aria-label={selectAllLabel} checked={allSelected || someSelected} indicator={someSelected ? <Minus /> : undefined} onCheckedChange={toggleAll}/>),
    };
    const allColumns = selectable ? [selectionColumn, ...columns] : columns;
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
    const totalSpan = allColumns.reduce((sum, column) => sum + (column.span ?? 1), 0);
    const colGroup = (<colgroup>
      {allColumns.map((column) => (<col key={column.key} className={classNames?.col} style={{ width: `calc(${column.span ?? 1} * 100% / ${totalSpan})` }}/>))}
    </colgroup>);
    const bulkRowNode = selectable && selected$.length > 0 ? (<tr data-bulk="" className={classNames?.bulkRow}>
      <td colSpan={allColumns.length}>
        <div data-bulk-bar="" className={classNames?.bulkBar}>
          <span data-bulk-count="" className={classNames?.bulkCount}>{selected$.length}</span>
          <span data-bulk-label="" className={classNames?.bulkLabel}>{selectedLabel}</span>
          {bulkActions ? (<div data-bulk-actions="" className={classNames?.bulkActions}>{bulkActions}</div>) : null}
          <button type="button" data-bulk-clear="" className={classNames?.bulkClear} onClick={() => notify([])}>{clearLabel}</button>
        </div>
      </td>
    </tr>) : null;
    const rowKeyOf = (row: T, index: number) => (selectable && rowKey ? rowKey(row) : getKey?.(row, index) ?? index);
    return (<TableRoot {...props} className={className} style={{ ...styles?.wrapper, ...columnsStyle(allColumns.length) }}>
      <TableHead className={classNames?.head}>
        <TableBase className={classNames?.table} style={styles?.table}>
          {caption !== null && caption !== undefined && <caption className={classNames?.caption}>{caption}</caption>}
          {colGroup}
          <thead>
            <tr className={classNames?.headRow}>
              {allColumns.map((column) => {
            const sorted = sort?.key === column.key;
            const SortIcon = !sorted
                ? ArrowUpDown
                : sort!.direction === "asc"
                    ? ArrowUp
                    : ArrowDown;
            return (<th key={column.key} scope="col" aria-sort={sorted ? (sort!.direction === "asc" ? "ascending" : "descending") : undefined} data-align={column.align ?? "left"} data-sortable={column.sortable || undefined} data-sorted={sorted || undefined} className={[column.className, classNames?.headCell].filter(Boolean).join(" ")} onClick={column.sortable ? () => handleHeaderClick(column) : undefined}>
                    <span className={classNames?.headLabel} data-align={column.align ?? "left"}>
                      {column.header ?? column.key}
                      {column.sortable && (<SortIcon aria-hidden className={classNames?.sortIcon} data-active={sorted || undefined}/>)}
                    </span>
                  </th>);
        })}
            </tr>
            {headExtra}
            {bulkRowNode}
          </thead>
        </TableBase>
      </TableHead>
      <TableBody className={classNames?.body}>
        <TableBase className={classNames?.table} style={styles?.table}>
          {colGroup}
          <tbody>
            {rows.length === 0 ? (<tr>
                <td colSpan={allColumns.length} className={classNames?.empty}>
                  {empty ?? (loading ? "Loading..." : "No data")}
                </td>
              </tr>) : (rows.map((row, i) => (<tr key={rowKeyOf(row, i)} className={classNames?.row}>
                  {allColumns.map((column, ci) => {
            const isSelection = selectable && ci === 0;
            return (<td key={column.key} data-align={column.align ?? "left"} data-label={isSelection || typeof column.header !== "string" ? undefined : column.header} className={[column.className, classNames?.cell].filter(Boolean).join(" ")}>
                      {isSelection ? (<Checkbox classNames={classNames?.checkbox} aria-label={rowLabel} checked={selectedSet.has(keyOf(row, i))} onCheckedChange={() => toggleRow(keyOf(row, i))}/>) : column.render ? column.render(row) : String(row[column.key] ?? "")}
                    </td>);
        })}
                </tr>)))}
          </tbody>
        </TableBase>
      </TableBody>
    </TableRoot>);
}
