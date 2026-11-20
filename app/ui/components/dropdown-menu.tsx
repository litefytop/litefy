"use client";
import * as React from "react";
import { Menu, type MenuConfig, type MenuItemConfig } from "./menu";
import { Popover } from "./popover";
export interface DropdownMenuProps extends Omit<React.ComponentProps<"button">, "children" | "className" | "style" | "type" | "onSelect"> {
    trigger: React.ReactNode;
    items: MenuConfig[];
    onSelect?: (item: MenuItemConfig) => void;
    alignX?: "start" | "end" | "center";
    className?: string;
    itemClassName?: string;
    classNames?: {
        content?: string;
        item?: string;
        label?: string;
        sub?: string;
        menuRoot?: string;
        chevron?: string;
    };
}
export function DropdownMenu({ trigger, items, onSelect, alignX = "center", className, itemClassName, classNames, ...props }: DropdownMenuProps) {
    const [open, setOpen] = React.useState(false);
    return (<Popover {...props} open={open} onOpenChange={setOpen} alignX={alignX} trigger={trigger} classNames={{
            trigger: className,
            content: classNames?.content,
        }}>
      <Menu autoFocus={open} items={items} itemClassName={itemClassName} onSelect={(item) => {
            onSelect?.(item);
            setOpen(false);
        }} onEscape={() => setOpen(false)} classNames={{ root: classNames?.menuRoot, item: classNames?.item, label: classNames?.label, sub: classNames?.sub, chevron: classNames?.chevron }}/>
    </Popover>);
}
