"use client";

import { useRef } from "react";
import { type ClassNameValue, cn } from "..";

export interface ProgressProps {
  current: number;
  duration: number;
  isAbort?: boolean;
  isComplete?: boolean;
  className?: ClassNameValue;
}

export function Progress({ current, duration, isAbort, isComplete, className }: ProgressProps) {
  const frozenWidthRef = useRef(0);
  const clamped = Math.min(100, Math.max(0, current));
  const width = isComplete ? 100 : isAbort ? frozenWidthRef.current : clamped;
  if (!isAbort) frozenWidthRef.current = width;

  return (
    <div className={cn("h-1 overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-[width] ease-out",
          isAbort ? "bg-danger" : isComplete ? "bg-success" : "bg-primary",
        )}
        style={{
          width: `${width}%`,
          transitionDuration: `${isAbort ? 0 : duration}ms`,
        }}
      />
    </div>
  );
}
