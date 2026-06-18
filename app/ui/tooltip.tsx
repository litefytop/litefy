"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib";

const TRIGGER_SYMBOL = Symbol.for("__TOOLTIP_TRIGGER__");
const CONTENT_SYMBOL = Symbol.for("__TOOLTIP_CONTENT__");

type Side = "top" | "bottom" | "left" | "right";

type TooltipContextValue = {
  triggerId: string;
  contentId: string;
  side: Side;
  delay: number;
  show: () => void;
  scheduleHide: () => void;
  cancelHide: () => void;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

const useTooltip = () => {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip components must be used within Tooltip");
  return ctx;
};

function hasSymbol(type: unknown, sym: symbol): boolean {
  if (typeof type !== "function") return false;
  return Object.getOwnPropertySymbols(type).includes(sym);
}

function useSupportsAnchor() {
  const [supported, setSupported] = React.useState(false);
  React.useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports("anchor-name", "--test")) {
      setSupported(true);
    } else {
      console.warn(
        "Tooltip: CSS anchor positioning is not supported. Falling back to manual positioning.",
      );
    }
  }, []);
  return supported;
}

function findIds(children: React.ReactNode) {
  let triggerId: string | undefined;
  let contentId: string | undefined;

  const search = (node: React.ReactNode) => {
    if (triggerId && contentId) return;
    if (!React.isValidElement(node)) return;
    const element = node as React.ReactElement<{
      id?: string;
      children?: React.ReactNode;
    }>;

    if (hasSymbol(element.type, TRIGGER_SYMBOL)) {
      triggerId = element.props.id;
      return;
    }
    if (hasSymbol(element.type, CONTENT_SYMBOL)) {
      contentId = element.props.id;
      return;
    }

    if (element.props?.children) {
      React.Children.forEach(element.props.children, search);
    }
  };

  React.Children.forEach(children, search);
  return { triggerId, contentId };
}

export type TooltipProps = {
  children: React.ReactNode;
  delay?: number;
  side?: Side;
};

export function Tooltip({ children, delay = 100, side = "top" }: TooltipProps) {
  const fallbackId = React.useId();
  const { triggerId: userTriggerId, contentId: userContentId } =
    findIds(children);
  const triggerId = userTriggerId ?? `tooltip-trigger-${fallbackId}`;
  const contentId = userContentId ?? `tooltip-content-${fallbackId}`;

  const hideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const show = React.useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    const content = document.getElementById(contentId);
    if (content instanceof HTMLElement) {
      const el = content as HTMLElement & { showPopover: () => void };
      if (el.showPopover) el.showPopover();
    }
  }, [contentId]);

  const cancelHide = React.useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const scheduleHide = React.useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      const content = document.getElementById(contentId);
      if (content instanceof HTMLElement) {
        const el = content as HTMLElement & { hidePopover: () => void };
        if (el.hidePopover) el.hidePopover();
      }
    }, delay);
  }, [contentId, delay]);

  const contextValue = React.useMemo<TooltipContextValue>(
    () => ({
      triggerId,
      contentId,
      side,
      delay,
      show,
      scheduleHide,
      cancelHide,
    }),
    [triggerId, contentId, side, delay, show, scheduleHide, cancelHide],
  );

  React.useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
}

