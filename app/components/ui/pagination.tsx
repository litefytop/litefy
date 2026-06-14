"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

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

const PaginationContext = React.createContext<PaginationContextValue | null>(
  null,
);

export function usePagination() {
  const ctx = React.useContext(PaginationContext);
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
  children?: React.ReactNode;
} & Omit<React.ComponentProps<"div">, "onChange">;

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
  const totalPages = React.useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize],
  );

  const value = React.useMemo<PaginationContextValue>(
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
} & React.ComponentProps<"span">;

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
} & React.ComponentProps<"select">;

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

export type PaginationControlsProps = {
  variant: "first" | "prev" | "next" | "last";
} & React.ComponentProps<"button">;

Pagination.Controls = function PaginationControls({
  variant,
  className,
  children,
  ...props
}: PaginationControlsProps) {
  const { current, totalPages, goFirst, goPrev, goNext, goLast } =
    usePagination();
  let onClick: () => void;
  let disabled: boolean;

  switch (variant) {
    case "first":
      onClick = goFirst;
      disabled = current === 1;
      break;
    case "prev":
      onClick = goPrev;
      disabled = current === 1;
      break;
    case "next":
      onClick = goNext;
      disabled = current === totalPages;
      break;
    case "last":
      onClick = goLast;
      disabled = current === totalPages;
      break;
    default:
      return null;
  }

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
    >
      {children}
    </button>
  );
};

export type PaginationJumperProps = {
  format?: (page: number) => string;
} & Omit<React.ComponentProps<"select">, "value" | "onChange">;

Pagination.Jumper = function PaginationJumper({
  format,
  className,
  ...props
}: PaginationJumperProps) {
  const { current, totalPages, goTo } = usePagination();
  const pages = React.useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );
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
      {pages.map((page) => (
        <option key={page} value={page}>
          {format ? format(page) : `Page ${page}`}
        </option>
      ))}
    </select>
  );
};

const indicatorClass = {
  base: "inline-flex items-center justify-center shrink-0 cursor-pointer select-none",
  number:
    "h-9 min-w-9 px-1 rounded-md text-muted-foreground data-active:text-primary data-active:border-primary data-active:border",
  dot: "size-2 rounded-full bg-muted data-active:bg-primary",
  bar: "w-6 h-2 rounded bg-muted data-active:bg-primary",
};

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type PaginationIndicatorProps = {
  variant?: keyof typeof indicatorClass;
  visibleCount?: number;
  slotProps?: {
    root?: HTMLAttrs<React.ComponentProps<"div">>;
    item?: HTMLAttrs<React.ComponentProps<"button">>;
  };
};
Pagination.Indicator = function PaginationIndicator({
  variant = "number",
  visibleCount = 5,
  slotProps,
}: PaginationIndicatorProps) {
  const { current, totalPages, goTo } = usePagination();
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [startIndex, setStartIndex] = React.useState(0);
  const viewCount = Math.min(visibleCount, totalPages);
  const curIdx = current - 1;

  React.useEffect(() => {
    if (totalPages <= viewCount) {
      setStartIndex(0);
      return;
    }
    if (curIdx <= startIndex) {
      setStartIndex(curIdx);
    } else if (curIdx >= startIndex + viewCount) {
      setStartIndex(curIdx - viewCount + 1);
    }
  }, [curIdx, viewCount, totalPages, startIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(document.activeElement)) return;
    const allowed = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!allowed.includes(e.key)) return;
    e.preventDefault();
    let target = current;
    switch (e.key) {
      case "ArrowLeft":
        target = current - 1;
        break;
      case "ArrowRight":
        target = current + 1;
        break;
      case "Home":
        target = 1;
        break;
      case "End":
        target = totalPages;
        break;
    }
    const next = Math.max(1, Math.min(target, totalPages));
    goTo(next);
    setTimeout(() => {
      const focusPos = next - startIndex - 1;
      itemRefs.current[focusPos]?.focus();
    }, 0);
  };

  const renderPages: number[] = [];
  for (let i = startIndex; i < startIndex + viewCount; i++) {
    renderPages.push(i + 1);
  }

  return (
    <div
      {...slotProps?.root}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        "flex items-center gap-2 p-1 overflow-hidden",
        slotProps?.root?.className,
      )}
    >
      {renderPages.map((page, idx) => {
        const active = page === current;
        return (
          <button
            {...slotProps?.item}
            key={page}
            data-active={active || undefined}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            role="tab"
            tabIndex={active ? 0 : -1}
            aria-selected={active}
            onClick={() => goTo(page)}
            className={cn(
              indicatorClass.base,
              indicatorClass[variant],
              slotProps?.item?.className,
            )}
          >
            {variant === "number" ? page : null}
          </button>
        );
      })}
    </div>
  );
};
