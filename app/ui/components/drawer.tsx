"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export type DrawerWrapperProps = Omit<React.ComponentProps<"div">, "children" | "className"> & {
  className?: ClassNameValue;
};

export type DrawerRootProps = Omit<React.ComponentProps<"dialog">, "open" | "onClose"> & {
  className?: ClassNameValue;
  placement?: "left" | "right" | "top" | "bottom";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slots?: {
    wrapper?: DrawerWrapperProps;
  };
};

const placementStyles = {
  left: "left-0 top-0 bottom-0 flex-row-reverse",
  right: "right-0 top-0 bottom-0 flex-row",
  top: "left-0 right-0 top-0 flex-col-reverse",
  bottom: "left-0 right-0 bottom-0 flex-col",
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
  slots = { wrapper: { ref: null } },

  onCancel,
  onKeyDown,
  ref,
  ...props
}: DrawerRootProps) {
  const _ref = React.useRef<HTMLDialogElement>(null);
  const _wrapperRef = React.useRef<HTMLDivElement>(null);
  const openRef = React.useRef(open);

  React.useEffect(() => {
    const dialog = _ref.current;
    const wrapper = _wrapperRef.current;
    openRef.current = open;
    if (!dialog || !wrapper) return;
    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
      requestAnimationFrame(() => {
        wrapper.style.transform = "translate(0, 0)";
      });
    } else {
      wrapper.style.transform = transformMap[placement];
    }
  }, [open, placement]);

  React.useEffect(() => {
    const wrapper = _wrapperRef.current;
    const dialog = _ref.current;
    if (!wrapper || !dialog) return;
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "transform" && !openRef.current) {
        if (dialog?.open) {
          dialog.close();
        }
      }
    };
    wrapper.addEventListener("transitionend", onTransitionEnd);
    return () => wrapper.removeEventListener("transitionend", onTransitionEnd);
  }, []);

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);


  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    handleClose();
    onCancel?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Tab") {
      const dialog = _ref.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
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

  return (
    <dialog
      ref={(element: HTMLDialogElement | null) => {
        _ref.current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      }}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
      className={cn(className)}
      {...props}
    >
      <div
        {...slots?.wrapper}
        ref={(element: HTMLDivElement | null) => {
          _wrapperRef.current = element;
          if (typeof slots?.wrapper?.ref === "function") {
            slots?.wrapper?.ref(element);
          } else if (slots?.wrapper?.ref) {
            slots.wrapper.ref.current = element;
          }
        }}
        className={cn(
          "fixed transition-transform duration-300 ease-out flex",
          placementStyles[placement],
          slots?.wrapper?.className
        )}
      >
        {children}
      </div>
    </dialog>
  );
}

export type DrawerDragProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
  isHorizontal?: boolean;
};

export function DrawerDrag({ className, isHorizontal, ...props }: DrawerDragProps) {
  return (
    <div className={cn("shrink-0 flex items-center justify-center", className)} {...props}>
      <div
        className={cn("rounded-full bg-muted-foreground", isHorizontal ? "w-1 h-12" : "w-12 h-1")}
      />
    </div>
  );
}

export type DrawerContentProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
};

export function DrawerContent({ className, children, ...props }: DrawerContentProps) {
  return (
    <div className={cn("flex flex-col flex-1 overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}

export interface DrawerDragApi {
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent<HTMLElement>) => void;
}

export interface DrawerProps extends Omit<DrawerRootProps, "slots"> {
  drag?: DrawerDragApi;
  slots?: {
    wrapper?: DrawerWrapperProps;
    drag?: Omit<DrawerDragProps, "children">;
    content?: Omit<DrawerContentProps, "children">;
  };
}

export function Drawer({
  className,
  placement = "right",
  open,
  onOpenChange,
  children,
  slots,
  drag,
  ...props
}: DrawerProps) {
  const isHorizontal = placement === "left" || placement === "right";

  return (
    <DrawerRoot
      {...props}
      className={className}
      placement={placement}
      open={open}
      onOpenChange={onOpenChange}
      slots={{
        wrapper: {
          ...slots?.wrapper,
          className: cn(
            isHorizontal ? "w-1/4 h-full" : "h-1/3 w-full",
            "shadow-lg bg-background",
            slots?.wrapper?.className
          ),
        },
      }}


    >
      <DrawerDrag
        isHorizontal={isHorizontal}
        className={cn(
          isHorizontal ? "w-4 h-full border-x" : "h-4 w-full border-y",
          "border-border",
          slots?.drag?.className
        )}
        {...slots?.drag}
        onPointerDown={drag?.handlePointerDown}
      />
      <DrawerContent className={cn("bg-muted p-4", !isHorizontal && "items-center")} {...slots?.content}>
        {children}
      </DrawerContent>
    </DrawerRoot>
  );
}
