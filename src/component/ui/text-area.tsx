"use client";

import { useState, useRef } from "react";
import { cn, ClassNameValue } from "@/lib/utils";
import type { ReactNode } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type TextareaProps = Omit<
  React.ComponentProps<"textarea">,
  "value" | "onChange"
> & {
  value?: string;
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  itemProps?: {
    root?: WithDataAttributes<React.ComponentProps<"div">>;
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
  };
  onChange?: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void | { invalid?: string };
};

export function Textarea({
  className,
  label,
  description,
  invalid: externalInvalid,
  itemProps,
  onChange,
  ...props
}: TextareaProps) {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const res = onChange?.(e);
    setInternalInvalid(res?.invalid);
  };

  return (
    <div 
      {...itemProps?.root}
      className={cn("flex flex-col gap-1", className, itemProps?.root?.className)}
    >
      {label && (
        <label
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1 indent-2",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <textarea
        {...props}
        ref={innerRef}
        onChange={handleChange}
        aria-invalid={isInvalid}
        data-invalid={isInvalid}
        className={cn(
          "flex w-full rounded-lg border border-input bg-background shadow-xs transition-colors px-3 py-2 text-sm",
          "min-h-[80px] resize-y",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-muted-foreground",
          "selection:bg-primary selection:text-primary-foreground",
          className
        )}
      />

      <small
        data-invalid={isInvalid}
        {...(isInvalid ? itemProps?.invalid : itemProps?.description)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground data-[invalid=true]:text-destructive",
          (isInvalid ? itemProps?.invalid : itemProps?.description)?.className,
        )}
        role={isInvalid ? "alert" : undefined}
      >
        {isInvalid ? finalInvalid : description}
      </small>
    </div>
  );
}
