"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export type CalloutVariant = "info" | "success" | "warning" | "danger";

export interface CalloutProps extends Omit<React.ComponentProps<"div">, "className"> {
  variant?: CalloutVariant;
  className?: ClassNameValue;
}

const calloutClass: Record<CalloutVariant, string> = {
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};

export function Callout({ variant = "info", className, ...props }: CalloutProps) {
  return (
    <div
      role="note"
      data-variant={variant}
      {...props}
      className={cn("rounded-md p-3 text-sm", calloutClass[variant], className)}
    />
  );
}
