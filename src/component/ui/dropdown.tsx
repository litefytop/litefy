"use client";

import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";

const DropdownContext = React.createContext<string | null>(null);

function useDropdown() {
  const context = React.useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within Dropdown");
  }
  return context;
}

export function Dropdown({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  className?: ClassNameValue;
}) {
  const contentId = React.useId();
  return (
    <DropdownContext.Provider value={contentId}>
      <div className={cn("inline-flex", className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function DropdownTrigger({
  children,
  className,
  target: externalTarget,
  ...props
}: React.ComponentProps<"button"> & {
  target?: string;
}) {
  const contextContentId = useDropdown();
  const contentId = externalTarget || contextContentId;
  const anchorName = `--anchor-${contentId}`;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const content = document.getElementById(contentId) as HTMLElement & { matches?: (s: string) => boolean };
    if (!content) return;
    const handleToggle = (e: Event) => {
      const popoverOpen = (e as ToggleEvent).newState === "open";
      setOpen(popoverOpen);
    };
    content.addEventListener("toggle", handleToggle);
    return () => content.removeEventListener("toggle", handleToggle);
  }, [contentId]);

  return (
    <button
      popoverTarget={contentId}
      popoverTargetAction="toggle"
      aria-haspopup="menu"
      aria-expanded={open}
      type="button"
      className={cn(
        "cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 h-9 min-w-9 px-3 py-1 has-[>svg]:px-2 gap-1 rounded-full",
        className
      )}
      style={{ anchorName } as React.CSSProperties}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownContent({
  children,
  className,
  alignX = "center",
  alignY = "end",
  popover = "auto",
  id: externalId,
  ...props
}: React.ComponentProps<"menu"> & {
  alignX?: "start" | "center" | "end";
  alignY?: "start" | "center" | "end";
  popover?: "auto" | "manual" | "hint";
  id?: string;
}) {
  const contextContentId = useDropdown();
  const contentId = externalId || contextContentId;
  const anchorName = `--anchor-${contentId}`;
  const menuRef = React.useRef<HTMLMenuElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const trigger = document.querySelector(`[popoverTarget="${contentId}"]`) as HTMLElement;
    if (trigger) triggerRef.current = trigger;
  }, [contentId]);

  React.useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Home" || e.key === "End") {
        e.preventDefault();
        const items = menu.querySelectorAll<HTMLButtonElement>("li button:not([disabled])");
        if (items.length === 0) return;

        const currentIndex = Array.from(items).findIndex((item) => item === document.activeElement);
        let nextIndex: number;
        switch (e.key) {
          case "ArrowDown":
            nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
            break;
          case "ArrowUp":
            nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
            break;
          case "Home":
            nextIndex = 0;
            break;
          case "End":
            nextIndex = items.length - 1;
            break;
          default:
            return;
        }
        items[nextIndex]?.focus();
      } else if (e.key === "Escape") {
        const trigger = triggerRef.current;
        if (trigger) {
          e.preventDefault();
          trigger.focus();
        }
      }
    };

    const handleToggle = (e: Event) => {
      const popoverOpen = (e as ToggleEvent).newState === "open";
      if (popoverOpen) {
        const items = menu.querySelectorAll<HTMLButtonElement>("li button:not([disabled])");
        requestAnimationFrame(() => items[0]?.focus());
      } else {
        const trigger = triggerRef.current;
        if (trigger) trigger.focus();
      }
    };

    menu.addEventListener("keydown", handleKeyDown);
    menu.addEventListener("toggle", handleToggle);

    return () => {
      menu.removeEventListener("keydown", handleKeyDown);
      menu.removeEventListener("toggle", handleToggle);
    };
  }, [contentId]);

  return (
    <menu
      ref={menuRef}
      id={contentId}
      popover={popover}
      className={cn(
        "bg-popover text-popover-foreground min-w-32 rounded-md border p-1 shadow-md list-none m-0",
        className
      )}
      style={
        {
          positionAnchor: anchorName,
          positionArea: `${alignY} ${alignX}`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </menu>
  );
}

function DropdownItem({
  children,
  className,
  disabled = false,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <li className="m-0 p-0" role="none">
      <button
        type="button"
        role="menuitem"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "w-full text-start px-2 py-1.5 text-sm rounded-sm cursor-pointer",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </li>
  );
}

function DropdownSeparator({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <li className="m-0" role="separator">
      <hr {...props} className={cn("my-1 h-px bg-muted", className)} />
    </li>
  );
}

function DropdownLabel({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li className={cn("m-0 px-2 py-1.5 text-sm font-semibold", className)} role="presentation" {...props}>
      {children}
    </li>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
Dropdown.Separator = DropdownSeparator;
Dropdown.Label = DropdownLabel;

