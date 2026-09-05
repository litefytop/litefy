"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface SeparatorLineProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
  orientation?: "horizontal" | "vertical";
}

export function SeparatorLine({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorLineProps) {
  return (
    <div
      {...props}
      data-orientation={orientation}
      className={cn(
        "bg-border",
        "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:h-px",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
    />
  );
}

export interface SeparatorTextProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
  orientation?: "horizontal" | "vertical";
}

export function SeparatorText({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorTextProps) {
  return (
    <span
      {...props}
      data-orientation={orientation}
      className={cn("text-muted-foreground text-sm whitespace-nowrap", className)}
    />
  );
}

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
  className?: ClassNameValue;
  classNames?: {
    line?: ClassNameValue;
    text?: ClassNameValue;
  };
  styles?: {
    line?: React.CSSProperties;
    text?: React.CSSProperties;
  };
}

export function Separator({
  orientation = "horizontal",
  children,
  className,
  classNames,
  styles,
}: SeparatorProps) {
  if (!children) {
    return <SeparatorLine role="separator" orientation={orientation} className={className} />;
  }

  return (
    <div
      role="separator"
      data-orientation={orientation}
      className={cn(
        "flex",
        "data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-2 data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-center data-[orientation=vertical]:gap-2 data-[orientation=vertical]:h-full",
        className,
      )}
    >
      <SeparatorLine
        orientation={orientation}
        className={cn("flex-1", classNames?.line)}
        style={styles?.line}
      />
      <SeparatorText orientation={orientation} className={classNames?.text} style={styles?.text}>
        {children}
      </SeparatorText>
      <SeparatorLine
        orientation={orientation}
        className={cn("flex-1", classNames?.line)}
        style={styles?.line}
      />
    </div>
  );
}
