
import { ClassNameValue, cn } from "@/lib";
import { Button, ButtonProps } from "@/component";

import { useState, useEffect } from "react";

let isOpen = true;
const listeners = new Set<() => void>();

function toggle() {
  isOpen = !isOpen;
  listeners.forEach((fn) => fn());
}

function useSidebarStore() {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    const update = () => setOpen(isOpen);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return {
    open,
    toggle,
  };
}

export type SidebarProps = Omit<React.ComponentProps<"aside">, "className"> & {
  className?: ClassNameValue;
};

function Sidebar({ children, className, ...props }: SidebarProps) {
  const { open } = useSidebarStore();
  return (
    <aside
      {...props}
      className={cn(className, !open && "w-0 overflow-hidden")}
    >
      {children}
    </aside>
  );
}




export function SidebarTrigger({ onClick,children, ...props }: ButtonProps) {
  const { toggle } = useSidebarStore();

  return (
    <Button
      onClick={(
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent> &
          React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => {
        onClick?.(event);
        toggle();
      }}
      {...props}
    >
      {children}
    </Button>
  );
}


Sidebar.Trigger = SidebarTrigger;

export { Sidebar };
