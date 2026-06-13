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

const drawerClass = {
  left: "left-0 top-0 h-full w-md",
  right: "right-0 top-0 h-full w-md",
  top: "left-0 top-0 w-full h-112",
  bottom: "left-0 bottom-0 w-full h-112",
};

export type DrawerProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function Drawer({
  ref,
  className,
  placement = "right",
  children,
  open: controlledOpen,
  onOpenChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}: DrawerProps & { ref?: React.Ref<HTMLDivElement> }) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const drawerRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  const setRefs = (element: HTMLDivElement | null) => {
    drawerRef.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  const getFocusableElements = React.useCallback(() => {
    if (!drawerRef.current) return [];
    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ];
    return Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(
        focusableSelectors.join(","),
      ),
    ).filter((el) => el.offsetParent !== null);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || !drawerRef.current?.contains(active as Node)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !drawerRef.current?.contains(active as Node)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  React.useEffect(() => {
    if (open) {
      lockScroll();
      previousFocusRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          drawerRef.current?.focus();
        }
      }, 0);
      return () => {
        clearTimeout(timer);
        unlockScroll();
      };
    }
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open, getFocusableElements]);

  React.useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, isControlled, onOpenChange]);

  const handleBackdropClick = () => {
    if (!isControlled) setInternalOpen(false);
    onOpenChange?.(false);
  };
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  if (!open) return null;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="fixed inset-0 z-50"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-muted/50" />
      <div
        {...props}
        ref={setRefs}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        tabIndex={-1}
        onClick={handleContentClick}
        onKeyDown={handleKeyDown}
        className={cn(
          drawerClass[placement],
          "fixed bg-background p-6 overflow-auto focus:outline-none",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export { Drawer };
