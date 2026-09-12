"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";

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
  className?: ClassNameValue;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  
  getKey?: (row: T, index: number) => React.Key;
  
  sort?: SortState<T> | null;
  onSortChange?: (sort: SortState<T>) => void;
  
  initialSortDirection?: SortDirection;
  empty?: React.ReactNode;
  className?: ClassNameValue;
  classNames?: {
    wrapper?: ClassNameValue;
    table?: string;
    head?: ClassNameValue;
    headRow?: ClassNameValue;
    headCell?: ClassNameValue;
    body?: ClassNameValue;
    row?: ClassNameValue;
    cell?: ClassNameValue;
  };
  styles?: {
    wrapper?: React.CSSProperties;
    table?: React.CSSProperties;
  };
}

const alignClass = { left: "text-left", right: "text-right", center: "text-center" };

export function Table<T extends object>({
  data,
  columns,
  getKey,
  sort: controlledSort,
  onSortChange,
  initialSortDirection = "asc",
  empty,
  className,
  classNames,
  styles,
}: TableProps<T>) {
  const isControlled = controlledSort !== undefined;
  const [internalSort, setInternalSort] = React.useState<SortState<T>>(null);
  const sort = isControlled ? (controlledSort ?? null) : internalSort;

  const handleHeaderClick = (column: TableColumn<T>) => {
    if (!column.sortable) return;
    let next: SortState<T>;
    if (sort?.key !== column.key) {
      next = { key: column.key, direction: initialSortDirection };
    } else if (sort.direction === "asc") {
      next = { key: column.key, direction: "desc" };
    } else {
      next = null; 
    }
    if (!isControlled) setInternalSort(next);
    onSortChange?.(next);
  };

  const rows = React.useMemo(() => {
    if (!sort) return data;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return data;
    const compare =
      column.compare ??
      ((a: T, b: T) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        if (av === bv) return 0;
        return av > bv ? 1 : -1;
      });
    return [...data].sort((a, b) => (sort.direction === "asc" ? compare(a, b) : compare(b, a)));
  }, [data, columns, sort]);

  return (
    <div
      className={cn("w-full overflow-x-auto rounded-lg border", className)}
      style={styles?.wrapper}
    >
      <table className={cn("w-full border-collapse text-sm", classNames?.table)} style={styles?.table}>
        <thead className={cn(classNames?.head)}>
          <tr className={cn("border-b bg-muted/50", classNames?.headRow)}>
            {columns.map((column) => {
              const sorted = sort?.key === column.key;
              const SortIcon = !sorted
                ? ArrowUpDown
                : sort!.direction === "asc"
                  ? ArrowUp
                  : ArrowDown;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sorted ? (sort!.direction === "asc" ? "ascending" : "descending") : undefined
                  }
                  className={cn(
                    "h-10 px-3 font-medium text-muted-foreground",
                    alignClass[column.align ?? "left"],
                    column.sortable && "select-none",
                    column.sortable && "cursor-pointer hover:text-foreground",
                    column.className,
                    classNames?.headCell,
                  )}
                  onClick={column.sortable ? () => handleHeaderClick(column) : undefined}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      column.align === "right" && "flex-row-reverse",
                    )}
                  >
                    {column.header ?? column.key}
                    {column.sortable && (
                      <SortIcon
                        aria-hidden
                        className={cn("size-3.5", sorted ? "text-foreground" : "opacity-40")}
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={cn(classNames?.body)}>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-muted-foreground">
                {empty ?? "No data"}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={getKey?.(row, i) ?? i}
                className={cn("border-b transition-colors last:border-0 hover:bg-hover", classNames?.row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-3 py-2.5 align-middle", alignClass[column.align ?? "left"], classNames?.cell)}
                  >
                    {column.render ? column.render(row) : String(row[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
