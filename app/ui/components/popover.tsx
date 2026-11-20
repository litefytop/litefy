"use client";
import * as React from "react";
import { ButtonRoot } from "./button";
import { useFloatingPanel } from "../utils/use-floating-panel";
import { type FloatingPlacement, useFloatingPosition } from "../utils/floating-position";
type PopoverAlignX = "start" | "end" | "center";
const alignXMap: Record<PopoverAlignX, Required<FloatingPlacement>> = {
    start: {
        side: "bottom",
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
        side: "bottom",
        align: "end",
        gap: 4,
        matchWidth: false,
    },
};
export interface PopoverContentProps extends Omit<React.ComponentProps<"div">, "className"> {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    alignX?: PopoverAlignX;
    anchorName?: string;
    anchorPoint?: {
        x: number;
        y: number;
    };
    placement?: FloatingPlacement;
    autofocus?: boolean;
    className?: string;
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
    return (<div ref={setRefs} {...props} popover="manual" role="dialog" tabIndex={-1} onKeyDown={handleContentKeyDown} data-float-anchor={anchorName} data-float-x={anchorPoint?.x} data-float-y={anchorPoint?.y} data-float-side={merged.side} data-float-align={merged.align} data-float-gap={merged.gap} data-float-match-width={merged.matchWidth || undefined} className={className} style={style}>
      {children}
    </div>);
}
export type UsePopoverTriggerOptions = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    mode?: "click" | "hover";
    hoverDelayOpen?: number;
    hoverDelayClose?: number;
};
export function usePopoverTrigger({ open, onOpenChange, mode = "click", hoverDelayOpen = 0, hoverDelayClose = 200 }: UsePopoverTriggerOptions) {
    const id = React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "");
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
            "aria-haspopup": "menu",
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
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    onOpenChange(true);
                }
            },
        };
    }, [open, onOpenChange, mode, clearTimer, scheduleOpen, scheduleClose, anchorName]);
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
    placement?: FloatingPlacement;
    children: React.ReactNode;
    classNames?: {
        trigger?: string;
        content?: string;
    };
    styles?: {
        trigger?: React.CSSProperties;
        content?: React.CSSProperties;
    };
    mode?: "click" | "hover";
    contentKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}
export function Popover({ trigger, open, defaultOpen = false, onOpenChange, alignX = "center", placement, contentKeyDown, "aria-haspopup": ariaHasPopup, classNames, styles, children, mode = "click", ...props }: PopoverProps) {
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
    });
    return (<>
      <ButtonRoot {...props} {...triggerProps} aria-haspopup={ariaHasPopup ?? "menu"} type="button" className={classNames?.trigger} style={styles?.trigger}>
        {trigger}
      </ButtonRoot>
      <PopoverContent {...contentProps} open={innerOpen} onOpenChange={handleOpenChange} alignX={alignX} placement={placement} anchorName={anchorName} autofocus={mode !== "hover"} onKeyDown={contentKeyDown} className={classNames?.content} style={styles?.content}>
        {children}
      </PopoverContent>
    </>);
}
