"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { useFloatingPanel } from "../utils/use-floating-panel";
import { type FloatingPlacement, useFloatingPosition } from "../utils/floating-position";
type PopoverAlignX = "start" | "end" | "center";
const alignXMap: Record<PopoverAlignX, Required<FloatingPlacement>> = {
    start: {
        side: "left",
        align: "start",
        gap: 4,
        matchWidth: false,
    },
    center: {
        side: "bottom",
        align: "center",
        gap: 4,
        matchWidth: false,
    },
    end: {
        side: "right",
        align: "start",
        gap: 4,
        matchWidth: false,
    },
};
export interface PopoverContentProps extends Omit<React.ComponentProps<"div">, "className"> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    alignX?: PopoverAlignX;
    /** Name of the anchor element (matching its `data-anchor-name`) for the built-in JS positioning. */
    anchorName?: string;
    /** Viewport point anchor (e.g. mouse coordinates); takes precedence over `anchorName`. */
    anchorPoint?: {
        x: number;
        y: number;
    };
    /** Overrides the placement derived from `alignX`. */
    placement?: FloatingPlacement;
    autofocus?: boolean;
    className?: ClassNameValue;
    style?: React.CSSProperties;
}
export function PopoverContent({ open, onOpenChange, alignX = "center", anchorName, anchorPoint, placement, autofocus = true, className, style, onKeyDown: onKeyDownProp, children, ref, ...props }: PopoverContentProps) {
    const panelRef = React.useRef<HTMLDivElement>(null);
    const handleOpenChange = React.useCallback((next: boolean) => {
        onOpenChange?.(next);
    }, [onOpenChange]);
    useFloatingPanel({
        open,
        panelRef,
        onOpenChange: handleOpenChange,
        restoreFocus: autofocus,
        focusOnOpen: autofocus,
    });
    const merged = { ...alignXMap[alignX], ...placement };
    useFloatingPosition(panelRef, `${anchorName ?? ""}|${anchorPoint?.x ?? ""},${anchorPoint?.y ?? ""}|${merged.side}|${merged.align}|${merged.gap}|${merged.matchWidth}`);
    const handleContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDownProp?.(e);
        if (!e.defaultPrevented && e.key === "Escape") {
            handleOpenChange(false);
        }
    };
    const setRefs = (element: HTMLDivElement | null) => {
        panelRef.current = element;
        if (typeof ref === "function") {
            ref(element);
        }
        else if (ref) {
            ref.current = element;
        }
    };
    return (<div ref={setRefs} {...props} popover="manual" tabIndex={-1} onKeyDown={handleContentKeyDown} data-slot="popover-content" data-float-anchor={anchorName} data-float-x={anchorPoint?.x} data-float-y={anchorPoint?.y} data-float-side={merged.side} data-float-align={merged.align} data-float-gap={merged.gap} data-float-match-width={merged.matchWidth || undefined} className={cn(className)} style={style}>
      {children}
    </div>);
}
export type PopoverHasPopup = "menu" | "dialog" | "listbox" | "grid" | "tree";
export type UsePopoverTriggerOptions = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    mode?: "click" | "hover";
    hoverDelayOpen?: number;
    hoverDelayClose?: number;
    hasPopup?: PopoverHasPopup;
};
export function usePopoverTrigger({ open, onOpenChange, mode = "click", hoverDelayOpen = 0, hoverDelayClose = 200, hasPopup = "menu", }: UsePopoverTriggerOptions) {
    const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const anchorName = `--popover-trigger-${id}`;
    const timerRef = React.useRef<number | null>(null);
    const clearTimer = React.useCallback(() => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);
    const scheduleOpen = React.useCallback(() => {
        clearTimer();
        if (hoverDelayOpen > 0) {
            timerRef.current = window.setTimeout(() => onOpenChange(true), hoverDelayOpen);
        }
        else {
            onOpenChange(true);
        }
    }, [clearTimer, hoverDelayOpen, onOpenChange]);
    const scheduleClose = React.useCallback(() => {
        clearTimer();
        timerRef.current = window.setTimeout(() => onOpenChange(false), hoverDelayClose);
    }, [clearTimer, hoverDelayClose, onOpenChange]);
    const triggerProps = React.useMemo(() => {
        return {
            "aria-haspopup": hasPopup,
            "aria-expanded": open,
            "data-anchor-name": anchorName,
            onClick: (e: React.MouseEvent) => {
                if (mode === "hover")
                    return;
                e.preventDefault();
                onOpenChange(!open);
            },
            onMouseEnter: () => {
                if (mode === "click")
                    return;
                clearTimer();
                scheduleOpen();
            },
            onMouseLeave: () => {
                if (mode === "click")
                    return;
                clearTimer();
                scheduleClose();
            },
            onFocus: () => {
                if (mode === "click")
                    return;
                clearTimer();
                onOpenChange(true);
            },
            onKeyDown: (e: React.KeyboardEvent) => {
                if (mode === "hover")
                    return;
                if (e.key === "ArrowDown" || e.key === " ") {
                    e.preventDefault();
                    onOpenChange(true);
                }
            },
        };
    }, [open, onOpenChange, mode, clearTimer, scheduleOpen, scheduleClose, hasPopup]);
    const contentProps = React.useMemo(() => {
        return {
            onMouseEnter: () => {
                if (mode === "click")
                    return;
                clearTimer();
            },
            onMouseLeave: () => {
                if (mode === "click")
                    return;
                clearTimer();
                scheduleClose();
            },
        };
    }, [clearTimer, scheduleClose, mode]);
    React.useEffect(() => {
        if (!open)
            clearTimer();
        return () => clearTimer();
    }, [open, clearTimer]);
    return { triggerProps, contentProps, clearTimer, scheduleClose, scheduleOpen, anchorName };
}
export interface PopoverProps extends Omit<React.ComponentProps<"button">, "className" | "style" | "children" | "type"> {
    trigger: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    alignX?: PopoverAlignX;
    /** Overrides the placement derived from `alignX` (built-in JS positioning). */
    placement?: FloatingPlacement;
    hasPopup?: PopoverHasPopup;
    children: React.ReactNode;
    classNames?: {
        trigger?: ClassNameValue;
        content?: ClassNameValue;
    };
    styles?: {
        trigger?: React.CSSProperties;
        content?: React.CSSProperties;
    };
    mode?: "click" | "hover";
}
export function Popover({ trigger, open, defaultOpen = false, onOpenChange, alignX = "center", placement, hasPopup = "menu", classNames, styles, children, mode = "click", ...props }: PopoverProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = open !== undefined;
    const innerOpen = isControlled ? open : uncontrolledOpen;
    const handleOpenChange = React.useCallback((next: boolean) => {
        if (!isControlled)
            setUncontrolledOpen(next);
        onOpenChange?.(next);
    }, [isControlled, onOpenChange]);
    const { triggerProps, contentProps, anchorName } = usePopoverTrigger({
        open: innerOpen,
        onOpenChange: handleOpenChange,
        mode,
        hasPopup,
    });
    return (<>
      <button {...props} {...triggerProps} type="button" className={cn(classNames?.trigger)} style={styles?.trigger}>
        {trigger}
      </button>
      <PopoverContent {...contentProps} open={innerOpen} onOpenChange={handleOpenChange} alignX={alignX} placement={placement} anchorName={anchorName} autofocus={mode !== "hover"} className={classNames?.content} style={styles?.content}>
        {children}
      </PopoverContent>
    </>);
}
