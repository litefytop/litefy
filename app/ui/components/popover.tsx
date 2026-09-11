"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

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
    justifySelf: "anchor-center",
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

export interface PopoverContentProps extends Omit<React.ComponentProps<"div">, "className"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  alignX?: PopoverAlignX;
  autofocus?: boolean;
  className?: ClassNameValue;
  style?: React.CSSProperties;
}

export function PopoverContent({
  open,
  onOpenChange,
  alignX = "center",
  autofocus = true,
  className,
  style,
  onKeyDown: onKeyDownProp,
  children,
  ref,
  ...props
}: PopoverContentProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (open) {
      panel.showPopover();
      if (autofocus) {
        previouslyFocusedRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const focusables = panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        (focusables[0] ?? panel).focus();
      }
    } else {
      panel.hidePopover();
      if (autofocus) {
        const active = document.activeElement;
        const focusWouldBeLost =
          active === null || active === document.body || panel.contains(active);
        if (focusWouldBeLost) previouslyFocusedRef.current?.focus?.();
        previouslyFocusedRef.current = null;
      }
    }
  }, [open, autofocus]);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      handleOpenChange(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleOpenChange]);

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDownProp?.(e);
    if (!e.defaultPrevented && e.key === "Escape") {
      handleOpenChange(false);
    }
  };

  const setRefs = (element: HTMLDivElement | null) => {
    panelRef.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };

  return (
    <div
      ref={setRefs}
      {...props}
      popover="manual"
      tabIndex={-1}
      onKeyDown={handleContentKeyDown}
      className={cn(
        "bg-background text-foreground min-w-32 max-h-96 overflow-auto rounded-lg border p-1 shadow-md",
        className,
      )}
      style={{
        ...alignXMap[alignX],
        positionTryFallbacks: "flip-block, flip-inline",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type UsePopoverTriggerOptions = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode?: "click" | "hover";
  hoverDelayOpen?: number;
  hoverDelayClose?: number;
};

export function usePopoverTrigger({
  open,
  onOpenChange,
  mode = "click",
  hoverDelayOpen = 0,
  hoverDelayClose = 200,
}: UsePopoverTriggerOptions) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const anchorName = `--popover-trigger-${id}`;
  const timerRef = React.useRef<number | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleOpen = React.useCallback(() => {
    clearTimer();
    if (hoverDelayOpen > 0) {
      timerRef.current = window.setTimeout(() => onOpenChange(true), hoverDelayOpen);
    } else {
      onOpenChange(true);
    }
  }, [clearTimer, hoverDelayOpen, onOpenChange]);

  const scheduleClose = React.useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => onOpenChange(false), hoverDelayClose);
  }, [clearTimer, hoverDelayClose, onOpenChange]);

  const triggerProps = React.useMemo(() => {
    return {
      "aria-haspopup": "menu" as const,
      "aria-expanded": open,
      style: {
        anchorName: anchorName,
      },
      onClick: (e: React.MouseEvent) => {
        if (mode === "hover") return;
        e.preventDefault();
        onOpenChange(!open);
      },
      onMouseEnter: () => {
        if (mode === "click") return;
        clearTimer();
        scheduleOpen();
      },
      onMouseLeave: () => {
        if (mode === "click") return;
        clearTimer();
        scheduleClose();
      },
      onFocus: () => {
        if (mode === "click") return;
        clearTimer();
        onOpenChange(true);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (mode === "hover") return;
        if (e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
          onOpenChange(true);
        }
      },
    };
  }, [open, onOpenChange, mode, clearTimer, scheduleOpen, scheduleClose]);
  const contentProps = React.useMemo(() => {
    return {
      onMouseEnter: () => {
        if (mode === "click") return;
        clearTimer();
      },
      onMouseLeave: () => {
        if (mode === "click") return;
        clearTimer();
        scheduleClose();
      },
    };
  }, [clearTimer, scheduleClose, mode]);
  React.useEffect(() => {
    if (!open) clearTimer();
    return () => clearTimer();
  }, [open, clearTimer]);
  return { triggerProps, contentProps, clearTimer, scheduleClose, scheduleOpen, anchorName };
}

export interface PopoverProps {
  trigger: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  alignX?: PopoverAlignX;
  children: React.ReactNode;
  classNames?: {
    trigger?: ClassNameValue;
    content?: ClassNameValue;
  };
  styles?: {
    trigger?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  mode?: "click" | "hover";
}

export function Popover({
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  alignX = "center",
  classNames,
  styles,
  children,
  mode = "click",
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const innerOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const { triggerProps, contentProps, anchorName } = usePopoverTrigger({
    open: innerOpen,
    onOpenChange: handleOpenChange,
    mode,
  });

  return (
    <>
      <button
        {...triggerProps}
        type="button"
        className={cn(classNames?.trigger)}
        style={{ ...triggerProps.style, ...styles?.trigger }}
      >
        {trigger}
      </button>
      <PopoverContent
        {...contentProps}
        open={innerOpen}
        onOpenChange={handleOpenChange}
        alignX={alignX}
        autofocus={mode !== "hover"}
        className={classNames?.content}
        style={{ positionAnchor: anchorName, ...styles?.content }}
      >
        {children}
      </PopoverContent>
    </>
  );
}
