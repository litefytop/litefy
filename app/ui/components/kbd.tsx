"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
export interface KbdProps extends Omit<React.ComponentProps<"kbd">, "className"> {
    className?: ClassNameValue;
}
export function Kbd({ children, className, ...props }: KbdProps) {
    return (<kbd {...props} className={cn("inline-flex h-8 min-w-8 items-center justify-center rounded-sm px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wide", "border backdrop-blur-md shadow-subtle", className)}>
      {children}
    </kbd>);
}
