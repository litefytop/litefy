"use client";

import { useState, useRef } from "react";
import { cn, ClassNameValue } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type PasswordProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> & {
  value?: string;
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  itemProps?: {
    root?: WithDataAttributes<React.ComponentProps<"div">>;
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    group?: WithDataAttributes<React.ComponentProps<"div">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
    toggle?: WithDataAttributes<React.ComponentProps<"button">>;
  };
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void | { invalid?: string };
};

export function Password({
  className,
  label,
  description,
  invalid: externalInvalid,
  itemProps,
  onChange,
  ...props
}: PasswordProps) {
  const innerRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const res = onChange?.(e);
    setInternalInvalid(res?.invalid);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-2 indent-2",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <div
        {...itemProps?.group}
        data-invalid={isInvalid}
        className={cn(
          "flex w-full items-center rounded-full border border-input bg-background shadow-xs transition-colors px-2",
          "has-focus:border-primary has-focus:ring-2 has-focus:ring-primary/20",
          "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20",
          "has-disabled:pointer-events-none has-disabled:opacity-50",
          itemProps?.group?.className,
        )}
      >
 

        <input
          {...props}
          ref={innerRef}
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
          className={cn(
            "appearance-none border-0 bg-transparent outline-none h-8 px-2 py-2 text-sm flex-1 min-w-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground",
            "selection:bg-primary selection:text-primary-foreground",
          )}
          autoComplete="off"
          aria-invalid={isInvalid}
          data-invalid={isInvalid}
        />


        <button
          type="button"
          {...itemProps?.toggle}
          className={cn(
            "hover:text-foreground/80 rounded-md p-1 text-muted-foreground transition-colors mr-2",
            itemProps?.toggle?.className
          )}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>


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
