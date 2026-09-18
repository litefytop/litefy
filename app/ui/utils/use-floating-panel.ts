"use client";
import * as React from "react";

export interface UseFloatingPanelOptions {
  open?: boolean;
  panelRef: React.RefObject<HTMLElement | null>;
  onOpenChange?: (open: boolean) => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
  focusOnOpen?: boolean;
}

export function useFloatingPanel({
  open,
  panelRef,
  onOpenChange,
  anchorRef,
  restoreFocus = false,
  focusOnOpen = false,
}: UseFloatingPanelOptions) {
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (open) {
      panel.showPopover();
      previouslyFocusedRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (focusOnOpen) {
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        (focusables[0] ?? panel).focus();
      }
    } else {
      panel.hidePopover();
      if (restoreFocus) {
        const active = document.activeElement;
        const focusWouldBeLost =
          active === null || active === document.body || panel.contains(active);
        if (focusWouldBeLost) previouslyFocusedRef.current?.focus?.();
      }
      previouslyFocusedRef.current = null;
    }
  }, [open, panelRef, focusOnOpen, restoreFocus]);

  React.useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef?.current?.contains(target)) return;
      onOpenChangeRef.current?.(false);
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open, panelRef, anchorRef]);
}
