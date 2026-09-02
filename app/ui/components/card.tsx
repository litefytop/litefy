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
        "group relative overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, var(--card-glow, oklch(0.55 0.12 250 / 0.12)) 0%, transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
