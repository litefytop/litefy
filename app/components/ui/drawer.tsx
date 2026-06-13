"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

const drawerClass = {
  left: "left-0 top-0 h-full w-3xs",
  right: "right-0 top-0 h-full w-3xs",
  top: "left-0 top-0 w-full h-3xs",
  bottom: "left-0 bottom-0 w-full h-3xs",
};

export type DrawerRef = {
  show: () => void;
  close: () => void;
};

export type DrawerProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
  onClose?: () => void;
  onOpen?: () => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

const Drawer = React.forwardRef<DrawerRef, DrawerProps>(
  (
    {
      className,
      placement = "right",
      children,
      onClose,
      onOpen,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const drawerRef = React.useRef<HTMLDivElement>(null);
    const previousFocusRef = React.useRef<HTMLElement | null>(null);

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

    React.useImperativeHandle(ref, () => ({
      show: () => {
        setOpen(true);
        onOpen?.();
      },
      close: () => {
        setOpen(false);
        onClose?.();
      },
    }));

    React.useEffect(() => {
      if (open) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        const timer = setTimeout(() => {
          const focusable = getFocusableElements();
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            drawerRef.current?.focus();
          }
        }, 0);
        return () => clearTimeout(timer);
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }, [open, getFocusableElements]);

    React.useEffect(() => {
      if (!open) return;
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          onClose?.();
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    const handleBackdropClick = () => {
      setOpen(false);
      onClose?.();
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
          ref={drawerRef}
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
  },
);

Drawer.displayName = "Drawer";

export { Drawer };
