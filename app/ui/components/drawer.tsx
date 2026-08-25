"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

// ============================================================
// 原子组件
// ============================================================

// ---------- DrawerRoot ----------
export type DrawerRootProps = Omit<React.ComponentProps<"dialog">, "open" | "onClose"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotProps?: {
    drawer?: Omit<React.ComponentProps<"div">, "children">;
  };
};

const placementStyles = {
  left: "left-0 top-0 bottom-0",
  right: "right-0 top-0 bottom-0",
  top: "left-0 right-0 top-0",
  bottom: "left-0 right-0 bottom-0",
};

const transformMap = {
  left: "translateX(-100%)",
  right: "translateX(100%)",
  top: "translateY(-100%)",
  bottom: "translateY(100%)",
};

export function DrawerRoot({
  className,
  placement = "right",
  open,
  onOpenChange,
  children,
  slotProps,
  onClick,
  onCancel,
  onKeyDown,
  ...props
}: DrawerRootProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  const isHorizontal = placement === "left" || placement === "right";

  React.useEffect(() => {
    const dialog = dialogRef.current;
    const drawer = drawerRef.current;
    if (!dialog || !drawer) return;
    if (open) {
      dialog.showModal();
      requestAnimationFrame(() => {
        drawer.style.transform = "translate(0, 0)";
      });
    } else {
      drawer.style.transform = transformMap[placement];
    }
  }, [open, placement]);

  React.useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "transform" && !open) {
        const dialog = dialogRef.current;
        if (dialog?.open) {
          dialog.close();
          onOpenChange(false);
        }
      }
    };
    drawer.addEventListener("transitionend", onTransitionEnd);
    return () => drawer.removeEventListener("transitionend", onTransitionEnd);
  }, [open, onOpenChange]);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
    onClick?.(e);
  };

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    handleClose();
    onCancel?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Tab") {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !dialog.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !dialog.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    onKeyDown?.(e);
  };

  const setRefs = (element: HTMLDialogElement | null) => {
    dialogRef.current = element;
  };

  return (
    <dialog
      ref={setRefs}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      className={cn(className)}
      {...props}
    >
      <div
        ref={drawerRef}
        className={cn(
          "fixed shadow-lg transition-transform duration-300 ease-out flex bg-background",
          isHorizontal ? "flex-row w-1/4 h-full" : "flex-col h-1/3 w-full",
          placementStyles[placement],
          slotProps?.drawer?.className,
        )}
        style={{ transform: open ? "translate(0, 0)" : transformMap[placement] }}
        {...slotProps?.drawer}
      >
        {children}
      </div>
    </dialog>
  );
}

// ---------- DrawerDrag ----------
export type DrawerDragProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
  isHorizontal?: boolean;
  isReverse?: boolean;
};

export function DrawerDrag({
  className,
  isHorizontal = false,
  isReverse = false,
  ...props
}: DrawerDragProps) {
  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-center",
        isHorizontal ? "w-4 h-full" : "h-4 w-full",
        isReverse ? "order-1" : "order-0",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "rounded-full bg-muted-foreground",
          isHorizontal ? "w-1 h-12" : "w-12 h-1",
        )}
      />
    </div>
  );
}

// ---------- DrawerContent ----------
export type DrawerContentProps = React.ComponentProps<"div"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
};

const borderClassMap = {
  left: "border-l-0",
  right: "border-r-0",
  top: "border-t-0",
  bottom: "border-b-0",
};

export function DrawerContent({
  className,
  placement = "right",
  children,
  ...props
}: DrawerContentProps) {
  const isHorizontal = placement === "left" || placement === "right";
  const isReverse = placement === "left" || placement === "top";

  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-auto bg-muted p-4",
        "border border-border",
        borderClassMap[placement],
        isReverse ? "order-0" : "order-1",
        !isHorizontal && "items-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================
// 成品组件
// ============================================================

export type DrawerProps = Omit<React.ComponentProps<"dialog">, "open" | "onClose"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotProps?: {
    drawer?: Omit<React.ComponentProps<"div">, "children">;
  };
};

export function Drawer({
  className,
  placement = "right",
  open,
  onOpenChange,
  children,
  slotProps,
  ...props
}: DrawerProps) {
  const isHorizontal = placement === "left" || placement === "right";
  const isReverse = placement === "left" || placement === "top";

  return (
    <DrawerRoot
      className={className}
      placement={placement}
      open={open}
      onOpenChange={onOpenChange}
      slotProps={slotProps}
      {...props}
    >
      <DrawerDrag isHorizontal={isHorizontal} isReverse={isReverse} />
      <DrawerContent placement={placement}>
        {children}
      </DrawerContent>
    </DrawerRoot>
  );
}
