"use client";

import { useState } from "react";
import { cn, ClassNameValue } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type PasswordProps = Omit<
  React.ComponentProps<"input">,
  "type" | "value" | "onChange"
> & {
  value?: string;
  invalid?: boolean;
  direction?: "vertical" | "horizontal";
  itemProps?: {
    group?: WithDataAttributes<React.ComponentProps<"div">>;
    toggle?: WithDataAttributes<React.ComponentProps<"button">>;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Password({
  className,
  invalid,
  itemProps,
  ...props
}: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      {...itemProps?.group}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      className={cn(
        "flex w-sm items-center rounded-md border border-input bg-background shadow-xs transition-colors px-2 h-9",
        "has-focus:border-primary has-focus:ring-2 has-focus:ring-primary/20",
        "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20",
        itemProps?.group?.className,
      )}
    >
      <input
        {...props}
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
        {...itemProps?.toggle}
        className={cn(
          "hover:text-foreground/80 rounded-md p-1 text-muted-foreground transition-colors",
          itemProps?.toggle?.className,
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
