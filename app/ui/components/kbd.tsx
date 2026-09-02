"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface KbdProps extends Omit<React.ComponentProps<"kbd">, "className"> {
  className?: ClassNameValue;
}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(
        "inline-flex h-8 min-w-[2.4rem] items-center justify-center rounded-(--radius) px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wide transition-all duration-200",
        "border border-neutral bg-muted/40 backdrop-blur-md shadow-[0_4px_6px_-1px_var(--color-ring)]",
        "hover:-translate-y-px hover:bg-muted hover:shadow-[0_1px_2px_var(--color-ring)]",
        "active:translate-y-px active:shadow-[inset_0_2px_4px_var(--color-ring)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
