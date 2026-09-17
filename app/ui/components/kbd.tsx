"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface KbdProps extends Omit<React.ComponentProps<"kbd">, "className"> {
  className?: ClassNameValue;
}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-sm px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wide transition-all duration-200",
        "border backdrop-blur-md shadow-subtle",
        "hover:-translate-y-px hover:bg-muted hover:shadow-faint",
        "active:translate-y-px active:shadow-[inset_0_2px_4px_var(--color-ring)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
