"use client";
import * as React from "react";
/**
 * Shared JS floating-panel positioning engine (replacement for CSS Anchor
 * Positioning, which is not a Baseline feature).
 *
 * Data contract (plain DOM attributes, framework-agnostic):
 * - Anchor element: `data-anchor-name="<name>"` (e.g. `--popover-trigger-abc`).
 * - Panel element (`popover="manual"`, fixed-positioned in the top layer):
 *   - `data-float-anchor="<name>"`  — name of the anchor element to track.
 *   - `data-float-x` / `data-float-y` — point anchor (viewport coords);
 *     takes precedence over `data-float-anchor`, for pointer-driven menus.
 *   - `data-float-side`  — "top" | "bottom" | "left" | "right" (default "bottom").
 *   - `data-float-align` — "start" | "center" | "end" along the anchor edge
 *     (default "center"; point anchors always align "start").
 *   - `data-float-gap`   — px gap between anchor and panel (default 4).
 *   - `data-float-match-width="true"` — panel `min-width` follows the anchor
 *     width (element anchors only).
 *
 * Flipping mirrors the old `position-try-fallbacks: flip-block, flip-inline`
 * semantics: when the panel would overflow the viewport on its chosen side it
 * moves to the opposite side (only if it fits there); cross-axis overflow is
 * clamped into the viewport.
 */
export type FloatSide = "top" | "bottom" | "left" | "right";
export type FloatAlign = "start" | "center" | "end";
export interface FloatingPlacement {
    side?: FloatSide;
    align?: FloatAlign;
    gap?: number;
    matchWidth?: boolean;
}
interface AnchorRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}
function readFloat(value: string | undefined, fallback: number): number {
    const parsed = value === undefined ? NaN : Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}
function readSide(value: string | undefined, fallback: FloatSide): FloatSide {
    return value === "top" || value === "bottom" || value === "left" || value === "right" ? value : fallback;
}
function readAlign(value: string | undefined, fallback: FloatAlign): FloatAlign {
    return value === "start" || value === "center" || value === "end" ? value : fallback;
}
function alignPos(start: number, anchorSize: number, panelSize: number, align: FloatAlign): number {
    if (align === "start") return start;
    if (align === "end") return start + anchorSize - panelSize;
    return start + (anchorSize - panelSize) / 2;
}
function clampPos(value: number, viewport: number, size: number): number {
    const max = viewport - size;
    return Math.min(Math.max(value, 0), Math.max(max, 0));
}
function resolveAnchor(panel: HTMLElement): { rect: AnchorRect; point: boolean } | null {
    const rawX = panel.dataset.floatX;
    const rawY = panel.dataset.floatY;
    if (rawX !== undefined && rawY !== undefined) {
        const x = readFloat(rawX, 0);
        const y = readFloat(rawY, 0);
        return { rect: { left: x, top: y, right: x, bottom: y, width: 0, height: 0 }, point: true };
    }
    const name = panel.dataset.floatAnchor;
    if (!name) return null;
    const anchor = document.querySelector<HTMLElement>(`[data-anchor-name="${CSS.escape(name)}"]`);
    if (!anchor) return null;
    const rect = anchor.getBoundingClientRect();
    return { rect, point: false };
}
/** Compute and apply the fixed left/top of an open panel from its data contract. */
export function positionFloatingPanel(panel: HTMLElement): void {
    const anchored = resolveAnchor(panel);
    if (!anchored) return;
    const { rect, point } = anchored;
    const gap = readFloat(panel.dataset.floatGap, 4);
    const side = point ? "bottom" : readSide(panel.dataset.floatSide, "bottom");
    const align = point ? "start" : readAlign(panel.dataset.floatAlign, "center");
    const matchWidth = !point && panel.dataset.floatMatchWidth === "true";
    if (matchWidth) panel.style.minWidth = `${rect.width}px`;
    const box = panel.getBoundingClientRect();
    const width = box.width;
    const height = box.height;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    let left: number;
    let top: number;
    if (point) {
        // Classic context-menu behavior: extend right/down from the pointer,
        // flipping either axis independently on overflow.
        left = rect.left + gap;
        if (left + width > vw && rect.left - gap - width >= 0) left = rect.left - gap - width;
        top = rect.top + gap;
        if (top + height > vh && rect.top - gap - height >= 0) top = rect.top - gap - height;
    }
    else {
        let resolved: FloatSide = side;
        if (resolved === "bottom" && rect.bottom + gap + height > vh && rect.top - gap - height >= 0) resolved = "top";
        else if (resolved === "top" && rect.top - gap - height < 0 && rect.bottom + gap + height <= vh) resolved = "bottom";
        else if (resolved === "right" && rect.right + gap + width > vw && rect.left - gap - width >= 0) resolved = "left";
        else if (resolved === "left" && rect.left - gap - width < 0 && rect.right + gap + width <= vw) resolved = "right";
        if (resolved === "top" || resolved === "bottom") {
            top = resolved === "bottom" ? rect.bottom + gap : rect.top - gap - height;
            left = clampPos(alignPos(rect.left, rect.width, width, align), vw, width);
        }
        else {
            left = resolved === "right" ? rect.right + gap : rect.left - gap - width;
            top = clampPos(alignPos(rect.top, rect.height, height, align), vh, height);
        }
    }
    panel.style.position = "fixed";
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
}
/**
 * Wire a `popover="manual"` panel to the positioning engine: positions it when
 * the popover opens (beforetoggle/toggle), keeps it in sync with scroll and
 * resize while open, and unbinds on close. Changing `watch` (e.g. the anchor
 * name or point) re-positions an already-open panel.
 */
export function useFloatingPosition(panelRef: React.RefObject<HTMLElement | null>, watch?: unknown): void {
    React.useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const update = () => positionFloatingPanel(panel);
        let tracking = false;
        const startTracking = () => {
            if (tracking) return;
            tracking = true;
            window.addEventListener("scroll", update, true);
            window.addEventListener("resize", update);
        };
        const stopTracking = () => {
            if (!tracking) return;
            tracking = false;
            window.removeEventListener("scroll", update, true);
            window.removeEventListener("resize", update);
        };
        const handleBeforeToggle = (event: Event) => {
            if ((event as ToggleEvent).newState === "open") update();
        };
        const handleToggle = (event: Event) => {
            if ((event as ToggleEvent).newState === "open") {
                update();
                startTracking();
            }
            else {
                stopTracking();
            }
        };
        panel.addEventListener("beforetoggle", handleBeforeToggle);
        panel.addEventListener("toggle", handleToggle);
        if (panel.matches(":popover-open")) {
            update();
            startTracking();
        }
        return () => {
            panel.removeEventListener("beforetoggle", handleBeforeToggle);
            panel.removeEventListener("toggle", handleToggle);
            stopTracking();
        };
    }, [panelRef, watch]);
}
/** Merge an internal ref with a consumer `ref` prop (React 19 style). */
export function useMergedPanelRef<T extends HTMLElement>(ref: React.Ref<T> | undefined): React.RefObject<T | null> {
    const localRef = React.useRef<T>(null);
    React.useEffect(() => {
        if (typeof ref === "function") ref(localRef.current);
        else if (ref) ref.current = localRef.current;
    });
    return localRef;
}
