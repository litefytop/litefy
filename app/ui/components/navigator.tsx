"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface NavigatorProps
  extends Omit<React.ComponentProps<"div">, "className" | "title"> {
  title?: React.ReactNode;
  className?: ClassNameValue;
  classNames?: {
    title?: ClassNameValue;
  };
  styles?: {
    title?: React.CSSProperties;
  };
}

export function Navigator({
  title,
  className,
  classNames,
  styles,
  children,
  ...props
}: NavigatorProps) {
  return (
    <div {...props} className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {title != null && (
        <span
          className={cn(
            "min-w-0 text-sm font-medium text-foreground",
            classNames?.title,
          )}
          style={styles?.title}
        >
          {title}
        </span>
      )}
      {children}
    </div>
  );
}
