"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

const getLockCount = (): number => {
  if (typeof window === "undefined") return 0;
  const value = document.documentElement.getAttribute("data-scroll-lock");
  if (value === null) return 0;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const setLockCount = (count: number) => {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-scroll-lock", String(count));
};

let originalHtmlOverflow = "";
let originalHtmlScrollbarGutter = "";

const lockScroll = () => {
  if (typeof window === "undefined") return;
  const count = getLockCount();
  if (count === 0) {
    const html = document.documentElement;
    originalHtmlOverflow = html.style.overflow;
    originalHtmlScrollbarGutter = html.style.scrollbarGutter;

    html.style.scrollbarGutter = "stable";
    html.style.overflow = "hidden";
  }
  setLockCount(count + 1);
};

const unlockScroll = () => {
  if (typeof window === "undefined") return;
  const count = getLockCount();
  if (count === 1) {
    const html = document.documentElement;
    html.style.overflow = originalHtmlOverflow;
    html.style.scrollbarGutter = originalHtmlScrollbarGutter;
  }
  if (count > 0) {
    setLockCount(count - 1);
  }
};

export type DialogControl = {
  showModal: () => void;
  close: () => void;
};

export type DialogProps = React.ComponentProps<"dialog"> & {
  className?: ClassNameValue;
  onClose?: () => void;
  controlRef?: React.Ref<DialogControl>;
  closeTrigger?: boolean;
};

function Dialog({
  ref,
  controlRef,
  className,
  children,
  onClose,
  closeTrigger = true,
  ...props
}: DialogProps) {
  const _ref = React.useRef<HTMLDialogElement>(null);

  const focusFirstElement = () => {
    const dialog = _ref.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = Array.from(focusable).find((el) => el.offsetParent !== null);
    if (first) first.focus();
    else dialog.focus();
  };

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
      if (
        document.activeElement === first ||
        !dialog.contains(document.activeElement)
      ) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (
        document.activeElement === last ||
        !dialog.contains(document.activeElement)
      ) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  React.useEffect(() => {
    const dialog = _ref.current;
    if (!dialog) return;

    const handleClose = () => {
      unlockScroll();
      onClose?.();
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  React.useEffect(() => {
    return () => {
      if (_ref.current?.open) {
        unlockScroll();
      }
    };
  }, []);

  React.useImperativeHandle(controlRef, () => ({
    showModal: () => {
      const dialog = _ref.current;
      if (dialog) {
        lockScroll();
        dialog.showModal();
        focusFirstElement();
      }
    },
    close: () => {
      _ref.current?.close();
    },
  }));

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
      {closeTrigger && (
        <button
          type="button"
          onClick={() => _ref.current?.close()}
          className="absolute right-4 top-4 h-6 w-8 rounded-md border text-xs font-mono font-medium text-muted-foreground transition-colors hover:bg-muted-foreground/20"
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
