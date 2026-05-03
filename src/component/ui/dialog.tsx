"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib";
import { Button } from "@/component";

const dialogClass = {
  base: "fixed inset-0 z-50 flex items-center justify-center",
  backdrop: "fixed inset-0 -z-10 bg-black/50",
  content:
    "bg-background text-foreground rounded-lg border shadow-lg p-6 w-full max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)] overflow-y-auto",
  closeButton:
    "absolute top-4 right-4 p-1 rounded-md hover:bg-muted cursor-pointer",
};

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return context;
}

export function Dialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  className,
  children,
  showCloseButton = true,
}: React.HTMLAttributes<HTMLDivElement> & {
  showCloseButton?: boolean;
}) {
  const { open, setOpen } = useDialog();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !mounted) return;

    if (open) {
      dialog.showModal();
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
      className={dialogClass.base}
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault();
        setOpen(false);
      }}
    >
      <div className={dialogClass.backdrop} />
      <div className={cn(dialogClass.content, className)}>
        {showCloseButton && (
          <button
            type="button"
            className={dialogClass.closeButton}
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
    document.body,
  );
}

export function DialogTrigger({
  onStateChange,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { open, setOpen } = useDialog();

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
