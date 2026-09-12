"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface TagProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
}

export function Tag({ children, className, ...props }: TagProps) {
  return (
    <span {...props} className={cn(Tag.className, children && "px-1", className)}>
      {children}
    </span>
  );
}

Tag.className =
  "inline-flex items-center justify-center min-h-2 min-w-2 rounded-md leading-none tabular-nums truncate text-xs text-background bg-primary";
