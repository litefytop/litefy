"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export type DrawerProps = Omit<React.ComponentProps<"dialog">, "open" | "onClose"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotProps?: {
    content?: HTMLAttrs<Omit<React.ComponentProps<"div">, "style">>;
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

const sizeClassesMap = {
  left: "w-1/4 h-full",
  right: "w-1/4 h-full",
  top: "h-1/3 w-full items-center",
  bottom: "h-1/3 w-full items-center",
};

function Drawer({
  className,
  placement = "right",
  open,
  onOpenChange,
  children,
  slotProps,
  ...props
}: DrawerProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    const content = contentRef.current;
    if (!dialog || !content) return;

    if (open) {
      dialog.showModal();
      requestAnimationFrame(() => {
        content.dataset.state = "open";
      });
    } else {
      content.dataset.state = "closing";
    }
  }, [open]);

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "transform" && content.dataset.state === "closing") {
        const dialog = dialogRef.current;
        if (dialog?.open) {
          dialog.close();
          content.dataset.state = "closed";
          onOpenChange(false);
        }
      }
    };

    content.addEventListener("transitionend", onTransitionEnd);
    return () => content.removeEventListener("transitionend", onTransitionEnd);
  }, [onOpenChange]);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
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
  };

  const setRefs = (element: HTMLDialogElement | null) => {
    dialogRef.current = element;
  };

  const transform = open ? "translate(0, 0)" : transformMap[placement];
  const sizeClasses = sizeClassesMap[placement];

  return (
    <dialog
      ref={setRefs}
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      className={cn("bg-transparent backdrop:bg-muted/50", className)}
      {...props}
    >
      <div
        ref={contentRef}
        data-state={open ? "open" : "closed"}
        {...slotProps?.content}
        className={cn(
          "fixed bg-background shadow-lg transition-transform duration-300 ease-out p-4 flex flex-col",
          placementStyles[placement],
          sizeClasses,
          slotProps?.content?.className,
        )}
        style={{ transform }}
      >
        {children}
      </div>
    </dialog>
  );
}

export { Drawer };
