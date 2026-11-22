import { Pagination as PaginationHeadless } from "@/ui";
import type { PaginationProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { buttonVariants } from "./button";


const controlsClasses = "hidden @md:flex items-center gap-x-2";

const compactClasses = "flex @md:hidden flex-col";

const compactSummaryClasses = "block w-full min-w-0 truncate text-sm leading-5 font-field text-surface-fg";

const compactRowClasses = "flex items-center gap-x-2";

const compactInputClasses =
  "w-11 shrink-0 rounded-sm border-hair border-border bg-surface px-1 py-1 text-center text-sm leading-5 tabular-nums text-foreground shadow-frame focus-visible:focus-ring";

const compactTextClasses = "whitespace-nowrap text-sm leading-5 tabular-nums text-surface-fg";


const navClasses =
  cn(buttonVariants.text, "w-control text-sm [&>svg]:size-4 [&>svg]:flex-none");

const pagesClasses = "flex items-center gap-x-2";


const pageClasses =
  cn(
    buttonVariants.text,
    "w-control px-0 text-sm tabular-nums",
    "aria-[current=page]:text-primary aria-[current=page]:font-strong aria-[current=page]:underline",
  );


const ellipsisClasses =
  "inline-flex size-control min-w-control items-center justify-center text-surface-fg [&>svg]:size-4";


const summaryClasses =
  "hidden @md:inline min-w-0 grow truncate text-sm leading-5 font-field text-surface-fg";

export function Pagination({ className, classNames, summary, ...props }: PaginationProps) {
  const hasSummary = summary !== null && summary !== undefined;
  return (
    <PaginationHeadless
      {...props}
      summary={summary}
      className={cn("@container flex items-center", hasSummary ? "gap-x-3" : "gap-x-2", className)}
      classNames={mergeSlots(
        {
          controls: controlsClasses,
          nav: navClasses,
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
