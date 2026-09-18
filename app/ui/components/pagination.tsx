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

export interface PaginationPrevProps extends Omit<React.ComponentProps<typeof Button>, "className" | "variant"> {
  className?: ClassNameValue;
}

export interface PaginationNextProps extends Omit<React.ComponentProps<typeof Button>, "className" | "variant"> {
  className?: ClassNameValue;
}

export interface PaginationLastProps extends Omit<React.ComponentProps<typeof Button>, "className" | "variant"> {
  className?: ClassNameValue;
}

function PaginationNavButton({
  label,
  children,
  className,
  ...props
}: PaginationFirstProps & { label: string }) {
  return (
    <Button type="button" variant="text" aria-label={label} {...props} className={cn("px-0", className)}>
      {children}
    </Button>
  );
}

export function PaginationFirst({ className, ...props }: PaginationFirstProps) {
  return (
    <PaginationNavButton label="First page" {...props} className={className}>
      <ChevronsLeft />
    </PaginationNavButton>
  );
}

export function PaginationPrev({ className, ...props }: PaginationPrevProps) {
  return (
    <PaginationNavButton label="Previous page" {...props} className={className}>
      <ChevronLeft />
    </PaginationNavButton>
  );
}

export function PaginationNext({ className, ...props }: PaginationNextProps) {
  return (
    <PaginationNavButton label="Next page" {...props} className={className}>
      <ChevronRight />
    </PaginationNavButton>
  );
}

export function PaginationLast({ className, ...props }: PaginationLastProps) {
  return (
    <PaginationNavButton label="Last page" {...props} className={className}>
      <ChevronsRight />
    </PaginationNavButton>
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
    <span
      {...props}
      className={cn("min-w-0 flex-1 text-sm text-muted-foreground", className)}
    />
  );
}

export interface PaginationPagesProps {
  page: number;
  totalPages: number;
  siblingCount?: number;
  onPageChange?: (page: number) => void;
  disabled?: boolean;
  className?: ClassNameValue;
  style?: React.CSSProperties;
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
  style,
}: PaginationPagesProps) {
  const items = React.useMemo(
    () => buildPageItems(page, totalPages, siblingCount),
    [page, totalPages, siblingCount],
  );
  return (
    <div className={cn("flex items-center gap-1", className)} style={style}>
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
    pages?: React.CSSProperties;
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
    <PaginationRoot className={cn(summary != null && "gap-x-3", className)}>
      {summary != null && (
        <PaginationSummary className={classNames?.summary} style={styles?.summary}>
          {summary}
        </PaginationSummary>
      )}
      <div className={cn("flex items-center gap-1", summary != null && "shrink-0")}>
        <PaginationFirst disabled={disabled || atStart} onClick={() => onPageChange?.(1)} />
        <PaginationPrev disabled={disabled || atStart} onClick={() => onPageChange?.(page - 1)} />
        <PaginationPages
          page={page}
          totalPages={totalPages}
          siblingCount={siblingCount}
          onPageChange={onPageChange}
          disabled={disabled}
          className={classNames?.pages}
          style={styles?.pages}
        />
        <PaginationNext disabled={disabled || atEnd} onClick={() => onPageChange?.(page + 1)} />
        <PaginationLast disabled={disabled || atEnd} onClick={() => onPageChange?.(totalPages)} />
      </div>
    </PaginationRoot>
  );
}
