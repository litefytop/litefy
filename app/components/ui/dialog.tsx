"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

let originalBodyPosition = "";
let originalBodyTop = "";
let originalBodyWidth = "";
let originalBodyOverflow = "";
let originalBodyPaddingRight = "";
let scrollBarWidth = 0;
let savedScrollY = 0;

const getScrollBarWidth = () => {
  if (typeof window === "undefined") return 0;
  if (scrollBarWidth !== 0) return scrollBarWidth;
  const scrollDiv = document.createElement("div");
  scrollDiv.style.cssText =
    "width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;";
  document.body.appendChild(scrollDiv);
  scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollBarWidth;
};

const getLockCount = (): number => {
  if (typeof window === "undefined") return 0;
  const value = document.body.getAttribute("data-scroll-lock-count");
  if (value === null) return 0;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const setLockCount = (count: number) => {
  if (typeof window === "undefined") return;
  document.body.setAttribute("data-scroll-lock-count", String(count));
};

const lockScroll = () => {
  if (typeof window === "undefined") return;
  const count = getLockCount();
  if (count === 0) {
    const { body } = document;
    savedScrollY = window.scrollY;

    originalBodyPosition = body.style.position;
    originalBodyTop = body.style.top;
    originalBodyWidth = body.style.width;
    originalBodyOverflow = body.style.overflow;
    originalBodyPaddingRight = body.style.paddingRight;

    const barWidth = getScrollBarWidth();
    if (barWidth > 0) {
      const currentPaddingRight = window.getComputedStyle(body).paddingRight;
      const currentPaddingValue = parseFloat(currentPaddingRight) || 0;
      body.style.paddingRight = `${currentPaddingValue + barWidth}px`;
    }

    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
  }
  setLockCount(count + 1);
};

const unlockScroll = () => {
  if (typeof window === "undefined") return;
  const count = getLockCount();
  if (count === 1) {
    const { body } = document;
    body.style.position = originalBodyPosition;
    body.style.top = originalBodyTop;
    body.style.width = originalBodyWidth;
    body.style.overflow = originalBodyOverflow;
    body.style.paddingRight = originalBodyPaddingRight;
    window.scrollTo(0, savedScrollY);
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
        "relative m-auto rounded-lg border bg-background p-6 shadow-lg text-foreground",
        "backdrop:bg-muted/50",
        className,
      )}
      style={{ overscrollBehavior: "contain" }}
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
