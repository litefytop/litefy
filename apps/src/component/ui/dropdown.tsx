"use client";

import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";
import { useId } from "react";

type DropdownContextValue = {
  menuId: string;
  triggerId: string;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

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
  const menuId = `dropdown-menu-${id}`;
  const triggerId = `dropdown-trigger-${id}`;

  return (
    <DropdownContext.Provider value={{ menuId, triggerId }}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function DropdownTrigger({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "className"> & {
  className?: ClassNameValue;
}) {
  const { menuId, triggerId } = useDropdown();
  const anchorName = `--anchor-${triggerId}`;

  React.useEffect(() => {
    const menu = document.getElementById(menuId);
    if (!menu) return;
    const handleToggle = (e: Event) => {
      const open = (e as ToggleEvent).newState === "open";
      const trigger = document.getElementById(triggerId);
      if (trigger) trigger.setAttribute("aria-expanded", String(open));
    };
    menu.addEventListener("toggle", handleToggle);
    return () => menu.removeEventListener("toggle", handleToggle);
  }, [menuId, triggerId]);

;

  return (
    <button
      {...props}
      id={triggerId}
      type="button"
      popoverTarget={menuId}
      popoverTargetAction="toggle"
      aria-haspopup="menu"
      aria-expanded="false"
      className={cn(className)}
      style={{ anchorName }}
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
  ...props
}: React.ComponentProps<"menu"> & {
  alignX?: "start" | "center" | "end";
  alignY?: "start" | "center" | "end";
  popover?: "auto" | "manual" | "hint";
}) {
  const { menuId, triggerId } = useDropdown();
  const anchorName = `--anchor-${triggerId}`;
  const menuRef = React.useRef<HTMLMenuElement>(null);

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
      const open = (e as ToggleEvent).newState === "open";
      if (open) {
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
      style={{
        positionAnchor: anchorName,
        positionArea: `${alignY} ${alignX}`,
      }}
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
          "inline-flex gap-3 w-full p-2 text-sm cursor-pointer items-center",
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
