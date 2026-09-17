"use client";

import { Button, useVirtualScroll } from "@/ui";

const ROWS = Array.from({ length: 500 }, (_, i) => `Row ${i + 1}`);

export default function VirtualScrollBasicDemo() {
  const virtual = useVirtualScroll({
    itemCount: ROWS.length,
    itemHeight: 40,
    visibleCount: 8,
  });

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => virtual.scrollToIndex(250, "center")}>
          Jump to 250
        </Button>
        <Button variant="outline" onClick={virtual.scrollToTop}>
          Top
        </Button>
        <Button variant="outline" onClick={virtual.scrollToBottom}>
          Bottom
        </Button>
      </div>
      <div
        {...virtual.containerProps}
        className="w-full max-w-sm overflow-auto rounded-md border"
      >
        <div className="relative" style={{ height: virtual.totalHeight }}>
          {virtual.visibleItems.map(({ index, top }) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 40,
                transform: `translateY(${top}px)`,
              }}
              className="flex items-center px-4 text-sm border-b"
            >
              {ROWS[index]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
