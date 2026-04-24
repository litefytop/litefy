import * as React from "react";

import { cn, ClassNameValue } from "@/lib";

const tableBodyclass = "[&_tr:last-child]:border-0";

export type TableBodyProps = {
  className?: ClassNameValue;

} & React.ComponentProps<"tbody">;

export function TableBody({ className, children, ...props }: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(TableBody.class, className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

TableBody.class = tableBodyclass;
