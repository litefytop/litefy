"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export type ChipVariant =
  | "outline"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface ChipProps extends Omit<React.ComponentProps<"span">, "className"> {
  variant?: ChipVariant;
  className?: ClassNameValue;
}

const chipVariants: Record<ChipVariant, string> = {
  outline: "border text-foreground",
  primary: "bg-primary text-primary-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
};



export function Chip({ variant = "primary", children, className, ...props }: ChipProps) {
  return (
    <span
      data-variant={variant}
      {...props}
      className={cn("inline-flex items-center justify-center min-h-2 min-w-2 rounded-sm leading-none tabular-nums truncate text-xs px-1", chipVariants[variant], className)}
    >
      {children}
    </span>
  );
}
