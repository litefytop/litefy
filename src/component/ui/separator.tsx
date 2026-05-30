"use client";

import { cn, ClassNameValue } from "@/lib";

export type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
  className?: ClassNameValue;
  lineClassName?: ClassNameValue;
};

export function Separator({
  orientation = "horizontal",
  children,
  className,
  lineClassName,
}: SeparatorProps) {
  if (!children) {
    return (
      <div
        data-orientation={orientation}
        className={cn(
          "bg-border",
          "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:h-px",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          lineClassName,
          className
        )}
        role="separator"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      data-orientation={orientation}
      className={cn(
        "flex group",
        "data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-2 data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-center data-[orientation=vertical]:gap-2 data-[orientation=vertical]:h-full",
        className
      )}
      role="separator"
    >
      <div
        className={cn(
          "bg-border flex-1",
          "group-data-[orientation=horizontal]:h-px",
          "group-data-[orientation=vertical]:w-px",
          lineClassName
        )}
      />
      <span
        className={cn(
          "text-muted-foreground text-sm whitespace-nowrap",
          "data-[orientation=vertical]:writing-mode-vertical-lr data-[orientation=vertical]:rotate-180"
        )}
      >
        {children}
      </span>
      <div
        className={cn(
          "bg-border flex-1",
          "group-data-[orientation=horizontal]:h-px",
          "group-data-[orientation=vertical]:w-px",
          lineClassName
        )}
      />
    </div>
  );
}
