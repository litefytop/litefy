"use client";
import * as React from "react";
import { showFloatingPanel } from "./floating-position";
export interface UseFloatingPanelOptions {
    open?: boolean;
    panelRef: React.RefObject<HTMLElement | null>;
    onOpenChange?: (open: boolean) => void;
    anchorRef?: React.RefObject<HTMLElement | null>;
    restoreFocus?: boolean;
    focusOnOpen?: boolean;
}
export function useFloatingPanel({ open, panelRef, onOpenChange, anchorRef, restoreFocus = false, focusOnOpen = false, }: UseFloatingPanelOptions) {
    const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
    const onOpenChangeRef = React.useRef(onOpenChange);
    React.useEffect(() => {
        onOpenChangeRef.current = onOpenChange;
    });
    React.useEffect(() => {
        const panel = panelRef.current;
        if (!panel)
            return;
        if (open) {
            showFloatingPanel(panel);
            const doc = panel.ownerDocument;
            previouslyFocusedRef.current =
                doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
            if (focusOnOpen) {
                const focusables = panel.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
                (focusables[0] ?? panel).focus();
            }
        }
        else {
            panel.hidePopover();
            if (restoreFocus) {
                const doc = panel.ownerDocument;
                const active = doc.activeElement;
                const focusWouldBeLost = active === null || active === doc.body || panel.contains(active);
                if (focusWouldBeLost)
                    previouslyFocusedRef.current?.focus?.();
            }
            previouslyFocusedRef.current = null;
        }
    }, [open, panelRef, focusOnOpen, restoreFocus]);
    React.useEffect(() => {
        if (!open)
            return;
        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (panelRef.current?.contains(target))
                return;
            if (anchorRef?.current?.contains(target))
                return;
            const anchorName = panelRef.current?.dataset.floatAnchor;
            const doc = panelRef.current?.ownerDocument ?? document;
            if (anchorName && doc.querySelector(`[data-anchor-name="${anchorName}"]`)?.contains(target))
                return;
            onOpenChangeRef.current?.(false);
        };
        const doc = panelRef.current?.ownerDocument ?? document;
        doc.addEventListener("mousedown", handleMouseDown);
        return () => doc.removeEventListener("mousedown", handleMouseDown);
    }, [open, panelRef, anchorRef]);
}
