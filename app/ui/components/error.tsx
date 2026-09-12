"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface ErrorProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function Error({ className, children, ...props }: ErrorProps) {
  return (
    <div
      role="alert"
      {...props}
      className={cn(
        "rounded-md bg-danger/15 p-2 text-sm text-danger",
        className,
      )}
    >
      {children}
    </div>
  );
}
