"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "headline"
  | "description"
  | "heading-code"
  | "description-code";

const variantClasses: Record<TypographyVariant, string> = {
  h1: "font-semibold tracking-tight text-4xl sm:text-5xl lg:text-6xl",
  h2: "font-semibold tracking-tight text-3xl sm:text-4xl lg:text-5xl",
  h3: "font-semibold tracking-tight text-2xl sm:text-3xl lg:text-4xl",
  h4: "font-semibold tracking-tight text-xl sm:text-2xl lg:text-3xl",
  h5: "font-semibold tracking-tight text-lg sm:text-xl lg:text-2xl",
  h6: "font-semibold tracking-tight text-base sm:text-lg lg:text-xl",
  headline: "font-bold tracking-tight text-4xl py-4 mb-4",
  description: "text-muted-foreground text-base sm:text-lg",
  "heading-code": "font-mono font-medium text-primary bg-muted/50 px-2 py-0.5 rounded-md",
  "description-code": "font-mono text-sm bg-muted/50 px-1.5 py-0.5 rounded",
};

const variantTags: Record<TypographyVariant, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  headline: "h1",
  description: "p",
  "heading-code": "code",
  "description-code": "code",
};

export interface TypographyProps extends Omit<React.ComponentProps<"p">, "className"> {
  variant?: TypographyVariant;
  className?: ClassNameValue;
}

export function Typography({
  variant = "description",
  children,
  className,
  ...props
}: TypographyProps) {
  const Comp = variantTags[variant] as React.ElementType;
  return (
    <Comp {...props} className={cn(variantClasses[variant], className)}>
      {children}
    </Comp>
  );
}
