"use client";

import { type ClassNameValue, cn } from "../utils/cn";

export type TextareaProps = Omit<React.ComponentProps<"textarea">, "value" | "onChange"> & {
  value?: string;
  className?: ClassNameValue;

  invalid?: boolean;

  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => undefined | { invalid?: string };
};

export function Textarea({
  className,

  invalid,

  ...props
}: TextareaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid}
      data-invalid={invalid ? true : undefined}
      className={cn(
        "flex w-full rounded-md border border-border shadow-xs transition-colors px-2 py-2 text-sm",
        "min-h-20 resize-y",
        "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
        "aria-invalid:border-danger aria-invalid:text-danger",
        "aria-invalid:focus-visible:outline-1 aria-invalid:focus-visible:outline-danger aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-danger/50",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        className,
      )}
    />
  );
}
