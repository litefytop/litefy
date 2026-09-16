"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

export interface CardProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border shadow-base backdrop-blur-md bg-background text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
