"use client";
import { useImperativeHandle, useState } from "react";
export type SidebarHandle = {
    toggle: () => void;
    open: () => void;
    close: () => void;
    isOpen: boolean;
};
export type SidebarProps = Omit<React.ComponentProps<"aside">, "className" | "ref" | "open"> & {
    className?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    ref?: React.Ref<SidebarHandle>;
};
function Sidebar({ ref, children, className, open: openProp, defaultOpen = true, onOpenChange, ...props }: SidebarProps) {
    const [internal, setInternal] = useState(defaultOpen);
    const open = openProp !== undefined ? openProp : internal;
    const setOpen = (next: boolean) => {
        if (openProp === undefined)
            setInternal(next);
        onOpenChange?.(next);
    };
    useImperativeHandle(ref, () => ({
        toggle: () => setOpen(!open),
        open: () => setOpen(true),
        close: () => setOpen(false),
        isOpen: open,
    }));
    return (<aside {...props} data-open={open ? "true" : "false"} className={className}>
      {children}
    </aside>);
}
export { Sidebar };
