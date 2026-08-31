"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export interface PopoverTriggerProps extends HTMLAttrs<React.ComponentProps<"button">> {
  className?: ClassNameValue;
}
export function PopoverTrigger({ className, ...props }: PopoverTriggerProps) {
  return <button {...props} type="button" className={cn(className)} />;
}

export interface PopoverContentProps extends HTMLAttrs<React.ComponentProps<"div">> {
  className?: ClassNameValue;
}
export function PopoverContent({ className, ...props }: PopoverContentProps) {
  return (
    <div
      {...props}
      popover="manual"
      tabIndex={-1}
      className={cn(
        "bg-popover text-popover-foreground min-w-32 max-h-96 overflow-auto rounded-md border p-1 shadow-md",
        className,
      )}
    />
  );
}

type PopoverAlignX = "start" | "end" | "center";

const alignXMap: Record<
  PopoverAlignX,
  { positionArea: string; justifySelf: string; alignSelf: string; margin: string }
> = {
  start: {
    positionArea: "left span-bottom",
    justifySelf: "end",
    alignSelf: "start",
    margin: "0 4px 0 0",
  },
  center: {
    positionArea: "bottom span-all",
    justifySelf: "center",
    alignSelf: "start",
    margin: "4px 0 0",
  },
  end: {
    positionArea: "right span-bottom",
    justifySelf: "start",
    alignSelf: "start",
    margin: "0 0 0 4px",
  },
};

export interface PopoverProps extends Omit<PopoverContentProps, "className" | "style" | "ref"> {
  ref?: React.Ref<HTMLButtonElement>;
  trigger: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  alignX?: PopoverAlignX;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: {
    trigger?: ClassNameValue;
    content?: ClassNameValue;
  };
  styles?: {
    trigger?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}

export function Popover({
  ref,
  trigger,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  alignX = "center",
  className,
  style,
  classNames,
  styles,
  onKeyDown: onKeyDownProp,
  children,
  ...props
}: PopoverProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const anchorName = `--popover-${id}`;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, []);

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (open) {
      panel.showPopover();
    } else {
      panel.hidePopover();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      handleOpenChange(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleOpenChange]);

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDownProp?.(e);
    if (!e.defaultPrevented && e.key === "Escape") {
      handleOpenChange(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <>
      <PopoverTrigger
        ref={triggerRef}
        aria-expanded={open}
        onClick={() => handleOpenChange(!open)}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleOpenChange(false);
        }}
        className={classNames?.trigger}
        style={{ anchorName, ...styles?.trigger }}
      >
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        ref={panelRef}
        {...props}
        onKeyDown={handleContentKeyDown}
        className={cn(className, classNames?.content)}
        style={{
          positionAnchor: anchorName,
          ...alignXMap[alignX],
          positionTryFallbacks: "flip-block, flip-inline",
          ...style,
          ...styles?.content,
        }}
      >
        {children}
      </PopoverContent>
    </>
  );
}
