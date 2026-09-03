"use client";

import { useVirtualScroll } from "@/ui";

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
        <button
          type="button"
          onClick={() => virtual.scrollToIndex(250, "center")}
          className="px-3 py-1.5 text-sm border rounded hover:bg-primary-accent"
        >
          Jump to 250
        </button>
        <button
          type="button"
          onClick={virtual.scrollToTop}
          className="px-3 py-1.5 text-sm border rounded hover:bg-primary-accent"
        >
          Top
        </button>
        <button
          type="button"
          onClick={virtual.scrollToBottom}
          className="px-3 py-1.5 text-sm border rounded hover:bg-primary-accent"
        >
          Bottom
        </button>
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
