"use client";

import * as React from "react";
import { ClassNameValue, cn } from "@/lib";

const drawerClass = {
  left: "left-0 top-0 h-full w-80",
  right: "right-0 top-0 h-full w-80",
  top: "left-0 top-0 w-full h-80",
  bottom: "left-0 bottom-0 w-full h-80",
};

export type DrawerRef = {
  show: () => void;
  close: () => void;
};

export type DrawerProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
};

const Drawer = React.forwardRef<DrawerRef, DrawerProps>(
  ({ className, placement = "right", children, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
      show: () => setOpen(true),
      close: () => setOpen(false),
    }));

    React.useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    React.useEffect(() => {
      document.body.style.overflow = open ? "hidden" : "";
      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    const handleBackdropClick = () => setOpen(false);
    const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50" onClick={handleBackdropClick}>
        <div className="absolute inset-0 bg-black/50" />
        <div
          {...props}
          data-state="open"
          onClick={handleContentClick}
          className={cn(
            drawerClass[placement],
            "fixed bg-background p-6 overflow-auto",
            className
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);


export { Drawer };
