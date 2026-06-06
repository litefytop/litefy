"use client";

import * as React from "react";
import { ClassNameValue, cn } from "@/lib";

export type DialogProps = React.ComponentProps<"dialog"> & {
  className?: ClassNameValue;
  onClose?: () => void;
};

export type DialogRef = {
  showModal: () => void;
  close: () => void;
};

function Dialog({ ref, className, children, onClose, ...props }: DialogProps) {
  const innerRef = React.useRef<HTMLDialogElement>(null);
  const refProp = ref as React.RefObject <DialogRef | null>;

  const focusFirstElement = () => {
    const dialog = innerRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = Array.from(focusable).find(el => el.offsetParent !== null);
    if (first) first.focus();
    else dialog.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const dialog = innerRef.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => el.offsetParent !== null);
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !dialog.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !dialog.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  React.useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog) return;
    const handleClose = () => onClose?.();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  React.useImperativeHandle(refProp, () => ({
    showModal: () => {
      const dialog = innerRef.current;
      if (dialog) {
        dialog.showModal();
        focusFirstElement();
      }
    },
    close: () => {
      innerRef.current?.close();
    },
  }));

  return (
    <dialog
      ref={innerRef}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className={cn(
        "m-auto rounded-lg border bg-background p-6 shadow-lg text-foreground",
        "backdrop:bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </dialog>
  );
}

export { Dialog };
