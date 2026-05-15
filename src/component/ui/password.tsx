"use client";

import { useState, useRef } from "react";
import { cn, ClassNameValue } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "./icons";
import type { ReactNode } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
};

export type PasswordProps = Omit<
  React.ComponentProps<"input">,
  "type" | "className" | "value" | "onChange"
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
    leading?: WithDataAttributes<React.ComponentProps<"span">>;
    trailing?: WithDataAttributes<React.ComponentProps<"span">>;
    invalid?: WithDataAttributes<React.ComponentProps<"div">>;
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
  leading,
  trailing,
  itemProps,
  onChange,
  value,
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
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1 indent-2",
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
          "relative flex w-full items-center rounded-md border border-input bg-background shadow-xs transition-colors",
          "has-focus:border-primary has-focus:ring-2 has-focus:ring-primary/20",
          "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20",
          "has-disabled:pointer-events-none has-disabled:opacity-50",
          itemProps?.group?.className,
        )}
      >
        {leading && (
          <span
            {...itemProps?.leading}
            className={cn(
              "shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 px-2",
              itemProps?.leading?.className,
            )}
          >
            {leading}
          </span>
        )}

        <input
          {...props}
          ref={innerRef}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleChange}
          className={cn(
            "appearance-none border-0 bg-transparent outline-none h-8 px-3 py-1 text-sm flex-1 min-w-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground",
            "selection:bg-primary selection:text-primary-foreground",
          )}
          autoComplete="off"
          aria-invalid={isInvalid}
          data-invalid={isInvalid}
        />

        {trailing && (
          <span
            {...itemProps?.trailing}
            className={cn(
              "shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 px-2",
              itemProps?.trailing?.className,
            )}
          >
            {trailing}
          </span>
        )}

        <button
          type="button"
          {...itemProps?.toggle}
          className={cn(
            "hover:bg-muted rounded-md p-1 text-muted-foreground transition-colors mr-2",
            itemProps?.toggle?.className
          )}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </button>
      </div>

      {finalInvalid && (
        <div
          {...itemProps?.invalid}
          className={cn(
            "text-sm font-medium text-destructive py-1 indent-2",
            itemProps?.invalid?.className,
          )}
        >
          {finalInvalid}
        </div>
      )}
      {description && !finalInvalid && (
        <small
          {...itemProps?.description}
          className={cn(
            "text-sm text-muted-foreground py-1 indent-2",
            itemProps?.description?.className,
          )}
        >
          {description}
        </small>
      )}
    </div>
  );
}
