import * as React from "react";

import { cn, ClassNameValue } from "@/lib";

const tableFooterclass = "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0";

export type TableFooterProps = {
  className?: ClassNameValue;

} & React.ComponentProps<"tfoot">;

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(TableFooter.class, className)}
      {...props}
    />
  );
}

TableFooter.class = tableFooterclass;
