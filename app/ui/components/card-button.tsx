"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

const cardButtonClass = {
  base: "cursor-pointer relative overflow-hidden rounded-lg border border-border shadow-base backdrop-blur-md bg-background text-foreground text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-1 focus-visible:outline-outline focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-0 active:shadow-[inset_0_2px_4px_0_var(--accent)]",
  variant: {
    primary: "bg-primary text-primary-foreground border-primary hover:bg-primary-accent",
    danger: "bg-danger/15 text-danger border-danger/20 hover:bg-danger/20",
    outline: "hover:bg-hover",
    text: "border-transparent bg-transparent shadow-none hover:translate-y-0 hover:bg-hover hover:shadow-none active:shadow-none",
  },
};

export type CardButtonVariant = keyof typeof cardButtonClass.variant;

export interface CardButtonProps extends Omit<React.ComponentProps<"button">, "className"> {
  variant?: CardButtonVariant;
  className?: ClassNameValue;
}

export function CardButton({ variant = "outline", className, children, ...props }: CardButtonProps) {
  return (
    <button type="button" {...props} className={cn(cardButtonClass.base, cardButtonClass.variant[variant], className)}>
      {children}
    </button>
  );
}


