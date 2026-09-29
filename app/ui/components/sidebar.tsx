"use client";
import { useImperativeHandle, useState } from "react";
import { type ClassNameValue, cn } from "../utils/cn";
export type SidebarHandle = {
    toggle: () => void;
    open: () => void;
    close: () => void;
    isOpen: boolean;
};
export type SidebarProps = Omit<React.ComponentProps<"aside">, "ref"> & {
    className?: ClassNameValue;
    defaultOpen?: boolean;
    ref?: React.Ref<SidebarHandle>;
};
function Sidebar({ ref, children, className, defaultOpen = true, ...props }: SidebarProps) {
    const [open, setOpen] = useState(defaultOpen);
    useImperativeHandle(ref, () => ({
        toggle: () => setOpen((prev) => !prev),
        open: () => setOpen(true),
        close: () => setOpen(false),
        isOpen: open,
    }));
    return (<aside {...props} data-close={!open ? true : undefined} className={cn(className, "h-full overflow-hidden bg-background text-foreground transition-[width,padding,margin] duration-300 ease-in-out data-close:w-0 data-close:px-0 data-close:mx-0")}>
        <div className={cn("h-full overflow-hidden", !open && "min-w-max")}>{children}</div>
    </aside>);
}
export { Sidebar };
