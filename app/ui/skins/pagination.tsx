import { Pagination as PaginationHeadless } from "@/ui";
import type { PaginationProps } from "@/ui";
import { cn, mergeStateSlots } from "../utils/cn";
import { buttonInlineClasses } from "./button";


const controlsClasses = "flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2";

const pagesClasses = "hidden @3xl:flex min-w-0 items-center gap-x-2";

const pageInputClasses =
  "w-11 shrink-0 rounded-sm border-hair border-border bg-surface-raised px-1 py-1 text-center text-sm leading-5 tabular-nums text-surface-raised-fg shadow-frame focus-visible:focus-ring @3xl:hidden";

const pageTotalClasses =
  "shrink-0 whitespace-nowrap text-sm leading-5 tabular-nums text-foreground @3xl:hidden";

const summaryClasses =
  "max-w-full shrink-0 text-sm leading-5 font-field text-foreground";


const navClasses = cn(
  buttonInlineClasses,
  "h-control cursor-pointer text-foreground focus-visible:focus-ring pure-icon w-control text-sm",
  "[&_svg]:flex-none",
);
const navDisabledClasses = cn(
  buttonInlineClasses,
  "h-control cursor-not-allowed text-disabled-fg pure-icon w-control text-sm",
  "[&_svg]:flex-none",
);
const boundaryClasses = cn(navClasses, "@3xl:hidden");
const boundaryDisabledClasses = cn(navDisabledClasses, "@3xl:hidden");


const pageClasses =
  "inline-flex h-control items-center justify-center rounded-pill control-text motion-frame " +
  "cursor-pointer text-foreground px-0 hover:underline underline-offset-4 focus-visible:focus-ring " +
  "w-control text-sm tabular-nums " +
  "[aria-current]:text-primary [aria-current]:font-strong [aria-current]:underline";


const ellipsisClasses =
  "inline-flex size-control min-w-control items-center justify-center text-foreground [&>svg]:size-4";

export function Pagination({ className, classNames, summary, ...props }: PaginationProps) {
  const hasSummary = summary !== null && summary !== undefined;
  return (
    <PaginationHeadless
      {...props}
      summary={summary}
      className={cn(
        "@container flex w-full min-w-0 flex-wrap items-center justify-between gap-y-2",
        hasSummary ? "gap-x-3" : "gap-x-2",
        className,
      )}
      classNames={mergeStateSlots(
        {
          controls: controlsClasses,
          nav: ({ disabled }) => disabled ? navDisabledClasses : navClasses,
          boundary: ({ disabled }) => disabled ? boundaryDisabledClasses : boundaryClasses,
          pages: pagesClasses,
          page: pageClasses,
          ellipsis: ellipsisClasses,
          summary: summaryClasses,
          pageInput: pageInputClasses,
          pageTotal: pageTotalClasses,
        },
        classNames,
      )}
    />
  );
}
