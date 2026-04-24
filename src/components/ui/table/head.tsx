import * as React from "react";

import { cn, ClassNameValue } from "@/lib";

const tableHeadclass = "text-foreground h-12 px-2 text-center align-middle font-medium whitespace-nowrap";

export type TableHeadProps = {
  className?: ClassNameValue;

} & React.ComponentProps<"th">;

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(TableHead.class, className)}
      {...props}
    />
  );
}

TableHead.class = tableHeadclass;
