"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface CardProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-background text-foreground",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100  bg-radial-[at_25%_25%] from-primary/15 to-transparent to-75%"
      />
      {children}
    </div>
  );
}
