import { Pagination as PaginationHeadless } from "@/ui";
import type { PaginationProps } from "@/ui";
import { cn, mergeStateSlots } from "../utils/cn";
import { buttonInlineClasses } from "./button";


const controlsClasses = "hidden @md:flex items-center gap-x-2";

const compactClasses = "flex @md:hidden flex-col";

const compactSummaryClasses = "block w-full min-w-0 truncate text-sm leading-5 font-field text-foreground";

const compactRowClasses = "flex items-center gap-x-2";

const compactInputClasses =
  "w-11 shrink-0 rounded-sm border-hair border-border bg-surface-raised px-1 py-1 text-center text-sm leading-5 tabular-nums text-surface-raised-fg shadow-frame focus-visible:focus-ring";

const compactTextClasses = "whitespace-nowrap text-sm leading-5 tabular-nums text-foreground";


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

const pagesClasses = "flex items-center gap-x-2";


const pageClasses =
  "inline-flex h-control items-center justify-center rounded-pill control-text motion-frame " +
  "cursor-pointer text-foreground px-0 hover:underline underline-offset-4 focus-visible:focus-ring " +
  "w-control text-sm tabular-nums " +
  "[aria-current]:text-primary [aria-current]:font-strong [aria-current]:underline";


const ellipsisClasses =
  "inline-flex size-control min-w-control items-center justify-center text-foreground [&>svg]:size-4";


const summaryClasses =
  "hidden @md:inline min-w-0 grow truncate text-sm leading-5 font-field text-foreground";

export function Pagination({ className, classNames, summary, ...props }: PaginationProps) {
  const hasSummary = summary !== null && summary !== undefined;
  return (
    <PaginationHeadless
      {...props}
      summary={summary}
      className={cn("@container flex w-fit min-w-0 max-w-full items-center", hasSummary ? "gap-x-3" : "gap-x-2", className)}
      classNames={mergeStateSlots(
        {
          controls: controlsClasses,
          nav: ({ disabled }) => disabled ? navDisabledClasses : navClasses,
          pages: pagesClasses,
          page: pageClasses,
          ellipsis: ellipsisClasses,
          summary: summaryClasses,
          compact: compactClasses,
          compactSummary: compactSummaryClasses,
          compactRow: compactRowClasses,
          compactInput: compactInputClasses,
          compactText: compactTextClasses,
        },
        classNames,
      )}
    />
  );
}
