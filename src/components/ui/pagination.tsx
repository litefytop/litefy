"use client";

import { ClassNameValue, cn } from "@/lib";
import { ReactNode } from "react";

const paginationClass = {
  base: "flex items-center justify-between px-4 py-3",
  info: "text-sm text-muted-foreground",
  controls: "flex items-center gap-4",
};

const buttonClass = {
  base: `cursor-pointer outline-none inline-flex items-center justify-center shrink-0 user-select-none
    focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0`,
  variant: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-white hover:bg-destructive/75 dark:bg-destructive/60",
    outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
    secondary: "bg-secondary text-secondary-foreground",
    ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
    link: "text-primary underline-offset-4 hover:underline",
    text: "text-foreground hover:text-foreground/80",
  },
  direction: {
    horizontal: "h-9 min-w-9 px-3 py-1 has-[>svg]:px-2 gap-1 rounded-md",
    vertical: "flex-col gap-2",
  },
};

const selectClass = "appearance-none bg-background w-full h-9 px-3 py-1 text-sm rounded-md border border-input shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50";

type PaginationProps = {
  current: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  onChange: (current: number, pageSize: number) => void;
  className?: ClassNameValue;
  formatText?: (total: number, current: number, totalPages: number) => string;
  actions?: ReactNode;
  onRefresh?: () => void;
  icons?: {
    refresh?: ReactNode;
    first?: ReactNode;
    previous?: ReactNode;
    next?: ReactNode;
    last?: ReactNode;
  };
} & Omit<React.ComponentProps<"div">, "onChange">;

export function Pagination({
  current,
  pageSize,
  total,
  pageSizeOptions = [10, 20, 50, 100],
  onChange,
  className,
  formatText,
  actions,
  onRefresh,
  icons,
  ...props
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    onChange(page, pageSize);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value);
    onChange(1, newPageSize);
  };

  const paginationText = formatText
    ? formatText(total, current, totalPages)
    : `共 ${total} 条记录，第 ${Math.min(total, current)} / ${totalPages} 页`;

  return (
    <div className={cn(paginationClass.base, className)} {...props}>
      <span className={paginationClass.info}>{paginationText}</span>
      <span className={paginationClass.controls}>
        <select
          className={cn(selectClass, "w-28")}
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}条/页
            </option>
          ))}
        </select>
        {actions}
        {onRefresh && (
          <button
            type="button"
            title="刷新"
            onClick={onRefresh}
            className={cn(buttonClass.base, buttonClass.variant.ghost)}
          >
            {icons?.refresh ?? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          disabled={current === 1}
          className={cn(buttonClass.base, buttonClass.variant.outline, buttonClass.direction.horizontal)}
        >
          {icons?.first ?? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M3 19V5" />
              <path d="m13 6-6 6 6 6" />
              <path d="M7 12h14" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
          className={cn(buttonClass.base, buttonClass.variant.outline, buttonClass.direction.horizontal)}
        >
          {icons?.previous ?? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages}
          className={cn(buttonClass.base, buttonClass.variant.outline, buttonClass.direction.horizontal)}
        >
          {icons?.next ?? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          disabled={current === totalPages}
          className={cn(buttonClass.base, buttonClass.variant.outline, buttonClass.direction.horizontal)}
        >
          {icons?.last ?? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M17 12H3" />
              <path d="m11 18 6-6-6-6" />
              <path d="M21 5v14" />
            </svg>
          )}
        </button>
      </span>
    </div>
  );
}
