import { useState, useImperativeHandle, useRef } from "react";
import { cn, ClassNameValue } from "@/lib";

export type SidebarHandle = {
  toggle: () => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

export type SidebarProps = React.ComponentProps<"aside"> & {
  className?: ClassNameValue;
  defaultOpen?: boolean;
  controlRef?: React.Ref<SidebarHandle>;
};

function Sidebar({ children, className, defaultOpen = true, controlRef, ...props }: SidebarProps) {
  const [open, setOpen] = useState(defaultOpen);
  const asideRef = useRef<HTMLElement>(null);


  useImperativeHandle(controlRef, () => ({
    toggle: () => setOpen((prev) => !prev),
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: open,
  }));

  return (
    <aside
      {...props}
      ref={asideRef}
      data-close={!open ? true : undefined}
      className={cn(
        className,
        "bg-sidebar min-h-0 h-full data-close:w-0 data-close:p-0 data-close:m-0 data-close:overflow-hidden",
      )}
    >
      {children}
    </aside>
  );
}

export { Sidebar };
