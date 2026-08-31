"use client";

import { useState, useRef, useEffect } from "react";
import { PopoverTrigger, PopoverContent } from "@/ui";

const anchorName = "--popover-custom-demo";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (open) {
      if (!panel.matches(":popover-open")) panel.showPopover();
    } else {
      if (panel.matches(":popover-open")) panel.hidePopover();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <PopoverTrigger
        ref={triggerRef}
        style={{ anchorName }}
        onClick={() => setOpen(!open)}
      >
        Open Custom Popover
      </PopoverTrigger>
      <PopoverContent
        ref={panelRef}
        style={{
          positionAnchor: anchorName,
          positionArea: "bottom span-all",
          justifySelf: "center",
          margin: "4px 0 0",
          positionTryFallbacks: "flip-block, flip-inline",
        }}
      >
        <button
          className="w-full text-left px-2 py-1.5 text-sm font-semibold rounded-sm hover:bg-hover"
          onClick={close}
        >
          Profile
        </button>
        <button
          className="w-full text-left px-2 py-1.5 text-sm font-semibold rounded-sm hover:bg-hover"
          onClick={close}
        >
          Settings
        </button>
        <button
          className="w-full text-left px-2 py-1.5 text-sm font-semibold rounded-sm hover:bg-hover text-destructive"
          onClick={close}
        >
          Logout
        </button>
      </PopoverContent>
    </>
  );
}
