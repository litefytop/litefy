"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

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

interface TooltipContextValue {
  popoverId?: string;
  anchorName?: string;
  delay?: number;
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export interface TooltipWiringOptions {
  popoverId?: string;
  anchorName?: string;
  delay?: number;
}

export function useTooltipWiring({ popoverId, anchorName, delay = 100 }: TooltipWiringOptions) {
  return React.useMemo(
    () => ({
      show: () => {
        if (popoverId) showTooltip(popoverId);
      },
      hide: () => {
        if (popoverId) scheduleHide(popoverId, delay);
      },
      cancel: () => {
        if (popoverId) cancelHide(popoverId);
      },
      anchorStyle: anchorName ? { anchorName } : undefined,
    }),
    [popoverId, anchorName, delay],
  );
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
  delay,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: TooltipTriggerProps) {
  const ctx = React.useContext(TooltipContext);
  const popoverId$ = popoverId ?? ctx?.popoverId;
  const anchorName$ = anchorName ?? ctx?.anchorName;
  const delay$ = delay ?? ctx?.delay ?? 100;
  const wiring = useTooltipWiring({ popoverId: popoverId$, anchorName: anchorName$, delay: delay$ });

  return (
    <button
      {...props}
      type="button"
      popoverTarget={popoverId$ || undefined}
      onPointerEnter={(e) => {
        wiring.show();
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        wiring.hide();
        onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        wiring.show();
        onFocus?.(e);
      }}
      onBlur={(e) => {
        wiring.hide();
        onBlur?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring px-1",
        className,
      )}
      style={anchorName$ ? { anchorName: anchorName$, ...style } : style}
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
  delay,
  ref,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TooltipContentProps) {
  const ctx = React.useContext(TooltipContext);
  const id$ = id ?? ctx?.popoverId;
  const anchorName$ = anchorName ?? ctx?.anchorName;
  const delay$ = delay ?? ctx?.delay ?? 100;

  return (
    <div
      ref={ref}
      id={id$}
      role="tooltip"
      popover="manual"
      onPointerEnter={(e) => {
        if (id$) cancelHide(id$);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        if (id$) scheduleHide(id$, delay$);
        onPointerLeave?.(e);
      }}
      className={cn(
        "z-50 rounded-md bg-background px-3 py-1.5 text-xs text-foreground shadow-md border w-max max-w-sm m-1",
        className,
      )}
      style={{
        positionAnchor: anchorName$,
        positionArea: "top span-all",
        justifySelf: "anchor-center",
        alignSelf: "end",
        positionTryFallbacks: "flip-block, flip-inline",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TooltipProps {
  children?: React.ReactNode;
  delay?: number;
}

export function Tooltip({ children, delay = 100 }: TooltipProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const value = React.useMemo(
    () => ({ popoverId: `tooltip-${id}`, anchorName: `--tooltip-${id}`, delay }),
    [delay],
  );

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;
