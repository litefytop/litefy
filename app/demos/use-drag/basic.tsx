"use client";

import * as React from "react";
import { useDrag } from "@/ui";

export default function UseDragBasicDemo() {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const startRef = React.useRef({ x: 0, y: 0 });

  const drag = useDrag({
    onDragStart: () => {
      startRef.current = offset;
    },
    onDragMove: ({ dx, dy }) => {
      setOffset({ x: startRef.current.x + dx, y: startRef.current.y + dy });
    },
  });

  return (
    <div className="flex h-64 items-center justify-center rounded-lg border bg-muted/30 overflow-hidden">
      <div
        onPointerDown={drag.handlePointerDown}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        className={
          "flex cursor-grab select-none touch-none flex-col items-center justify-center rounded-lg border bg-background px-6 py-4 shadow-md active:cursor-grabbing" +
          (drag.isDragging ? " ring-2 ring-primary" : "")
        }
      >
        <span className="text-sm font-medium">Drag me</span>
        <span className="mt-1 text-xs text-muted-foreground">
          {drag.isDragging ? "Dragging…" : "Pointer down to drag"}
        </span>
      </div>
    </div>
  );
}
