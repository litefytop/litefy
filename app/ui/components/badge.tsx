"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface BadgeProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  label?: React.ReactNode;
  classNames?: {
    label?: ClassNameValue;
  };
  styles?: {
    label?: React.CSSProperties;
  };
}

export function Badge({ children, className, label, classNames, styles, ...props }: BadgeProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative flex items-center justify-center size-12 rounded-md shadow-md",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-0 right-0 inline-flex items-center justify-center min-h-2 min-w-2 rounded-full translate-x-[50%] translate-y-[-50%] bg-primary text-primary-foreground leading-none tabular-nums truncate text-xs",
          label && "px-1",
          classNames?.label,
        )}
        style={styles?.label}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
