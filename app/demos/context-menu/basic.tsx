"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, PopoverContent, type MenuConfig } from "@/ui";

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

export default function ContextMenuDemo() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<ReactNode | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (open) {
      panel.showPopover();
    } else {
      panel.hidePopover();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, close]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex h-64 w-full max-w-md select-none items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
        onContextMenu={(e) => {
          e.preventDefault();
          setPosition({ x: e.clientX, y: e.clientY });
          setOpen(true);
        }}
      >
        Right-click anywhere in this area
      </div>
      <div
        aria-hidden
        className="fixed size-0"
        style={{ left: position.x, top: position.y, anchorName: "--context-menu-anchor" }}
      />
      <PopoverContent
        ref={panelRef}
        className="w-48"
        onContextMenu={(e) => e.preventDefault()}
        style={{
          positionAnchor: "--context-menu-anchor",
          positionArea: "bottom right",
          justifySelf: "start",
          alignSelf: "start",
          positionTryFallbacks: "flip-block, flip-inline",
          margin: "4px 0 0 4px",
        }}
      >
        <Menu
          autoFocus={open}
          items={items}
          onSelect={(item) => {
            setSelected(item.label);
            close();
          }}
          onEscape={close}
        />
      </PopoverContent>
      <p className="text-sm text-muted-foreground">Selected: {selected ?? "-"}</p>
    </div>
  );
}
