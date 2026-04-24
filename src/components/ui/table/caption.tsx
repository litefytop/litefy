import * as React from "react";

import { cn, ClassNameValue } from "@/lib";

const tableCaptionclass = "text-muted-foreground mt-4 text-sm";

export type TableCaptionProps = {
  className?: ClassNameValue;

} & React.ComponentProps<"caption">;

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(TableCaption.class, className)}
      {...props}
    />
  );
}

TableCaption.class = tableCaptionclass;
