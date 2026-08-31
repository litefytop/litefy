"use client";

import { useImperativeHandle, useState } from "react";
import { type ClassNameValue, cn } from "@/lib";

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

  return (
    <aside
      {...props}
      data-close={!open ? true : undefined}
      className={cn(
        className,
        "bg-sidebar min-h-0 h-full overflow-hidden transition-[width,padding,margin] duration-300 ease-in-out data-close:w-0 data-close:p-0 data-close:m-0",
      )}
    >
      {children}
    </aside>
  );
}

export { Sidebar };
