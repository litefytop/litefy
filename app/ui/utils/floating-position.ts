"use client";
import * as React from "react";
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
    const anchor = panel.ownerDocument.querySelector<HTMLElement>(`[data-anchor-name="${CSS.escape(name)}"]`);
    if (!anchor) return null;
    const rect = anchor.getBoundingClientRect();
    return { rect, point: false };
}
export function positionFloatingPanel(panel: HTMLElement): void {
    const anchored = resolveAnchor(panel);
    if (!anchored) return;
    const { rect, point } = anchored;
    const gap = readFloat(panel.dataset.floatGap, 4);
    const side = point ? "bottom" : readSide(panel.dataset.floatSide, "bottom");
    const align = point ? "start" : readAlign(panel.dataset.floatAlign, "center");
    const matchWidth = !point && panel.dataset.floatMatchWidth === "true";
    const box = panel.getBoundingClientRect();
    let width = box.width;
    let height = box.height;
    if (matchWidth && box.width !== rect.width) {
        panel.style.width = `${rect.width}px`;
        const resized = panel.getBoundingClientRect();
        width = resized.width;
        height = resized.height;
    }
    const vw = panel.ownerDocument.documentElement.clientWidth;
    const vh = panel.ownerDocument.documentElement.clientHeight;
    let left: number;
    let top: number;
    if (point) {
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
            left = clampPos(left, vw, width);
            top = clampPos(alignPos(rect.top, rect.height, height, align), vh, height);
        }
    }
    panel.style.position = "fixed";
    panel.style.margin = "0";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
}
const ANTI_FLASH_PARK = "-9999px";

export function showFloatingPanel(panel: HTMLElement): void {
    const anchored = panel.dataset.floatAnchor !== undefined || panel.dataset.floatX !== undefined;
    if (anchored) {
        panel.style.left = ANTI_FLASH_PARK;
        panel.style.top = ANTI_FLASH_PARK;
    }
    panel.showPopover();
    if (anchored) positionFloatingPanel(panel);
}
export function useFloatingPosition(panelRef: React.RefObject<HTMLElement | null>, watch?: unknown): void {
    const watchRef = React.useRef(watch);
    React.useEffect(() => {
        watchRef.current = watch;
        const panel = panelRef.current;
        if (!panel) return;
        const win = panel.ownerDocument.defaultView;
        if (!win) return;
        const update = () => positionFloatingPanel(panel);
        let frame = 0;
        const schedule = () => {
            if (frame) return;
            frame = win.requestAnimationFrame(() => {
                frame = 0;
                if (panel.matches(":popover-open")) update();
            });
        };
        const cancel = () => {
            if (frame) {
                win.cancelAnimationFrame(frame);
                frame = 0;
            }
        };
        let tracking = false;
        const startTracking = () => {
            if (tracking) return;
            tracking = true;
            win.addEventListener("scroll", schedule, true);
            win.addEventListener("resize", schedule);
        };
        const stopTracking = () => {
            if (!tracking) return;
            tracking = false;
            win.removeEventListener("scroll", schedule, true);
            win.removeEventListener("resize", schedule);
            cancel();
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
        panel.addEventListener("toggle", handleToggle);
        if (panel.matches(":popover-open")) {
            update();
            startTracking();
        }
        return () => {
            panel.removeEventListener("toggle", handleToggle);
            stopTracking();
        };
    }, [panelRef, watch]);
}
function setRefValue<T>(ref: React.Ref<T> | undefined, value: T | null): void {
    if (typeof ref === "function") ref(value);
    else if (ref) ref.current = value;
}
export function useMergedPanelRef<T extends HTMLElement>(ref: React.Ref<T> | undefined): React.RefObject<T | null> {
    const localRef = React.useRef<T>(null);
    React.useEffect(() => {
        setRefValue(ref, localRef.current);
    });
    return localRef;
}
