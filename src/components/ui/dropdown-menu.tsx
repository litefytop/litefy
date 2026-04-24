"use client";

import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu");
  }
  return context;
}

export function DropdownMenu({
  children,
  open,
  onOpenChange,
  className,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: ClassNameValue;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  return (
    <DropdownMenuContext.Provider value={{ open: currentOpen, setOpen }}>
      <div className={cn("relative inline-block", className)}>{children}</div>
    </DropdownMenuContext.Provider>
  );
}

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;

export function DropdownMenuTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const id = React.useId();

  return (
    <button
      type="button"
      className={cn(className)}
      {...{ popoverTarget: id, popoverTargetAction: "toggle" } as React.ButtonHTMLAttributes<HTMLButtonElement>}
      {...props}
    >
      {children}
    </button>
  );
}

const dropdownMenuContentClass = {
  base: "bg-popover text-popover-foreground z-50 min-w-32 rounded-md border p-1 shadow-md",
  align: {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  },
};

export function DropdownMenuContent({
  children,
  className,
  align = "start",
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: "start" | "center" | "end";
}) {
  const { open } = useDropdownMenu();
  const id = React.useId();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open && mounted) {
      const el = document.getElementById(id);
      el?.hidePopover();
    }
  }, [open, mounted, id]);

  if (!mounted) return null;

  return (
    <div
      id={id}
      {...{ popover: "manual" } as React.HTMLAttributes<HTMLDivElement>}
      className={cn(
        dropdownMenuContentClass.base,
        dropdownMenuContentClass.align[align],
        !open && "hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

const dropdownMenuItemClass = "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 hover:bg-accent hover:text-accent-foreground";

export function DropdownMenuItem({
  children,
  className,
  disabled = false,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
}) {
  const { setOpen } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
    setOpen(false);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(dropdownMenuItemClass, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({
  className,
}: {
  className?: ClassNameValue;
}) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
  );
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: ClassNameValue;
}) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </div>
  );
}
