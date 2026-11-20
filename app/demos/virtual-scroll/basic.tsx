"use client";

import { useVirtualScroll } from "@/ui";
import { Button } from "@/ui/skins";

const ROWS = Array.from({ length: 500 }, (_, i) => `Row ${i + 1}`);

export default function VirtualScrollBasicDemo() {
  const virtual = useVirtualScroll({
    itemCount: ROWS.length,
    itemHeight: 40,
    visibleCount: 8,
  });

  return (
    <div className="flex flex-col gap-3 mx-auto">
      <div className="flex flex-wrap gap-3">
        <Button data-variant="outline" onClick={() => virtual.scrollToIndex(250, "center")}>
          Jump to 250
        </Button>
        <Button data-variant="outline" onClick={virtual.scrollToTop}>
          Top
        </Button>
        <Button data-variant="outline" onClick={virtual.scrollToBottom}>
          Bottom
        </Button>
      </div>
      <div
        {...virtual.containerProps}
      >
        <ul style={{ height: virtual.totalHeight }}>
          {virtual.visibleItems.map(({ index, top }) => (
            <li
              key={index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 40,
                transform: `translateY(${top}px)`,
              }}
            >
              {ROWS[index]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
