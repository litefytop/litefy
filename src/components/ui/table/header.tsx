import * as React from "react";

import { cn, ClassNameValue } from "@/lib";

const tableHeaderclass = "[&_tr]:border-b sticky top-0  bg-muted z-10";

export type TableHeaderProps = {
  className?: ClassNameValue;

} &Omit< React.ComponentProps<"thead">,"className">;

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(TableHeader.class, className)}
      {...props}
    />
  );
}

TableHeader.class = tableHeaderclass;
