"use client";
import { useState, useRef, useEffect } from "react";
import { DrawerRoot, DrawerWrapper, DrawerDrag, DrawerContent, useDrag } from "@/ui";

export default function Demo() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ baseSize: 0 });

  useEffect(() => {
    const dialog = dialogRef.current;
    const wrapper = wrapperRef.current;
    if (!dialog || !wrapper) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      requestAnimationFrame(() => {
        wrapper.style.transform = "translate(0, 0)";
      });
    } else {
      wrapper.style.transform = "translateY(100%)";
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const wrapper = wrapperRef.current;
    if (!dialog || !wrapper) return;
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "transform" && !open && dialog.open) {
        dialog.close();
      }
    };
    wrapper.addEventListener("transitionend", onTransitionEnd);
    return () => wrapper.removeEventListener("transitionend", onTransitionEnd);
  }, [open]);

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
      el.style.height = `${dragStartRef.current.baseSize - info.dy}px`;
    },
    onDragEnd: () => {
      if (!wrapperRef.current) return;
      wrapperRef.current.style.transitionDuration = "";
    },
  });

  return (
    <div className="flex flex-col gap-4 items-center p-6">
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <DrawerRoot
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <DrawerWrapper
          ref={wrapperRef}
          isHorizontal={false}
          placement="bottom"
          style={{ transform: "translateY(100%)" }}
          className="h-[30vh] min-h-[15vh] max-h-[85vh]"
        >
          <DrawerDrag isHorizontal={false} onPointerDown={drag.handlePointerDown} />
          <DrawerContent className="bg-background">
            <p>Drag handle to shrink / expand panel</p>
            <button className="mt-2" onClick={() => setOpen(false)}>
              Close
            </button>
          </DrawerContent>
        </DrawerWrapper>
      </DrawerRoot>
    </div>
  );
}
