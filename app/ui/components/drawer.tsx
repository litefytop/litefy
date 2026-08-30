"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

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

export type DrawerRootProps = Omit<React.ComponentProps<"dialog">, "className"> & {
  className?: ClassNameValue;
};

export function DrawerRoot({ className, ...props }: DrawerRootProps) {
  return <dialog {...props} className={cn(className)} />;
}
export type DrawerWrapperProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
  isHorizontal?: boolean;
  placement: keyof typeof transformMap;
};
export function DrawerWrapper({
  className,
  isHorizontal,
  placement,
  ...props
}: DrawerWrapperProps) {
  return (
    <div
      {...props}
      className={cn(
        "fixed transition-transform duration-300 ease-out flex shadow-lg max-h-full max-w-full min-w-1/4 min-h-1/3",
        isHorizontal ? "w-1/4 h-full" : "h-1/3 w-full",
        placementStyles[placement],
        className,
      )}
    />
  );
}

export type DrawerDragProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
  isHorizontal?: boolean;
};

export function DrawerDrag({ className, isHorizontal, ...props }: DrawerDragProps) {
  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-center border-border bg-muted",
        isHorizontal ? "w-4 h-full border-x" : "h-4 w-full border-y",
        className,
      )}
      {...props}
    >
      <div
        className={cn("rounded-full bg-muted-foreground ", isHorizontal ? "w-1 h-12" : "w-12 h-1")}
      />
    </div>
  );
}

export type DrawerContentProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
  isHorizontal?: boolean;
};

export function DrawerContent({ className, isHorizontal, children, ...props }: DrawerContentProps) {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-auto bg-muted p-4",
        !isHorizontal && "items-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DrawerDragApi {
  isDragging: boolean;
  handlePointerDown: (e: React.PointerEvent<HTMLElement>) => void;
}

export interface DrawerProps extends Omit<DrawerWrapperProps, "classNames" | "styles"> {
  drag?: DrawerDragApi;
  classNames?: {
    root?: ClassNameValue;
    wrapper?: ClassNameValue;
    drag?: ClassNameValue;
    content?: ClassNameValue;
  };
  styles?: {
    root?: React.CSSProperties;
    wrapper?: React.CSSProperties;
    drag?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  onCancel?: (e: React.SyntheticEvent<HTMLDialogElement>) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  onBackdropClick?: (e: React.MouseEvent<HTMLDialogElement>) => void;
}

export function Drawer({
  classNames,
  styles,
  placement = "right",
  open,
  onOpenChange,
  onCancel,
  children,
  drag,
  ref,
  onBackdropClick,
  ...props
}: DrawerProps) {
  const isHorizontal = placement === "left" || placement === "right";
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const openRef = React.useRef(open);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    const wrapper = wrapperRef.current;
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
    const wrapper = wrapperRef.current;
    const dialog = dialogRef.current;
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
  };
  const setRefs = (element: HTMLDivElement | null) => {
    wrapperRef.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };
  return (
    <DrawerRoot
      ref={dialogRef}
      className={classNames?.root}
      style={styles?.root}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onBackdropClick?.(e);
      }}
    >
      <DrawerWrapper
        {...props}
        ref={setRefs}
        isHorizontal={isHorizontal}
        placement={placement}
        className={classNames?.wrapper}
        style={styles?.wrapper}
      >
        <DrawerDrag
          isHorizontal={isHorizontal}
          className={classNames?.drag}
          style={styles?.drag}
          onPointerDown={drag?.handlePointerDown}
        />
        <DrawerContent
          isHorizontal={isHorizontal}
          className={classNames?.content}
          style={styles?.content}
        >
          {children}
        </DrawerContent>
      </DrawerWrapper>
    </DrawerRoot>
  );
}
