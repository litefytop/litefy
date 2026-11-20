"use client";
import * as React from "react";
import { SegmentGroup as SegmentGroupHeadless } from "@/ui";
import type { SegmentGroupProps } from "@/ui";
import { cn } from "../utils/cn";

export type { SegmentGroupProps, SegmentOptionConfig } from "@/ui";

export type SegmentGroupVariant = "primary" | "text";

const shellClasses =
  "relative inline-flex min-h-control min-w-control cursor-pointer select-none items-center rounded-sm border-frame border-border bg-background p-well shadow-surface";

const itemClasses =
  "relative z-20 inline-flex min-h-control cursor-pointer select-none items-center justify-center rounded-none px-3 text-sm font-strong tracking-label case-label text-surface-fg " +
  "hover:not-disabled:not-aria-[checked=true]:bg-accent hover:not-disabled:not-aria-[checked=true]:text-accent-fg " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const primaryItemClasses =
  itemClasses + " aria-[checked=true]:text-primary-fg";

const textGroupClasses =
  "grid w-fit min-w-control grid-flow-col auto-cols-fr cursor-pointer select-none";

const textItemClasses =
  "relative inline-flex min-h-control cursor-pointer select-none items-center justify-center px-3 text-sm font-label tracking-label case-label text-surface-fg underline-offset-4 " +
  "hover:not-disabled:not-aria-[checked=true]:text-accent " +
  "aria-[checked=true]:text-primary aria-[checked=true]:font-strong aria-[checked=true]:underline " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const MOTION = "transform 200ms ease";

const indicatorClasses =
  "absolute top-0 left-0 z-10 border-frame border-border shadow-subtle pointer-events-none";

const indicatorSurfaceClasses = "bg-surface";
const indicatorPrimaryClasses = "bg-primary";

export const segmentClasses = {
  shell: shellClasses,
  item: itemClasses,
  primaryItem: primaryItemClasses,
  textGroup: textGroupClasses,
  textItem: textItemClasses,
};

interface IndicatorRect {
  x: number;
  y: number;
  width: number;
  height: number;
  first: boolean;
  last: boolean;
}

export interface SegmentGroupSkinProps extends SegmentGroupProps {
  variant?: SegmentGroupVariant;
}

export function SegmentGroup({ variant, className, itemClassName, ...props }: SegmentGroupSkinProps) {
  const frameRef = React.useRef<HTMLSpanElement>(null);
  const [rect, setRect] = React.useState<IndicatorRect | null>(null);

  const sync = React.useCallback(() => {
    const frame = frameRef.current;
    if (!frame) {
      setRect(null);
      return;
    }
    const buttons = frame.querySelectorAll<HTMLButtonElement>("[role='radiogroup'] > button");
    const checked = frame.querySelector<HTMLButtonElement>("[aria-checked='true']");
    if (!checked || buttons.length === 0) {
      setRect(null);
      return;
    }
    const index = Array.prototype.indexOf.call(buttons, checked);
    setRect({
      x: checked.offsetLeft,
      y: checked.offsetTop,
      width: checked.offsetWidth,
      height: checked.offsetHeight,
      first: index === 0,
      last: index === buttons.length - 1,
    });
  }, []);

  React.useLayoutEffect(() => {
    if (variant === "text") return;
    sync();
    const frame = frameRef.current;
    if (!frame) return;
    const resize = new ResizeObserver(sync);
    resize.observe(frame);
    const mutations = new MutationObserver(sync);
    mutations.observe(frame, { subtree: true, attributes: true, attributeFilter: ["aria-checked"] });
    return () => {
      resize.disconnect();
      mutations.disconnect();
    };
  }, [sync, variant]);

  if (variant === "text") {
    return (
      <SegmentGroupHeadless
        {...props}
        className={cn(textGroupClasses, className)}
        itemClassName={cn(textItemClasses, itemClassName)}
      />
    );
  }

  return (
    <span ref={frameRef} className="relative inline-flex">
      {rect && (
        <span
          aria-hidden
          className={cn(
            indicatorClasses,
            variant === "primary" ? indicatorPrimaryClasses : indicatorSurfaceClasses,
            rect.first && rect.last
              ? "rounded-sm"
              : rect.first
                ? "rounded-s-sm rounded-e-none"
                : rect.last
                  ? "rounded-e-sm rounded-s-none"
                  : "rounded-none",
          )}
          style={{
            width: rect.width,
            height: rect.height,
            transform: `translate(${rect.x}px, ${rect.y}px)`,
            transition: MOTION,
          }}
        />
      )}
      <SegmentGroupHeadless
        {...props}
        className={cn(shellClasses, className)}
        itemClassName={cn(
          variant === "primary" ? primaryItemClasses : itemClasses,
          itemClassName,
        )}
      />
    </span>
  );
}
