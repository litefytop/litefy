"use client";

import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";
import { useId } from "react";

const DropdownContext = React.createContext<{
  menuId?: string;
  triggerId?: string;
  setMenuId?: (id: string) => void;
  setTriggerId?: (id: string) => void;
} | null>(null);

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
  const id = useId();
  const [menuId, setMenuId] = React.useState(`menu-${id}`);
  const [triggerId, setTriggerId] = React.useState(`trigger-${id}`);

  return (
    <DropdownContext.Provider
      value={{ menuId, triggerId, setMenuId, setTriggerId }}
    >
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function DropdownTrigger({
  children,
  className,
  id,
  onToggle,
  ...props
}: Omit<React.ComponentProps<"button">, "className"> & {
  className?: ClassNameValue;
}) {
  const { menuId, triggerId, setTriggerId } = useDropdown();
  React.useEffect(() => {
    if (id) {
      setTriggerId?.(id);
    }
  }, [id, setTriggerId]);
  const anchorName = `--anchor-${triggerId}`;
const handleToggle = (e: React.ToggleEvent<HTMLButtonElement>) => {
  onToggle?.(e);
  const el = e.target as HTMLButtonElement;
  el.setAttribute("aria-expanded", el.getAttribute("aria-expanded") === "true" ? "false" : "true");
};
  return (
    <button
      {...props}
      id={triggerId}
      popoverTarget={menuId}
      popoverTargetAction="toggle"
      aria-haspopup="menu"
      type="button"
      className={cn(
        "cursor-pointer outline-none inline-flex items-center justify-center shrink-0 select-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 h-9 min-w-9 px-3 py-1 has-[>svg]:px-2 gap-1 rounded-full",
        className,
      )}
      style={{ anchorName } as React.CSSProperties}
      onToggle={handleToggle}
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
  id,
  ...props
}: React.ComponentProps<"menu"> & {
  alignX?: "start" | "center" | "end";
  alignY?: "start" | "center" | "end";
  popover?: "auto" | "manual" | "hint";
  id?: string;
}) {
  const { menuId, triggerId, setMenuId } = useDropdown();
  const anchorName = `--anchor-${triggerId}`;
  const menuRef = React.useRef<HTMLMenuElement>(null);

  React.useEffect(() => {
    if (id) {
      setMenuId?.(id);
    }
  }, [id, setMenuId]);

  React.useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const getFocusable = () => {
      return Array.from(
        menu.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusable = getFocusable();
      if (focusable.length === 0) {
        if (e.key === "Tab" || e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
        }
        return;
      }

      const currentIndex = focusable.findIndex(
        (el) => el === document.activeElement,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < 0) first.focus();
          else focusable[(currentIndex + 1) % focusable.length]?.focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex < 0) last.focus();
          else
            focusable[
              (currentIndex - 1 + focusable.length) % focusable.length
            ]?.focus();
          break;
        case "Home":
          e.preventDefault();
          first.focus();
          break;
        case "End":
          e.preventDefault();
          last.focus();
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            if (currentIndex <= 0) last.focus();
            else focusable[currentIndex - 1]?.focus();
          } else {
            if (currentIndex === focusable.length - 1 || currentIndex < 0)
              first.focus();
            else focusable[currentIndex + 1]?.focus();
          }
          break;
   
  
      }
    };

    const handleToggle = (e: Event) => {
      const popoverOpen = (e as ToggleEvent).newState === "open";
      if (popoverOpen) {
        const focusable = getFocusable();
        requestAnimationFrame(() => focusable[0]?.focus());
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
      id={menuId}
      aria-labelledby={triggerId}
      popover={popover}
      className={cn(
        "bg-popover text-popover-foreground min-w-32 rounded-md border p-1 shadow-md list-none m-0",
        className,
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

  ...props
}: React.ComponentProps<"button">) {
  const { menuId } = useDropdown();
  return (
    <li className="m-0 p-0" role="none">
      <button
        type="button"
        role="menuitem"
        popoverTargetAction="hide"
        popoverTarget={menuId}
        className={cn(
          "inline-flex gap-1 w-full text-start px-2 py-1.5 text-sm rounded-sm cursor-pointer",
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

function DropdownSeparator({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <li className="m-0">
      <hr {...props} className={cn("my-1 h-px bg-muted", className)} />
    </li>
  );
}

function DropdownLabel({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("m-0 px-2 py-1.5 text-sm font-semibold", className)}
      role="presentation"
      {...props}
    >
      {children}
    </li>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;
Dropdown.Separator = DropdownSeparator;
Dropdown.Label = DropdownLabel;
