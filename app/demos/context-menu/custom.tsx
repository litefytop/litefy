"use client";

import { useState, type ReactNode } from "react";
import { ContextMenu, ContextMenuHost, type MenuConfig } from "@/ui";

const items: MenuConfig[] = [
  { label: "Duplicate" },
  { label: "Archive" },
  { group: "Danger", items: [{ label: "Delete" }] },
];

export default function ContextMenuCustomDemo() {
  const [selected, setSelected] = useState<ReactNode>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <ContextMenuHost />
      <div
        className="flex h-64 w-full max-w-md select-none items-center justify-center rounded-md border border-dashed border-primary/50 bg-primary/5 text-sm text-muted-foreground"
        onContextMenu={(e) => {
          e.preventDefault();
          ContextMenu.open({
            x: e.clientX,
            y: e.clientY,
            items,
            onSelect: (item) => setSelected(item.label),
            classNames: { content: "w-56 border-primary/30" },
          });
        }}
      >
        Right-click to open a custom-styled menu
      </div>
      <p className="text-sm text-muted-foreground">Selected: {selected ?? "-"}</p>
    </div>
  );
}
