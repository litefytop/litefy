import { Table as TableHeadless } from "@/ui";
import type { TableProps } from "@/ui";
import { cn, mergeSlots } from "../utils/cn";
import { checkboxPartClasses } from "./checkbox";


const rootClasses =
  "@container w-full min-w-0 overflow-x-auto overflow-y-hidden " +
  "border-frame border-border bg-surface-raised text-surface-raised-fg shadow-surface";

const headClasses = "overflow-hidden";

const bodyClasses =
  "min-h-50 max-h-64 overflow-y-auto overflow-x-clip";

const baseClasses = "m-0 w-full border-collapse text-sm leading-5 tabular-nums";

const headRowClasses =
  "border-b-hair border-border bg-surface text-surface-fg";

const headCellBaseClasses =
  "h-control border-0 px-3 text-left text-sm/5 control-label";
const headCellAlignClasses =
  "data-[align=right]:text-right data-[align=center]:text-center";
const headCellSortClasses =
  "data-sortable:cursor-pointer data-sortable:select-none " +
  "data-sortable:hover:bg-accent data-sortable:hover:text-accent-fg " +
  "data-drag-over:bg-accent data-drag-over:text-accent-fg";

const headCellClasses = cn(headCellBaseClasses, headCellAlignClasses, headCellSortClasses);

const headLabelClasses = "inline-flex min-w-0 max-w-full items-center gap-x-1 data-[align=right]:flex-row-reverse";

const sortIconClasses = "shrink-0 size-3.5 text-inherit";

const dragHandleClasses =
  "shrink-0 cursor-pointer border-0 bg-transparent p-0 text-inherit opacity-60 " +
  "motion-frame hover:opacity-100 data-[grabbed]:opacity-100 " +
  "focus-visible:focus-ring [&_svg]:size-3.5";

const rowClasses =
  "group/table border-b-hair border-border last:border-b-0 text-foreground hover:bg-accent hover:text-accent-fg " +
  "data-[selectable]:cursor-pointer " +
  "data-[zebra=odd]:bg-surface data-[zebra=odd]:text-surface-fg " +
  "hover:data-[zebra=odd]:bg-accent hover:data-[zebra=odd]:text-accent-fg";

const cellClasses =
  "h-control border-0 px-3 text-left align-middle break-words " +
  "data-[align=right]:text-right data-[align=center]:text-center";

const cellCollapseBaseClasses =
  "block w-full truncate cursor-pointer border-0 bg-transparent p-0 font-inherit leading-[inherit] text-inherit " +
  "[text-align:inherit] focus-visible:focus-ring motion-frame";
const cellCollapseExpandedClasses =
  "data-[expanded]:cursor-default data-[expanded]:whitespace-normal data-[expanded]:break-words";

const cellCollapseClasses = cn(cellCollapseBaseClasses, cellCollapseExpandedClasses);

const emptyClasses = "border-0 px-3 py-6 text-center text-foreground";

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
