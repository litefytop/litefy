"use client";
import * as React from "react";
import { Menu, type MenuClassNames, type MenuConfig, type MenuItemConfig } from "./menu";
import { PopoverContent } from "./popover";
export interface ContextMenuClassNames extends MenuClassNames {
    content?: string;
}
export interface ContextMenuOpenOptions {
    x: number;
    y: number;
    items: MenuConfig[];
    onSelect?: (item: MenuItemConfig) => void;
    classNames?: {
        content?: string;
    };
    styles?: {
        content?: React.CSSProperties;
    };
}
interface ContextMenuState {
    options: ContextMenuOpenOptions;
    open: boolean;
}
let current: ContextMenuState | null = null;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
function snapshot(): ContextMenuState | null {
    return current;
}
function emit() {
    listeners.forEach((listener) => listener());
}
export const ContextMenu = {
    open(options: ContextMenuOpenOptions) {
        current = { options, open: true };
        emit();
    },
    dismiss() {
        if (current === null || !current.open)
            return;
        current = { ...current, open: false };
        emit();
    },
};
const LONG_PRESS_DURATION = 500;
const LONG_PRESS_MOVE_THRESHOLD = 10;
export type ContextMenuTriggerOptions = Omit<ContextMenuOpenOptions, "x" | "y">;
export function useContextMenuTrigger(options: ContextMenuTriggerOptions) {
    const optionsRef = React.useRef(options);
    React.useEffect(() => {
        optionsRef.current = options;
    });
    const press = React.useRef({ pointerId: -1, timer: 0, x: 0, y: 0 });
    React.useEffect(() => {
        const state = press.current;
        return () => {
            window.clearTimeout(state.timer);
            state.pointerId = -1;
        };
    }, []);
    const swallowClick = React.useRef(false);
    const openAt = React.useCallback((x: number, y: number) => {
        ContextMenu.open({ ...optionsRef.current, x, y });
    }, []);
    const cancelPress = React.useCallback(() => {
        window.clearTimeout(press.current.timer);
        press.current.pointerId = -1;
    }, []);
    const onPointerDown = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
        if (event.pointerType !== "touch" || press.current.pointerId !== -1)
            return;
        press.current.pointerId = event.pointerId;
        press.current.x = event.clientX;
        press.current.y = event.clientY;
        press.current.timer = window.setTimeout(() => {
            press.current.pointerId = -1;
            swallowClick.current = true;
            openAt(press.current.x, press.current.y);
            navigator.vibrate?.(10);
        }, LONG_PRESS_DURATION);
    }, [openAt]);
    const onPointerMove = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
        if (event.pointerId !== press.current.pointerId)
            return;
        const dx = event.clientX - press.current.x;
        const dy = event.clientY - press.current.y;
        if (dx * dx + dy * dy > LONG_PRESS_MOVE_THRESHOLD * LONG_PRESS_MOVE_THRESHOLD)
            cancelPress();
    }, [cancelPress]);
    const onPointerEnd = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
        if (event.pointerId === press.current.pointerId)
            cancelPress();
    }, [cancelPress]);
    const onContextMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        openAt(event.clientX, event.clientY);
    }, [openAt]);
    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLElement>) => {
        if (event.shiftKey && event.key === "F10") {
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            openAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }, [openAt]);
    const onClick = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        if (!swallowClick.current)
            return;
        swallowClick.current = false;
        event.preventDefault();
        event.stopPropagation();
    }, []);
    return {
        onContextMenu,
        onPointerDown,
        onPointerMove,
        onPointerUp: onPointerEnd,
        onPointerCancel: onPointerEnd,
        onKeyDown,
        onClick,
        style: {
            WebkitTouchCallout: "none",
            userSelect: "none",
        } as React.CSSProperties,
    };
}
export function ContextMenuHost({ classNames }: {
    classNames?: ContextMenuClassNames;
}) {
    const menu = React.useSyncExternalStore(subscribe, snapshot, () => null);
    if (menu === null)
        return null;
    const { options } = menu;
    const panelClass = [classNames?.content, options.classNames?.content].filter(Boolean).join(" ");
    return (<PopoverContent open={menu.open} onOpenChange={(next) => {
            if (!next)
                ContextMenu.dismiss();
        }} onContextMenu={(e) => e.preventDefault()} anchorPoint={{ x: options.x, y: options.y }} className={panelClass || undefined} style={options.styles?.content}>
        <Menu autoFocus={menu.open} items={options.items} classNames={{ root: classNames?.root, item: classNames?.item, label: classNames?.label, itemButton: classNames?.itemButton, sub: classNames?.sub, chevron: classNames?.chevron }} onSelect={(item) => {
            options.onSelect?.(item);
            ContextMenu.dismiss();
        }} onEscape={() => ContextMenu.dismiss()}/>
      </PopoverContent>);
}
