"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Button } from "./button";

export interface PaginationRootProps extends Omit<React.ComponentProps<"nav">, "className"> {
  className?: ClassNameValue;
}

export function PaginationRoot({ className, ...props }: PaginationRootProps) {
  return <nav {...props} aria-label="pagination" className={cn("flex items-center gap-1", className)} />;
}

export interface PaginationFirstProps extends Omit<React.ComponentProps<typeof Button>, "className" | "variant"> {
  className?: ClassNameValue;
}

export function PaginationFirst({ className, ...props }: PaginationFirstProps) {
  return (
    <Button type="button" variant="text" aria-label="First page" {...props} className={cn("px-0", className)}>
      <ChevronsLeft />
    </Button>
  );
}

export interface PaginationPrevProps extends Omit<React.ComponentProps<typeof Button>, "className" | "variant"> {
  className?: ClassNameValue;
}

export function PaginationPrev({ className, ...props }: PaginationPrevProps) {
  return (
    <Button type="button" variant="text" aria-label="Previous page" {...props} className={cn("px-0", className)}>
      <ChevronLeft />
    </Button>
  );
}

export interface PaginationNextProps extends Omit<React.ComponentProps<typeof Button>, "className" | "variant"> {
  className?: ClassNameValue;
}

export function PaginationNext({ className, ...props }: PaginationNextProps) {
  return (
    <Button type="button" variant="text" aria-label="Next page" {...props} className={cn("px-0", className)}>
      <ChevronRight />
    </Button>
  );
}

export interface PaginationLastProps extends Omit<React.ComponentProps<typeof Button>, "className" | "variant"> {
  className?: ClassNameValue;
}

export function PaginationLast({ className, ...props }: PaginationLastProps) {
  return (
    <Button type="button" variant="text" aria-label="Last page" {...props} className={cn("px-0", className)}>
      <ChevronsRight />
    </Button>
  );
}

export interface PaginationEllipsisProps extends Omit<React.ComponentProps<"span">, "className" | "children"> {
  className?: ClassNameValue;
}

export function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      {...props}
      className={cn("inline-flex size-8 items-center justify-center text-muted-foreground", className)}
    >
      <MoreHorizontal className="size-4" />
    </span>
  );
}

export interface PaginationSummaryProps
  extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
}

export function PaginationSummary({ className, ...props }: PaginationSummaryProps) {
  return (
    <span {...props} className={cn("min-w-0 text-sm text-muted-foreground", className)} />
  );
}

export interface PaginationPagesProps {
  page: number;
  totalPages: number;
  siblingCount?: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
  className?: ClassNameValue;
}

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let page = Math.max(1, start); page <= end; page++) out.push(page);
  return out;
}

function buildPageItems(page: number, totalPages: number, siblingCount: number): (number | "ellipsis")[] {
  const maxSlots = siblingCount * 2 + 5;
  if (totalPages <= maxSlots) return range(1, totalPages);
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(totalPages - 1, page + siblingCount);
  const items: (number | "ellipsis")[] = [1];
  if (left > 2) items.push("ellipsis");
  for (let p = left; p <= right; p++) items.push(p);
  if (right < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);
  return items;
}

export function PaginationPages({
  page,
  totalPages,
  siblingCount = 1,
  onPageChange,
  disabled,
  className,
}: PaginationPagesProps) {
  const items = React.useMemo(
    () => buildPageItems(page, totalPages, siblingCount),
    [page, totalPages, siblingCount],
  );
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {items.map((item, index) =>
        typeof item === "number" ? (
          <Button
            key={index}
            type="button"
            variant={item === page ? "outline" : "text"}
            aria-current={item === page ? "page" : undefined}
            disabled={disabled}
            onClick={() => onPageChange?.(item)}
            className="min-w-8 px-0 tabular-nums"
          >
            {item}
          </Button>
        ) : (
          <PaginationEllipsis key={index} />
        ),
      )}
    </div>
  );
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
  summary?: React.ReactNode;
  className?: ClassNameValue;
  classNames?: {
    pages?: ClassNameValue;
    summary?: ClassNameValue;
  };
  styles?: {
    summary?: React.CSSProperties;
  };
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  disabled,
  summary,
  className,
  classNames,
  styles,
}: PaginationProps) {
  const atStart = page <= 1;
  const atEnd = page >= totalPages;
  return (
    <PaginationRoot className={cn(summary != null && "flex-wrap gap-x-3 gap-y-2", className)}>
      {summary != null && (
        <PaginationSummary className={classNames?.summary} style={styles?.summary}>
          {summary}
        </PaginationSummary>
      )}
      <div className={cn("flex items-center gap-1", summary != null && "ms-auto")}>
        <PaginationFirst disabled={disabled || atStart} onClick={() => onPageChange?.(1)} />
        <PaginationPrev disabled={disabled || atStart} onClick={() => onPageChange?.(page - 1)} />
        <PaginationPages
          page={page}
          totalPages={totalPages}
          siblingCount={siblingCount}
          onPageChange={onPageChange}
          disabled={disabled}
          className={classNames?.pages}
        />
        <PaginationNext disabled={disabled || atEnd} onClick={() => onPageChange?.(page + 1)} />
        <PaginationLast disabled={disabled || atEnd} onClick={() => onPageChange?.(totalPages)} />
      </div>
    </PaginationRoot>
  );
}
