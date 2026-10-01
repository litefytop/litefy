"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Menu, type MenuConfig, type MenuItemConfig } from "./menu";
import { PopoverContent } from "./popover";
export interface ContextMenuOpenOptions {
    x: number;
    y: number;
    items: MenuConfig[];
    onSelect?: (item: MenuItemConfig) => void;
    classNames?: {
        content?: ClassNameValue;
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
export function ContextMenuHost() {
    const menu = React.useSyncExternalStore(subscribe, snapshot, () => null);
    if (menu === null)
        return null;
    const { options } = menu;
    return (<PopoverContent open={menu.open} onOpenChange={(next) => {
            if (!next)
                ContextMenu.dismiss();
        }} onContextMenu={(e) => e.preventDefault()} anchorPoint={{ x: options.x, y: options.y }} className={cn("w-48", options.classNames?.content)} style={options.styles?.content}>
        <Menu autoFocus={menu.open} items={options.items} onSelect={(item) => {
            options.onSelect?.(item);
            ContextMenu.dismiss();
        }} onEscape={() => ContextMenu.dismiss()}/>
      </PopoverContent>);
}
