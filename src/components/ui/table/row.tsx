import * as React from "react";

import { cn, ClassNameValue } from "@/lib";

const tableRowclass = "table-fixed border-b data-[zebra=true]:even:bg-muted data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground";

export type TableRowProps = {
  className?: ClassNameValue;
  area?: string;

} & React.ComponentProps<"tr">;

export function TableRow({ className, children, ...props }: TableRowProps) {
  
  return (
    <tr
      data-slot="table-row"
      className={cn(TableRow.class, className)}
      {...props}
    >
      {children}
    </tr>
  );
}

TableRow.class = tableRowclass;
