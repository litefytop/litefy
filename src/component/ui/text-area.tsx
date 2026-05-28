"use client";


import { cn, ClassNameValue } from "@/lib/utils";



export type TextareaProps = Omit<
  React.ComponentProps<"textarea">,
  "value" | "onChange"
> & {
  value?: string;
  className?: ClassNameValue;

  invalid?: boolean;

  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void | { invalid?: string };
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
        "flex w-full rounded-lg border border-input bg-background shadow-xs transition-colors px-2 py-2 text-sm",
        "min-h-[80px] resize-y",
        "focus:border-primary focus:ring-2 focus:ring-primary/20",
        "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "placeholder:text-muted-foreground",
        "selection:bg-primary selection:text-primary-foreground",
        className,
      )}
    />
  );
}
