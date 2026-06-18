"use client";

import * as React from "react";
import { useId } from "react";
import { type ClassNameValue, cn } from "@/lib";

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
function useSupportsAnchor() {
  const [supported, setSupported] = React.useState(false);
  React.useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports("anchor-name", "--test")) {
      setSupported(true);
    }
  }, []);
  return supported;
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
  const supportsAnchor = useSupportsAnchor();

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
      style={supportsAnchor ? { anchorName } : undefined}
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
  const [manualPosition, setManualPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const supportsAnchor = useSupportsAnchor();

  const calculatePosition = React.useCallback(() => {
    const trigger = document.getElementById(triggerId);
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 4;

    let top = 0;
    let left = 0;

    switch (alignY) {
      case "start":
        top = triggerRect.top - menuRect.height - gap;
        break;
      case "center":
        top = triggerRect.top + (triggerRect.height - menuRect.height) / 2;
        break;
      case "end":
        top = triggerRect.bottom + gap;
        break;
    }

    switch (alignX) {
      case "start":
        left = triggerRect.left - menuRect.width - gap;
        break;
      case "center":
        left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
        break;
      case "end":
        left = triggerRect.right + gap;
        break;
    }

    if (top + menuRect.height > viewportHeight) {
      top = viewportHeight - menuRect.height - gap;
    }
    if (top < gap) top = gap;

    if (left + menuRect.width > viewportWidth) {
      left = viewportWidth - menuRect.width - gap;
    }
    if (left < gap) left = gap;

    setManualPosition({ top, left });
  }, [triggerId, alignX, alignY]);

  React.useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const handleToggle = (e: Event) => {
      const open = (e as ToggleEvent).newState === "open";
      if (open && !supportsAnchor) {
        calculatePosition();
      }
    };

    menu.addEventListener("toggle", handleToggle);
    return () => menu.removeEventListener("toggle", handleToggle);
  }, [supportsAnchor, calculatePosition]);

  React.useEffect(() => {
    if (!supportsAnchor) {
      let rafId: number | null = null;
      const handleUpdate = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (menuRef.current?.matches(":popover-open")) {
            calculatePosition();
          }
          rafId = null;
        });
      };
      window.addEventListener("resize", handleUpdate);
      window.addEventListener("scroll", handleUpdate);
      return () => {
        window.removeEventListener("resize", handleUpdate);
        window.removeEventListener("scroll", handleUpdate);
      };
    }
  }, [supportsAnchor, calculatePosition]);

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

      const currentIndex = focusable.indexOf(
        document.activeElement as HTMLElement,
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

  const getStyle = () => {
    if (supportsAnchor) {
      return {
        positionAnchor: anchorName,
        positionArea: `${alignY} ${alignX}`,
      };
    }
    if (manualPosition) {
      return {
        position: "fixed" as const,
        top: manualPosition.top,
        left: manualPosition.left,
        margin: 0,
      };
    }
    return {};
  };

  return (
    <menu
      ref={menuRef}
      id={menuId}
      aria-labelledby={triggerId}
      popover={popover}
      className={cn(
        "bg-popover text-popover-foreground min-w-32 rounded-md border p-1 shadow-md list-none m-1",
        className,
      )}
      style={getStyle()}
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
