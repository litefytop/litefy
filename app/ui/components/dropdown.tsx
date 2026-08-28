"use client";
import * as React from "react";
import { useId } from "react";
import { type ClassNameValue, cn } from "@/lib";


export interface DropdownTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
}
export function DropdownTrigger({ className, ...props }: DropdownTriggerProps) {
  return (
    <button
      {...props}
      type="button"
      popoverTargetAction="toggle"
      aria-haspopup="menu"
      aria-expanded="false"
      className={cn(className)}
    />
  );
}

export interface DropdownContentProps extends Omit<React.ComponentProps<"menu">, "className"> {
  className?: ClassNameValue;
}
export function DropdownContent({
  children,
  className,
  popover = "auto",
  ...props
}: DropdownContentProps) {
  return (
    <menu popover={popover} className={cn(className)} {...props}>
      {children}
    </menu>
  );
}



export interface DropdownItemProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
}
export function DropdownItem({ children, className, ...props }: DropdownItemProps) {
  return <li className={cn("m-0", className)} {...props}>{children}</li>;
}



export type DropdownItemConfig =
  | ({ itemType: "action", label: string } & Omit<React.ComponentProps<"button">, "children">)
  | ({ itemType: "label", label: string } & Omit<DropdownItemProps, "children">);

export interface DropdownProps extends DropdownContentProps {
  itemClassName?: ClassNameValue;
  alignX?: "start" | "center" | "end";
  items?: DropdownItemConfig[];
  slots?: {
    trigger?: DropdownTriggerProps;
  };
}

export function Dropdown({
  itemClassName,
  alignX = "start",
  items = [],
  slots = {},
  className,
  ...props
}: DropdownProps) {
  const menuRef = React.useRef<HTMLMenuElement>(null);

  const id = useId();
  const menuId = `dropdown-menu-${id}`;
  const triggerId = `dropdown-trigger-${id}`;

  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  const calculatePosition = React.useCallback(() => {
    const trigger = document.getElementById(triggerId);
    const menu = menuRef.current;
    if (!trigger || !menu) return;
    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const gap = 4;
    let top = triggerRect.bottom + gap;
    let left = 0;
    switch (alignX) {
      case "start":
        left = triggerRect.left;
        break;
      case "center":
        left = triggerRect.left + (triggerRect.width - menuRect.width) / 2;
        break;
      case "end":
        left = triggerRect.right - menuRect.width;
        break;
      default:
        left = triggerRect.left;
    }
    if (top + menuRect.height > viewportHeight) {
      top = viewportHeight - menuRect.height - gap;
    }
    if (top < gap) top = gap;
    if (left + menuRect.width > viewportWidth) {
      left = viewportWidth - menuRect.width - gap;
    }
    if (left < gap) left = gap;
    setPosition({ top, left });
  }, [triggerId, alignX]);

  React.useEffect(() => {
    const menu = menuRef.current;
    const trigger = document.getElementById(triggerId);
    if (!menu) return;

    const handleToggle = (e: ToggleEvent) => {
      const open = e.newState === "open";
      if (trigger) trigger.setAttribute("aria-expanded", String(open));
      if (open) {
        calculatePosition();
        const focusable = menu.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        requestAnimationFrame(() => {
          const first = Array.from(focusable).find((el) => el.offsetParent !== null);
          first?.focus();
        });
      }
    };

    menu.addEventListener("toggle", handleToggle);
    return () => menu.removeEventListener("toggle", handleToggle);
  }, [calculatePosition, triggerId]);

  React.useEffect(() => {
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
    window.addEventListener("scroll", handleUpdate, true);
    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate, true);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [calculatePosition]);

  React.useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const getFocusable = () => {
      return Array.from(
        menu.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
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
      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
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
          else focusable[(currentIndex - 1 + focusable.length) % focusable.length]?.focus();
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
            if (currentIndex === focusable.length - 1 || currentIndex < 0) first.focus();
            else focusable[currentIndex + 1]?.focus();
          }
          break;
      }
    };

    menu.addEventListener("keydown", handleKeyDown);
    return () => {
      menu.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <DropdownTrigger {...slots?.trigger} popoverTarget={menuId} id={triggerId} />
      <DropdownContent
        {...props}
        ref={menuRef}
        aria-labelledby={triggerId}
        className={[
          "bg-popover text-popover-foreground min-w-32 rounded-md border p-1 shadow-md list-none m-1",
          className
        ]}
        style={
          position
            ? {
              position: "fixed",
              top: position.top,
              left: position.left,
              margin: 0,
            }
            : undefined
        }
        id={menuId}
      >
        {items.map((item, idx) => {

          if (item.itemType === "action") {

            const { itemType, label, ...buttonProps } = item;
            const key = `${id}-${itemType}-${idx}`;
            return (
              <DropdownItem key={key} className={["not-last:border-b"]}>
                <button
                  type="button"
                  {...buttonProps}
                  className={cn("w-full text-left px-2 py-1.5 text-sm font-semibold", itemClassName, buttonProps.className)}
                >
                  {label}
                </button>
              </DropdownItem>
            );
          }
          const { itemType, label, ...liProps } = item;
          const key = `${id}-${itemType}-${idx}`;
          return (
            <DropdownItem
              key={key}
              {...liProps}
              className={["not-last:border-b px-2 py-1.5 text-sm text-muted-foreground", itemClassName, liProps.className]}
            >
              {label}
            </DropdownItem>
          );
        })}

      </DropdownContent>
    </>
  );
}
