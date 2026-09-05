"use client";
import * as React from "react";

export interface UsePanelFocusOptions {
  open: boolean;
  panelRef: React.RefObject<HTMLElement | null>;
}

// Real-focus branch for Picker panels: when the panel is open, ArrowDown
// moves focus into its first focusable element and ArrowUp into its last —
// for panels built from real focusable controls (grids, toolbars, forms).
// The panel itself is the fallback target when nothing inside is focusable.
export function usePanelFocus({ open, panelRef }: UsePanelFocusOptions) {
  return React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const panel = panelRef.current;
      if (!panel) return;
      e.preventDefault();
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const target =
        e.key === "ArrowDown" ? focusables[0] : focusables[focusables.length - 1];
      (target ?? panel).focus();
    },
    [open, panelRef],
  );
}
