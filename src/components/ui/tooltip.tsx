"use client";

import * as React from "react";
import { cn } from "@/lib";

const tooltipContentClass = {
  base: "bg-popover text-foreground rounded-md px-3 py-1.5 text-xs z-50",
  position: {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  },
};

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltip() {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip components must be used within Tooltip");
  }
  return context;
}

export function Tooltip({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      {children}
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useTooltip();
  const id = React.useId();

  return (
    <button
      type="button"
      className={cn(className)}
      {...{ popoverTarget: id } as React.ButtonHTMLAttributes<HTMLButtonElement>}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TooltipContent({
  children,
  className,
  side = "top",
}: React.HTMLAttributes<HTMLDivElement> & {
  side?: "top" | "bottom" | "left" | "right";
}) {
  const { open, setOpen } = useTooltip();
  const id = React.useId();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      id={id}
      {...{ popover: "manual" } as React.HTMLAttributes<HTMLDivElement>}
      className={cn(
        tooltipContentClass.base,
        tooltipContentClass.position[side],
        !open && "hidden",
        className
      )}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      {children}
    </div>
  );
}
