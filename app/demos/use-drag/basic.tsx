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
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap gap-3"
        onPointerDown={drag.handlePointerDown}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <span>Drag me</span>
        <span>
          {drag.isDragging ? "Dragging…" : "Pointer down to drag"}
        </span>
      </div>
    </div>
  );
}
