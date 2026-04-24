"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib";
import { Button } from "@/components";

const drawerClass = {
  base: "fixed z-50 flex flex-col shadow-lg",
  direction: {
    left: "left-0 top-0 bottom-0 w-3/4 max-w-sm border-r",
    right: "right-0 top-0 bottom-0 w-3/4 max-w-sm border-l",
    top: "top-0 left-0 right-0 h-[80vh] max-h-[80vh] border-b rounded-b-lg",
    bottom: "bottom-0 left-0 right-0 h-[80vh] max-h-[80vh] border-t rounded-t-lg",
  },
  backdrop: "fixed inset-0 bg-black/50",
  closeButton: "absolute top-4 right-4 p-1 rounded-md hover:bg-muted cursor-pointer",
};

type DrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer components must be used within Drawer");
  }
  return context;
}

export function Drawer({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerContent({
  className,
  children,
  direction = "right",
  showCloseButton = true,
}: React.HTMLAttributes<HTMLDivElement> & {
  direction?: "left" | "right" | "top" | "bottom";
  showCloseButton?: boolean;
}) {
  const { open, setOpen } = useDrawer();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !mounted) return;

    if (open) {
      dialog.show();
    } else {
      dialog.close();
    }
  }, [open, mounted]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setOpen(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className={drawerClass.base}
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault();
        setOpen(false);
      }}
    >
      <div className={drawerClass.backdrop} />
      <div className={cn(drawerClass.direction[direction], "bg-background", className)}>
        {showCloseButton && (
          <button
            type="button"
            className={drawerClass.closeButton}
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </dialog>,
    document.body
  );
}

export function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left px-6 pt-6", className)} {...props} />
  );
}

export function DrawerBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 px-6 py-4", className)} {...props} />
  );
}

export function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 pb-6", className)} {...props} />
  );
}

export function DrawerTrigger({
  onStateChange,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, setOpen } = useDrawer();

  return (
    <Button
      trigger={"click"}
      onStateChange={(boolean) => {
        setOpen(boolean);
        onStateChange?.(boolean);
      }}
      state={open}
      {...props}
    >
      {props.children}
    </Button>
  );
}
