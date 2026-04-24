import * as React from "react";

import { cn, ClassNameValue } from "@/lib";

const tableCellclass =
  "p-2 align-middle text-center w-1  [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]";

export type TableCellProps = {
  className?: ClassNameValue;
  
} & React.ComponentProps<"td">;

export function TableCell({
  className,

  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(TableCell.class, className)}
      title={typeof props.children === "string" ? props.children : ""}
      {...props}
    >
      {props.children}
    </td>
  );
}

TableCell.class = tableCellclass;
