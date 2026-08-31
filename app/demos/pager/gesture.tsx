"use client";

import * as React from "react";
import { Pager } from "@/ui/components";

const pages = ["01", "02", "03", "04", "05"];

export default function PagerGestureDemo() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="w-full space-y-3">
      <Pager index={index} onChange={setIndex} loop className="h-48 w-full">
        {pages.map((page) => (
          <div
            key={page}
            className="flex h-full w-full items-center justify-center rounded-lg border bg-muted/40 text-4xl font-bold tabular-nums"
          >
            {page}
          </div>
        ))}
      </Pager>
      <p className="text-center text-sm text-muted-foreground">
        Touch drag horizontally — loop enabled, current page {index + 1} / {pages.length}
      </p>
    </div>
  );
}
