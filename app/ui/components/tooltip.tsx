"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { type ClassNameValue, cn } from "@/lib";

const hideTimers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

function showTooltip(id: string) {
  const el = document.getElementById(id);
  if (!el || el.matches(":popover-open")) return;
  const timer = hideTimers.get(el);
  if (timer) clearTimeout(timer);
  el.showPopover();
}

function scheduleHide(id: string, delay: number) {
  const el = document.getElementById(id);
  if (!el) return;
  const timer = hideTimers.get(el);
  if (timer) clearTimeout(timer);
  hideTimers.set(
    el,
    setTimeout(() => {
      hideTimers.delete(el);
      if (el.isConnected && el.matches(":popover-open")) {
        el.hidePopover();
      }
    }, delay),
  );
}

function cancelHide(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const timer = hideTimers.get(el);
  if (timer) {
    clearTimeout(timer);
    hideTimers.delete(el);
  }
}

export interface TooltipTriggerProps extends Omit<
  React.ComponentProps<"button">,
  "className" | "style"
> {
  className?: ClassNameValue;
  style?: React.CSSProperties;
  popoverId?: string;
  anchorName?: string;
  delay?: number;
}

export function TooltipTrigger({
  className,
  style,
  popoverId,
  anchorName,
  delay = 100,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: TooltipTriggerProps) {
  const handleShow = () => popoverId && showTooltip(popoverId);
  const handleHide = () => popoverId && scheduleHide(popoverId, delay);

  return (
    <button
      {...props}
      type="button"
      onPointerEnter={(e) => {
        handleShow();
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        handleHide();
        onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        handleShow();
        onFocus?.(e);
      }}
      onBlur={(e) => {
        handleHide();
        onBlur?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      style={anchorName ? { anchorName, ...style } : style}
    />
  );
}

export interface TooltipContentProps extends Omit<
  React.ComponentProps<"div">,
  "className" | "style" | "id"
> {
  className?: ClassNameValue;
  style?: React.CSSProperties;
  id?: string;
  anchorName?: string;
  delay?: number;
}

export function TooltipContent({
  children,
  className,
  style,
  id,
  anchorName,
  delay = 100,
  ref,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TooltipContentProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={ref}
      id={id}
      role="tooltip"
      popover="manual"
      onPointerEnter={(e) => {
        if (id) cancelHide(id);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        if (id) scheduleHide(id, delay);
        onPointerLeave?.(e);
      }}
      className={cn(
        "z-50 rounded-md bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md border w-max max-w-sm m-1",
        className,
      )}
      style={{
        positionAnchor: anchorName,
        positionArea: "top center",
        positionTryFallbacks: "flip-block, flip-inline",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

type TooltipChild = React.ReactElement<{
  popoverTarget?: string;
  style?: React.CSSProperties;
  onPointerEnter?: React.PointerEventHandler<HTMLElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
}>;

export interface TooltipProps {
  children: TooltipChild;
  content: React.ReactNode;
  delay?: number;
}

export function Tooltip({ children, content, delay = 100 }: TooltipProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const contentId = `tooltip-${id}`;
  const anchorName = `--tooltip-${id}`;

  const trigger = React.cloneElement(children, {
    popoverTarget: contentId,
    style: { ...children.props.style, anchorName },
    onPointerEnter: (e) => {
      showTooltip(contentId);
      children.props.onPointerEnter?.(e);
    },
    onPointerLeave: (e) => {
      scheduleHide(contentId, delay);
      children.props.onPointerLeave?.(e);
    },
    onFocus: (e) => {
      showTooltip(contentId);
      children.props.onFocus?.(e);
    },
    onBlur: (e) => {
      scheduleHide(contentId, delay);
      children.props.onBlur?.(e);
    },
  });

  return (
    <>
      {trigger}
      <TooltipContent id={contentId} anchorName={anchorName} delay={delay}>
        {content}
      </TooltipContent>
    </>
  );
}

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
