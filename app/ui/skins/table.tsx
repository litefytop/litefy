import { Table as TableHeadless } from "@/ui";
import type { TableProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { checkboxPartClasses } from "./checkbox";


const stripMin = "min-w-[calc(6rem*var(--litefy-cols))]";

const rootClasses =
  "[--litefy-cols:1] @container overflow-x-auto overflow-y-hidden [scrollbar-gutter:stable] " +
  "border-frame border-border bg-background shadow-surface";

const headClasses =
  "overflow-hidden [scrollbar-gutter:stable] " + stripMin;

const bodyClasses =
  "min-h-[12.5rem] max-h-[25rem] overflow-y-auto [scrollbar-gutter:stable] " + stripMin;


const baseClasses = "m-0 w-full border-collapse text-sm leading-5 tabular-nums";

const headRowClasses =
  "border-b-hair border-border bg-surface";

const headCellClasses =
  "h-control border-0 px-3 text-left text-sm font-label tracking-label case-label leading-5 " +
  "data-[align=right]:text-right data-[align=center]:text-center " +
  "data-[sortable]:cursor-pointer data-[sortable]:select-none";

const headLabelClasses = "inline-flex items-center gap-x-1 data-[align=right]:flex-row-reverse";

const sortIconClasses = "size-3.5 text-surface-fg data-[active=true]:text-foreground";

const rowClasses =
  "border-b-hair border-border last:border-b-0 hover:bg-accent";

const cellClasses =
  "border-0 px-3 py-2 text-left align-middle break-words " +
  "data-[align=right]:text-right data-[align=center]:text-center";

const emptyClasses = "border-0 px-3 py-6 text-center text-surface-fg";

const bulkBarClasses =
  "flex min-h-control items-center gap-x-3 px-3";
const bulkCountClasses = "text-sm leading-5 font-strong";
const bulkLabelClasses = "text-sm leading-5 text-surface-fg";
const bulkActionsClasses = "flex items-center gap-x-2";
const bulkClearClasses =
  "ms-auto shrink-0 cursor-pointer border-0 bg-transparent p-0 text-sm leading-5 text-surface-fg underline-offset-2 motion-frame hover:text-foreground hover:underline focus-visible:focus-ring";

export const tableRootClasses = rootClasses;

export const tableClasses = {
  table: baseClasses,
  col: "min-w-[6rem]",
  head: headClasses,
  body: bodyClasses,
  headRow: headRowClasses,
  headCell: headCellClasses,
  headLabel: headLabelClasses,
  sortIcon: sortIconClasses,
  row: rowClasses,
  cell: cellClasses,
  empty: emptyClasses,
  bulkRow: "",
  bulkBar: bulkBarClasses,
  bulkCount: bulkCountClasses,
  bulkLabel: bulkLabelClasses,
  bulkActions: bulkActionsClasses,
  bulkClear: bulkClearClasses,
};

export const tablePartClasses = tableClasses;

export function Table<T extends object>({ className, classNames, ...props }: TableProps<T>) {
  return (
    <TableHeadless
      {...props}
      className={cn(tableRootClasses, className)}
      classNames={{
        ...mergeSlots(tableClasses, classNames),
        checkbox: mergeSlots(checkboxPartClasses, classNames?.checkbox),
      }}
    />
  );
}
