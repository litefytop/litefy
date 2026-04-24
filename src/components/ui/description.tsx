"use client";

import { cn, ClassNameValue } from "@/lib";

export type DescriptionProps = {
  className?: ClassNameValue;
} & React.ComponentProps<"small">;

export function Description({ className, ...props }: DescriptionProps) {
  return (
    <small {...props} className={cn("text-sm text-muted-foreground", className)}>
      {props.children}
    </small>
  );
}
