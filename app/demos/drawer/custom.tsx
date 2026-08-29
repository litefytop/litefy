"use client";
import { useState, useRef } from "react";
import { DrawerRoot, DrawerDrag, DrawerContent } from "@/ui";
import { useDrag } from "@/ui";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ baseSize: 0 });

  const drag = useDrag({
    disabled: !open,
    onDragStart: () => {
      if (!wrapperRef.current) return;
      dragStartRef.current.baseSize = wrapperRef.current.offsetHeight;
    },
    onDragMove: (info) => {
      const el = wrapperRef.current;
      if (!el) return;
      el.style.transitionDuration = "0ms";
      const nextHeight = dragStartRef.current.baseSize - info.dy;
      el.style.height = `${nextHeight}px`;
    },
    onDragEnd: () => {
      if (!wrapperRef.current) return;
      wrapperRef.current.style.transitionDuration = "";
    },
  });
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    setOpen(false);
  };
  return (
    <div className="flex flex-col gap-4 items-center p-6">
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <DrawerRoot
        placement="bottom"
        open={open}
        onOpenChange={setOpen}
        onClick={handleBackdropClick}
        slots={{
          wrapper: {
            ref: wrapperRef,
            className: "h-[30vh] w-full min-h-[15vh] max-h-[85vh]",
          },
        }}
      >
        <DrawerDrag
          isHorizontal={false}
          onPointerDown={drag.handlePointerDown}
          className="h-4 w-full border-y border-border"
        />
        <DrawerContent className="bg-background p-4">
          <p>Atomic drag‑resize drawer</p>
          <p className="text-sm text-muted-foreground mt-2">Drag handle to shrink / expand panel</p>
        </DrawerContent>
      </DrawerRoot>
    </div>
  );
}
