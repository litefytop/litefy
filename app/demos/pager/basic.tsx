"use client";

import * as React from "react";
import { Button, Pager } from "@/ui/components";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pages = ["Alpha", "Bravo", "Charlie", "Delta"];

export default function PagerBasicDemo() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="w-full space-y-3">
      <Pager index={index} onChange={setIndex} className="h-48 w-full">
        {pages.map((page) => (
          <div
            key={page}
            className="flex h-full w-full items-center justify-center rounded-lg border bg-muted/40 text-2xl font-semibold"
          >
            {page}
          </div>
        ))}
      </Pager>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          {index + 1} / {pages.length}
        </span>
        <Button
          variant="outline"
          onClick={() => setIndex((i) => Math.min(pages.length - 1, i + 1))}
          disabled={index === pages.length - 1}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
