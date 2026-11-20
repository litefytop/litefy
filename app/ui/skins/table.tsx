import { Table as TableHeadless } from "@/ui";
import type { TableProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { checkboxPartClasses } from "./checkbox";


const rootClasses =
  "@container overflow-x-auto overflow-y-hidden " +
  "border-frame border-border bg-background shadow-surface";

const headClasses = "overflow-hidden";

const bodyClasses =
  "min-h-50 max-h-64 overflow-y-auto overflow-x-clip";

const baseClasses = "m-0 w-full border-collapse text-sm leading-5 tabular-nums";

const headRowClasses =
  "border-b-hair border-border bg-surface";

const headCellClasses =
  "h-control border-0 px-3 text-left text-sm font-label tracking-label case-label leading-5 " +
  "data-[align=right]:text-right data-[align=center]:text-center " +
  "data-[sortable]:cursor-pointer data-[sortable]:select-none " +
  "data-[drag-over]:bg-accent";

const headLabelClasses = "inline-flex min-w-0 max-w-full items-center gap-x-1 data-[align=right]:flex-row-reverse";

const sortIconClasses = "shrink-0 size-3.5 text-surface-fg data-[active=true]:text-foreground";

const dragHandleClasses =
  "shrink-0 cursor-pointer border-0 bg-transparent p-0 text-surface-fg " +
  "motion-frame hover:text-foreground data-[grabbed]:text-foreground " +
  "focus-visible:focus-ring [&_svg]:size-3.5";

const rowClasses =
  "border-b-hair border-border last:border-b-0 hover:bg-accent " +
  "data-[selectable]:cursor-pointer " +
  "data-[zebra=odd]:bg-surface hover:data-[zebra=odd]:bg-accent";

const cellClasses =
  "h-control border-0 px-3 text-left align-middle break-words " +
  "data-[align=right]:text-right data-[align=center]:text-center";

const cellCollapseClasses =
  "block w-full truncate cursor-pointer border-0 bg-transparent p-0 font-inherit leading-[inherit] text-inherit [text-align:inherit] focus-visible:focus-ring motion-frame " +
  "data-[expanded]:cursor-default data-[expanded]:whitespace-normal data-[expanded]:break-words";

const emptyClasses = "border-0 px-3 py-6 text-center text-surface-fg";

export const tableRootClasses = rootClasses;

export const tableClasses = {
  table: baseClasses,
  col: "",
  head: headClasses,
  body: bodyClasses,
  headRow: headRowClasses,
  headCell: headCellClasses,
  headLabel: headLabelClasses,
  sortIcon: sortIconClasses,
  dragHandle: dragHandleClasses,
  row: rowClasses,
  cell: cellClasses,
  cellCollapse: cellCollapseClasses,
  empty: emptyClasses,
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
