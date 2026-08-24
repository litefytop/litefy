"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export type DialogProps = React.ComponentProps<"dialog"> & {
  className?: ClassNameValue;
  onClose?: () => void;
  closeTrigger?: React.ReactNode;
};

function Dialog({ ref, className, children, onClose, closeTrigger, ...props }: DialogProps) {
  const _ref = React.useRef<HTMLDialogElement>(null);
  const isOpenRef = React.useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const dialog = _ref.current;
    if (!dialog) return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);
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
    const dialog = _ref.current;
    if (!dialog) return;

    const observer = new MutationObserver(() => {
      const nowOpen = dialog.hasAttribute("open");
      if (!nowOpen && isOpenRef.current) {
        isOpenRef.current = false;
        onClose?.();
      }
    });

    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });

    if (dialog.hasAttribute("open")) {
      isOpenRef.current = true;
    }

    return () => observer.disconnect();
  }, [onClose]);

  const setRefs = (element: HTMLDialogElement | null) => {
    _ref.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  return (
    <dialog
      ref={setRefs}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className={cn(
        "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 m-0",
        "rounded-lg border bg-background p-6 shadow-lg text-foreground",
        "backdrop:bg-muted/50",
        className,
      )}
      {...props}
    >
      {closeTrigger ?? (
        <button
          type="button"
          onClick={() => _ref.current?.close()}
          className={
            "absolute right-4 top-4 h-6 w-8 rounded-md border text-xs font-mono font-medium text-muted-foreground transition-colors hover:bg-muted-foreground/20"
          }
          aria-label="Close (ESC)"
        >
          ESC
        </button>
      )}
      {children}
    </dialog>
  );
}

export { Dialog };
