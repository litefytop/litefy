"use client";

import { useState, type ReactNode } from "react";
import {
  ContextMenuAnchor,
  ContextMenuContent,
  ContextMenuTrigger,
  Menu,
  type MenuConfig,
} from "@/ui";

const items: MenuConfig[] = [
  { label: "Duplicate" },
  { label: "Archive" },
  { group: "Danger", items: [{ label: "Delete" }] },
];

export default function ContextMenuCustomDemo() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<ReactNode>(null);
  const anchorName = "--context-menu-custom-anchor";

  return (
    <div className="flex flex-col items-center gap-3">
      <ContextMenuTrigger
        className="flex h-64 w-full max-w-md select-none items-center justify-center rounded-md border border-dashed border-primary/50 bg-primary/5 text-sm text-muted-foreground"
        onOpenMenu={(next) => {
          setPosition(next);
          setOpen(true);
        }}
      >
        Right-click to open a custom-assembled menu
      </ContextMenuTrigger>
      <ContextMenuAnchor position={position} anchorName={anchorName} />
      <ContextMenuContent
        open={open}
        onOpenChange={setOpen}
        anchorName={anchorName}
        className="w-56 border-primary/30"
      >
        <Menu
          autoFocus={open}
          items={items}
          onSelect={(item) => {
            setSelected(item.label);
            setOpen(false);
          }}
          onEscape={() => setOpen(false)}
        />
      </ContextMenuContent>
      <p className="text-sm text-muted-foreground">Selected: {selected ?? "-"}</p>
    </div>
  );
}
