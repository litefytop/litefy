"use client";

import {
  createContext,
  useContext,
  useMemo,
  ComponentProps,
  ReactNode,
} from "react";
import { ClassNameValue, cn } from "@/lib";

type PaginationContextValue = {
  current: number;
  pageSize: number;
  total: number;
  totalPages: number;
  goTo: (page: number) => void;
  goPrev: () => void;
  goNext: () => void;
  goFirst: () => void;
  goLast: () => void;
  setPageSize: (size: number) => void;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

export function usePagination() {
  const ctx = useContext(PaginationContext);
  if (!ctx) throw new Error("usePagination must be used within Pagination");
  return ctx;
}

export type PaginationProps = {
  current: number;
  pageSize: number;
  total: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: ClassNameValue;
  children?: ReactNode;
} & Omit<ComponentProps<"div">, "onChange">;

export function Pagination({
  current,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  className,
  children,
  ...props
}: PaginationProps) {
  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize],
  );

  const value = useMemo<PaginationContextValue>(
    () => ({
      current,
      pageSize,
      total,
      totalPages,
      goTo: (page: number) => {
        const p = Math.max(1, Math.min(page, totalPages));
        onPageChange?.(p);
      },
      goPrev: () => {
        const p = Math.max(1, Math.min(current - 1, totalPages));
        onPageChange?.(p);
      },
      goNext: () => {
        const p = Math.max(1, Math.min(current + 1, totalPages));
        onPageChange?.(p);
      },
      goFirst: () => {
        onPageChange?.(1);
      },
      goLast: () => {
        onPageChange?.(totalPages);
      },
      setPageSize: (size: number) => {
        onPageSizeChange?.(size);
        onPageChange?.(1);
      },
    }),
    [current, onPageChange, onPageSizeChange, pageSize, total, totalPages],
  );

  return (
    <PaginationContext.Provider value={value}>
      <div
        {...props}
        className={cn("flex items-center justify-between px-4 py-3", className)}
      >
        {children}
      </div>
    </PaginationContext.Provider>
  );
}

export type PaginationDescriptionProps = {
  format?: (total: number, current: number, totalPages: number) => string;
} & ComponentProps<"span">;

Pagination.Description = function PaginationDescription({
  format,
  className,
  ...props
}: PaginationDescriptionProps) {
  const { total, current, totalPages } = usePagination();
  const text = format
    ? format(total, current, totalPages)
    : `Total ${total} records · Page ${current} of ${totalPages}`;

  return (
    <span {...props} className={cn("text-sm text-muted-foreground", className)}>
      {text}
    </span>
  );
};

export type PaginationSizerProps = {
  options?: number[];
  format?: (size: number) => string;
} & ComponentProps<"select">;

Pagination.Sizer = function PaginationSizer({
  options = [10, 20, 50, 100],
  format,
  className,
  ...props
}: PaginationSizerProps) {
  const { pageSize, setPageSize } = usePagination();

  return (
    <select
      {...props}
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
      className={cn(
        "appearance-none h-9 w-28 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none items-center",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50",
        className,
      )}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {format ? format(opt) : `${opt} / page`}
        </option>
      ))}
    </select>
  );
};

Pagination.Controls = function PaginationControls({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span {...props} className={cn("flex items-center gap-2", className)} />
  );
};

export type PaginationJumperProps = {
  format?: (page: number) => string;
} & Omit<ComponentProps<"select">, "value" | "onChange">;

Pagination.Jumper = function PaginationJumper({
  format,
  className,
  ...props
}: PaginationJumperProps) {
  const { current, totalPages, goTo } = usePagination();

  return (
    <select
      {...props}
      value={current}
      onChange={(e) => goTo(Number(e.target.value))}
      className={cn(
        "appearance-none h-9 w-28 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none items-center",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50",
        className,
      )}
    >
      {Array.from({ length: totalPages }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {format ? format(i + 1) : `Page ${i + 1}`}
        </option>
      ))}
    </select>
  );
};
