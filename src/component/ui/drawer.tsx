"use client";

import * as React from "react";
import { ClassNameValue, cn } from "@/lib";

const drawerClass = {
  left: "left-0 top-0 h-full w-80 -translate-x-full",
  right: "right-0 top-0 h-full w-80 translate-x-full",
  top: "left-0 top-0 w-full h-80 -translate-y-full",
  bottom: "left-0 bottom-0 w-full h-80 translate-y-full",
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

    const handleBackdropClick = () => {
      setOpen(false);
    };

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50" onClick={handleBackdropClick}>
        <div className="absolute inset-0 bg-black/50" />
        <div
          {...props}
          className={cn(
            "fixed transform transition-transform duration-300 ease-in-out bg-background p-6 overflow-auto translate-x-0 translate-y-0",
            drawerClass[placement],
            className,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);

Drawer.displayName = "Drawer";

export { Drawer };
