"use client";
import * as React from "react";
import { PopoverContent, usePopoverTrigger } from "./popover";
import type { FloatingPlacement } from "../utils/floating-position";
type FloatingTocPlacement = "left" | "right";
interface FloatingTocContextValue {
    placement: FloatingTocPlacement;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    triggerProps: ReturnType<typeof usePopoverTrigger>["triggerProps"];
    contentProps: ReturnType<typeof usePopoverTrigger>["contentProps"];
    anchorName: string;
    panelId: string;
    mode: "click" | "hover";
}
const FloatingTocContext = React.createContext<FloatingTocContextValue | null>(null);
function useFloatingTocContext(): FloatingTocContextValue {
    const ctx = React.useContext(FloatingTocContext);
    if (!ctx)
        throw new Error("FloatingToc parts must be used inside <FloatingToc>");
    return ctx;
}
export interface FloatingTocProps {
    placement?: FloatingTocPlacement;
    triggerMode?: "hover" | "press";
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    openDelay?: number;
    closeDelay?: number;
    children?: React.ReactNode;
}
export function FloatingToc({ placement = "right", triggerMode = "hover", open, defaultOpen = false, onOpenChange, openDelay = 200, closeDelay = 300, children }: FloatingTocProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = open !== undefined;
    const innerOpen = isControlled ? open : uncontrolledOpen;
    const handleOpenChange = React.useCallback((next: boolean) => {
        if (!isControlled)
            setUncontrolledOpen(next);
        onOpenChange?.(next);
    }, [isControlled, onOpenChange]);
    const mode = triggerMode === "hover" ? "hover" : "click";
    const { triggerProps, contentProps, anchorName } = usePopoverTrigger({ open: innerOpen, onOpenChange: handleOpenChange, mode, hoverDelayOpen: openDelay, hoverDelayClose: closeDelay });
    const panelId = `floating-toc-${React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "")}`;
    const value = React.useMemo<FloatingTocContextValue>(() => ({ placement, open: innerOpen, onOpenChange: handleOpenChange, triggerProps, contentProps, anchorName, panelId, mode }), [placement, innerOpen, handleOpenChange, triggerProps, contentProps, anchorName, panelId, mode]);
    return <FloatingTocContext.Provider value={value}>{children}</FloatingTocContext.Provider>;
}
export interface FloatingTocTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
    className?: string;
}
export function FloatingTocTrigger({ className, "aria-label": ariaLabel, ...props }: FloatingTocTriggerProps) {
    const { placement, open, triggerProps, panelId } = useFloatingTocContext();
    return (<button type="button" {...props} {...triggerProps} aria-haspopup={undefined} aria-controls={panelId} aria-label={ariaLabel ?? "Table of contents"} data-placement={placement} data-open={open || undefined} className={className}/>);
}
export interface FloatingTocBarProps extends Omit<React.ComponentProps<"span">, "className" | "children"> {
    active?: boolean;
    level?: number;
    className?: string;
}
export function FloatingTocBar({ active = false, level = 1, className, ...props }: FloatingTocBarProps) {
    const { placement } = useFloatingTocContext();
    return (<span {...props} aria-hidden data-active={active || undefined} data-depth={level} data-placement={placement} className={className}/>);
}
export interface FloatingTocContentProps extends Omit<React.ComponentProps<"div">, "className"> {
    placement?: FloatingPlacement;
    className?: string;
}
export function FloatingTocContent({ placement, className, ...props }: FloatingTocContentProps) {
    const { placement: side, open, onOpenChange, contentProps, anchorName, panelId, mode } = useFloatingTocContext();
    // 负 gap 让面板外缘与触发器外缘齐平、完整盖住横条；-32 对应皮肤触发器宽度（p-2 + 最宽横条 w-4）
    const derived: FloatingPlacement = { side: side === "right" ? "left" : "right", align: "center", gap: -32 };
    return (<PopoverContent {...props} {...contentProps} id={panelId} open={open} onOpenChange={onOpenChange} anchorName={anchorName} placement={{ ...derived, ...placement }} autofocus={mode !== "hover"} className={className}/>);
}
export interface FloatingTocItemProps extends Omit<React.ComponentProps<"button">, "className"> {
    active?: boolean;
    level?: number;
    className?: string;
}
export function FloatingTocItem({ active = false, level = 1, onClick, className, ...props }: FloatingTocItemProps) {
    const { onOpenChange } = useFloatingTocContext();
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!e.defaultPrevented)
            onOpenChange(false);
    };
    return (<button type="button" {...props} onClick={handleClick} data-active={active || undefined} data-depth={level} className={className}/>);
}
