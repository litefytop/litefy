"use client";

import * as React from "react";
import { cn, ClassNameValue } from "@/lib";

export type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
  className?: ClassNameValue;
  delay?: number;
  slotProps?: {
    trigger?: React.HTMLAttributes<HTMLSpanElement> & {
      className?: ClassNameValue;
    };
    content?: React.HTMLAttributes<HTMLDivElement> & {
      className?: ClassNameValue;
    };
  };
};

export function Tooltip({
  children,
  content,
  side = "top",
  disabled,
  className,
  delay = 100,
  slotProps,
}: TooltipProps) {
  const id = React.useId();
  const triggerId = `tooltip-trigger-${id}`;
  const contentId = `tooltip-content-${id}`;
  const hideTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleShow = React.useCallback(() => {
    if (disabled) return;
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    const el = document.getElementById(contentId);
    if (el && !el.matches(":popover-open")) {
      el.showPopover();
    }
  }, [disabled, contentId]);

  const handleHide = React.useCallback(() => {
    if (disabled) return;
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      const el = document.getElementById(contentId);
      if (el && el.matches(":popover-open")) {
        el.hidePopover();
      }
    }, delay);
  }, [disabled, contentId, delay]);

  const positionArea = (() => {
    switch (side) {
      case "top":
        return "top center";
      case "bottom":
        return "bottom center";
      case "left":
        return "left center";
      case "right":
        return "right center";
    }
  })();

  return (
    <span className={cn("inline-block", className)}>
      <span
        {...slotProps?.trigger}
        id={triggerId}
        tabIndex={0}
        aria-describedby={contentId}
        className={cn(
          "inline-block cursor-default focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1",
          slotProps?.trigger?.className,
        )}
        onPointerEnter={handleShow}
        onPointerLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        style={{
          anchorName: `--anchor-${triggerId}`,
          ...slotProps?.trigger?.style,
        }}
      >
        {children}
      </span>
      <div
        {...slotProps?.content}
        id={contentId}
        popover="auto"
        role="tooltip"
        className={cn(
          "bg-popover text-popover-foreground rounded-md px-3 py-1.5 text-xs z-50 border w-max max-w-sm m-2",
          slotProps?.content?.className,
        )}
        style={{
          positionAnchor: `--anchor-${triggerId}`,
          positionArea,
          ...slotProps?.content?.style,
        }}
        onPointerEnter={handleShow}
        onPointerLeave={handleHide}
      >
        {content}
      </div>
    </span>
  );
}
