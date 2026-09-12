"use client";

import { useState, type ReactNode } from "react";
import { ContextMenu, ContextMenuHost, type MenuConfig } from "@/ui";

const items: MenuConfig[] = [
  {
    group: "Canvas",
    items: [{ label: "Copy" }, { label: "Paste" }, { label: "Duplicate" }],
  },
  {
    group: "View",
    items: [{ label: "Zoom In" }, { label: "Zoom Out" }, { label: "Reset View" }],
  },
];

export default function ContextMenuBasicDemo() {
  const [selected, setSelected] = useState<ReactNode>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <ContextMenuHost />
      <div
        className="flex h-64 w-full max-w-md select-none items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
        onContextMenu={(e) => {
          e.preventDefault();
          ContextMenu.open({
            x: e.clientX,
            y: e.clientY,
            items,
            onSelect: (item) => setSelected(item.label),
          });
        }}
      >
        Right-click anywhere in this area
      </div>
      <p className="text-sm text-muted-foreground">Selected: {selected ?? "-"}</p>
    </div>
  );
}
