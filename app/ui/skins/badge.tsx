import * as React from "react";
import { cn } from "../utils/cn";

export interface BadgeProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: string;
  label?: React.ReactNode;
  classNames?: {
    label?: string;
  };
  styles?: {
    label?: React.CSSProperties;
  };
}

const rootClasses =
  "relative inline-flex size-11 items-center justify-center rounded-sm bg-surface text-foreground shadow-subtle";

const labelClasses =
  "absolute top-0 right-0 inline-flex size-3 translate-x-1/2 -translate-y-1/2 " +
  "items-center justify-center rounded-pill bg-primary " +
  "text-primary-fg text-sm font-label leading-none tabular-nums case-label tracking-label " +
  "shadow-subtle truncate " +
  "not-empty:h-auto not-empty:w-auto not-empty:min-h-3.5 not-empty:min-w-3.5 not-empty:px-2";

export function Badge({ className, classNames, label, styles, children, ...props }: BadgeProps) {
  return (
    <div {...props} className={cn(rootClasses, className)}>
      <span className={cn(labelClasses, classNames?.label)} style={styles?.label}>
        {label}
      </span>
      {children}
    </div>
  );
}
