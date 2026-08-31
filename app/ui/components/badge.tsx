"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface BadgeProps extends Omit<React.ComponentProps<"span">, "className" | "children"> {
  children?: React.ReactNode;
  count?: number;
  max?: number;
  className?: ClassNameValue;
}

export function Badge({ children, count, max = 99, className, ...props }: BadgeProps) {
  const isCount = count !== undefined;
  const isDot = !isCount && (children === undefined || children === null);

  return (
    <span
      {...props}
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-destructive font-medium text-destructive-foreground",
        isDot && "size-2 rounded-full",
        isCount && "h-4 min-w-4 rounded-full px-1 text-[11px] leading-none tabular-nums",
        !isDot && !isCount && "h-4.5 rounded-(--radius) px-1.5 text-[11px] leading-none",
        className,
      )}
    >
      {isCount ? (count > max ? `${max}+` : count) : children}
    </span>
  );
}
