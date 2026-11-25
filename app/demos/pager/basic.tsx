"use client";

import * as React from "react";
import { Pager } from "@/ui/components";
import { Button } from "@/ui/skins";
import { ChevronLeft, ChevronRight } from "@/components/icons";

const pages = ["Alpha", "Bravo", "Charlie", "Delta"];

export default function PagerBasicDemo() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className="flex flex-col gap-3 mx-auto">
      <Pager index={index} onChange={setIndex} loop style={{ height: "12rem" }}>
        {pages.map((page) => (
          <div
            key={page}
            className="flex items-center justify-center border border-border bg-surface text-surface-fg rounded-md"
            style={{ height: "100%" }}
          >
            {page}
          </div>
        ))}
      </Pager>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          data-variant="text"
          onClick={() => setIndex((i) => (i - 1 + pages.length) % pages.length)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <span>
          {index + 1} / {pages.length}
        </span>
        <Button
          data-variant="text"
          onClick={() => setIndex((i) => (i + 1) % pages.length)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
