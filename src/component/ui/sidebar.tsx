import { useState, useImperativeHandle, forwardRef } from "react";
import { cn, ClassNameValue } from "@/lib";

export type SidebarHandle = {
  toggle: () => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

export type SidebarProps = Omit<
  React.ComponentProps<"aside">,
  "className" | "ref"
> & {
  className?: ClassNameValue;
  defaultOpen?: boolean;
};

const Sidebar = forwardRef<SidebarHandle, SidebarProps>(function Sidebar(
  { children, className, defaultOpen = true, ...props },
  ref,
) {
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
        "data-close:w-0 data-close:p-0 data-close:m-0 data-close:overflow-hidden",
      )}
    >
      {children}
    </aside>
  );
});

export { Sidebar };
