"use client";
import { useState, useRef } from "react";
import { useDrag } from "@/ui";
import { Button, Drawer } from "@/ui/skins";

export default function DrawerResizableDemo() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ base: 0, minPx: 0 });
  const handleBackdropClick = () => {
    setOpen(false);
  };
  const drag = useDrag({
    disabled: !open,
    onDragStart: () => {
      const el = wrapperRef.current;
      if (!el) return;
      dragStartRef.current.base = el.offsetHeight;
      const computed = getComputedStyle(el);
      dragStartRef.current.minPx = parseFloat(computed.minHeight) || 80;
    },
    onDragMove(info) {
      const el = wrapperRef.current;
      if (!el) return;
      const nextHeight = dragStartRef.current.base - info.dy;
      el.style.height = `${nextHeight}px`;
    },
    onDragEnd(info) {
      const el = wrapperRef.current;
      if (!el) return;
      const finalHeight = dragStartRef.current.base - info.dy;
      if (finalHeight <= dragStartRef.current.minPx) {
        setOpen(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-3 items-center">
      <Button data-variant="outline" onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer
        ref={wrapperRef}
        open={open}
        onOpenChange={setOpen}
        onBackdropClick={handleBackdropClick}
        placement="bottom"
        drag={drag}
      >
        <div className="flex flex-col gap-3 p-4">
          <h3>Bottom placement</h3>
          <p>Drag upward: expand, capped by max-height</p>
          <p>Drag downward: shrink. Close drawer when calculated size drops below min-height</p>
          <Button data-variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Drawer>
    </div>
  );
}
