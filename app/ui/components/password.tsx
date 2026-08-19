"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type PasswordProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> & {
  value?: string;
  invalid?: boolean;
  slotProps?: {
    group?: HTMLAttrs<React.ComponentProps<"div">>;
    toggle?: HTMLAttrs<React.ComponentProps<"button">>;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Password({
  className,
  invalid,
  slotProps,
  disabled,
  ...props
}: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      {...slotProps?.group}
      inert={disabled || props.inert}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      className={cn(
        "flex w-full max-w-sm min-w-3xs items-center rounded-md border border-input bg-background shadow-xs transition-colors px-2 h-9",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20",
        "inert:cursor-not-allowed inert:opacity-50",
        slotProps?.group?.className,
      )}
    >
      <input
        {...props}
        disabled={disabled}
        type={showPassword ? "text" : "password"}
        className={cn(
          "appearance-none border-0 bg-transparent outline-none px-2 py-1 text-sm flex-1 min-w-0",
          "placeholder:text-muted-foreground",
          "selection:bg-primary selection:text-primary-foreground",
          className,
        )}
      />

      <button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        {...slotProps?.toggle}
        disabled={disabled}
        aria-pressed={showPassword}
        className={cn(
          "hover:text-foreground/80 rounded-md p-1 text-muted-foreground transition-colors",
          slotProps?.toggle?.className,
        )}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
}
