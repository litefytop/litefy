"use client";

import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";
import { Button, ButtonProps } from "./button";

const DropdownMenuContext = React.createContext<string | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu");
  }
  return context;
}

export function DropdownMenu({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: ClassNameValue;
}) {
  const contentId = React.useId();

  return (
    <DropdownMenuContext.Provider value={contentId}>
      <div className={cn("inline-flex", className)} {...props}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  className,
  target: externalTarget,
  ...props
}: ButtonProps & {
  target?: string;
}) {
  const contextContentId = useDropdownMenu();
  const contentId = externalTarget || contextContentId;
  const anchorName = `--anchor-${contentId}`;

  return (
    <Button
      popoverTarget={contentId}
      popoverTargetAction="toggle"
      aria-haspopup="menu"
      className={className}
      style={{ anchorName } as React.CSSProperties}
      {...props}
    >
      {children}
    </Button>
  );
}export function DropdownMenuContent({
  children,
  className,
  x_axis = "center",
  y_axis = "end",
  popover = "auto",
  id: externalId,
  ...props
}: React.HTMLAttributes<HTMLMenuElement> & {
  x_axis?: "start" | "center" | "end";
  y_axis?: "start" | "center" | "end";
  popover?: "auto" | "manual"|"hint" ;
  id?: string;
}) {
  const contextContentId = useDropdownMenu();
  const contentId = externalId || contextContentId;
  const anchorName = `--anchor-${contentId}`;
  const menuRef = React.useRef<HTMLMenuElement>(null);



  React.useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const items = menu.querySelectorAll<HTMLButtonElement>(
          "li button:not([disabled])",
        );
        if (items.length === 0) return;

        const currentIndex = Array.from(items).findIndex(
          (item) => item === document.activeElement,
        );

        let nextIndex: number;
        if (e.key === "ArrowDown") {
          nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
        } else {
          nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        }

        items[nextIndex]?.focus();
      }
    };

    const handleToggle = () => {

      if (
        menu.matches(":popover-open") ||
        (menu as HTMLMenuElement & { popoverOpen?: boolean }).popoverOpen
      ) {
        const items = menu.querySelectorAll<HTMLButtonElement>(
          "li button:not([disabled])",
        );
        setTimeout(() => items[0]?.focus(), 0);
      }
    };

    menu.addEventListener("keydown", handleKeyDown);
    menu.addEventListener("toggle", handleToggle);

    return () => {
      menu.removeEventListener("keydown", handleKeyDown);
      menu.removeEventListener("toggle", handleToggle);
    };
  }, []);



  return (
    <menu
      ref={menuRef}
      id={contentId}
      popover={popover}
      className={cn(
        "bg-popover text-popover-foreground min-w-32 rounded-md border p-1 shadow-md list-none m-0",
        className,
      )}
      style={
        {
          positionAnchor: anchorName,
          positionArea: `${y_axis} ${x_axis}`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </menu>
  );
}

export function DropdownMenuItem({
  children,
  className,
  disabled = false,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <li className="m-0 p-0">
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "w-full text-start px-2 py-1.5 text-sm rounded-sm cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    </li>
  );
}

export function DropdownMenuSeparator({
  className,
}: {
  className?: ClassNameValue;
}) {
  return (
    <li className="m-0">
      <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
    </li>
  );
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: ClassNameValue;
}) {
  return (
    <li className={cn("m-0 px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </li>
  );
}

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;