export type TooltipTriggerProps = {
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<"button">, "className" | "children" | "id">;

function TooltipTrigger({
  children,
  className,
  ...props
}: TooltipTriggerProps) {
  const { triggerId, show, scheduleHide, cancelHide } = useTooltip();
  const supportsAnchor = useSupportsAnchor();

  return (
    <button
      {...props}
      id={triggerId}
      type="button"
      onPointerEnter={() => {
        cancelHide();
        show();
      }}
      onPointerLeave={scheduleHide}
      onFocus={() => {
        cancelHide();
        show();
      }}
      onBlur={scheduleHide}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      style={
        supportsAnchor ? { anchorName: `--anchor-${triggerId}` } : undefined
      }
    >
      {children}
    </button>
  );
}

TooltipTrigger[TRIGGER_SYMBOL] = true;

export type TooltipContentProps = {
  children: React.ReactNode;
  className?: string;
  side?: Side;
} & Omit<React.ComponentProps<"div">, "className" | "children" | "id">;

function TooltipContent({
  children,
  className,
  side: propSide,
  ref,
  ...props
}: TooltipContentProps) {
  const {
    triggerId,
    contentId,
    side: ctxSide,
    scheduleHide,
    cancelHide,
  } = useTooltip();
  const side = propSide ?? ctxSide;
  const _ref = React.useRef<HTMLDivElement>(null);
  const supportsAnchor = useSupportsAnchor();
  const [manualPosition, setManualPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  const calculatePosition = React.useCallback(() => {
    const trigger = document.getElementById(triggerId);
    const contentEl = _ref.current;
    if (!trigger || !contentEl) return;

    const triggerRect = trigger.getBoundingClientRect();
    const contentRect = contentEl.getBoundingClientRect();
    let top = 0,
      left = 0;
    const gap = 8;

    switch (side) {
      case "top":
        top = triggerRect.top - contentRect.height - gap;
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + gap;
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        left = triggerRect.left - contentRect.width - gap;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
        left = triggerRect.right + gap;
        break;
    }

    top = Math.min(
      Math.max(top, 8),
      window.innerHeight - contentRect.height - 8,
    );
    left = Math.min(
      Math.max(left, 8),
      window.innerWidth - contentRect.width - 8,
    );

    setManualPosition({ top, left });
  }, [triggerId, side]);
  const setRefs = (element: HTMLDivElement | null) => {
    _ref.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };
  React.useEffect(() => {
    const contentEl = _ref.current;
    if (!contentEl) return;

    const handleToggle = (e: Event) => {
      const open = (e as ToggleEvent).newState === "open";
      if (open && !supportsAnchor) {
        calculatePosition();
      }
    };

    contentEl.addEventListener("toggle", handleToggle);
    return () => {
      contentEl.removeEventListener("toggle", handleToggle);
      if (contentEl.matches(":popover-open")) {
        const el = contentEl as HTMLElement & { hidePopover: () => void };
        if (el.hidePopover) el.hidePopover();
      }
    };
  }, [supportsAnchor, calculatePosition]);

  React.useEffect(() => {
    if (supportsAnchor) return;

    const handleUpdate = () => {
      if (_ref.current?.matches(":popover-open")) {
        calculatePosition();
      }
    };

    const throttledUpdate = () => {
      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(handleUpdate);
      } else {
        setTimeout(handleUpdate, 50);
      }
    };

    window.addEventListener("resize", throttledUpdate);
    window.addEventListener("scroll", throttledUpdate, { passive: true });
    return () => {
      window.removeEventListener("resize", throttledUpdate);
      window.removeEventListener("scroll", throttledUpdate);
    };
  }, [supportsAnchor, calculatePosition]);

  const getContentStyle = (): React.CSSProperties => {
    if (supportsAnchor) {
      const positionArea = {
        top: "top center",
        bottom: "bottom center",
        left: "left center",
        right: "right center",
      }[side];
      return {
        positionAnchor: `--anchor-${triggerId}`,
        positionArea,
      };
    }
    if (manualPosition) {
      return {
        position: "fixed",
        top: manualPosition.top,
        left: manualPosition.left,
        margin: 0,
      };
    }
    return { visibility: "hidden" };
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={setRefs}
      id={contentId}
      role="tooltip"
      popover="manual"
      className={cn(
        "z-50 rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md border w-max max-w-sm m-1",
        className,
      )}
      style={getContentStyle()}
      onPointerEnter={cancelHide}
      onPointerLeave={scheduleHide}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

TooltipContent[CONTENT_SYMBOL] = true;

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
