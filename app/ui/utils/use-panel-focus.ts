"use client";
import * as React from "react";

export interface UsePanelFocusOptions {
  open: boolean;
  panelRef: React.RefObject<HTMLElement | null>;
}

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
