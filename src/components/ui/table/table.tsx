"use client";

import * as React from "react";

import { cn, ClassNameValue } from "@/lib";
import { TableHeader } from "./header";
import { TableBody } from "./body";
import { TableFooter } from "./footer";
import { TableRow } from "./row";
import { TableHead } from "./head";
import { TableCell } from "./cell";
import { TableCaption } from "./caption";

const tableclass = "min-w-full caption-top text-sm table-fixed border-collapse";

export type TableProps = Omit<React.ComponentProps<"table">, "className"> & {
  area?: string;
  className?: ClassNameValue;
  zebra?: boolean;
};

export function Table({ className, area, zebra=true, children, ...props }: TableProps) {
  return (
      <table
        data-slot="table"
        data-zebra={ String(zebra)}
        className={cn(tableclass, className)}
        style={{ gridArea: area }}
        {...props}
      >
        {children}
      </table>
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Caption = TableCaption;

Table.class = tableclass;
