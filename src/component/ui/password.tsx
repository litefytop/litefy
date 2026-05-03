"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "./icons";

export type PasswordProps = Omit<
  React.ComponentProps<"input">,
  "type" | "className"
> & {
  className?: string;
  itemProps?: {
    root?: React.HTMLAttributes<HTMLDivElement>;
    toggle?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  };
};

export function Password({ className, itemProps, ...props }: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      {...itemProps?.root}
      className={cn("relative", className, itemProps?.root?.className)}
    >
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "border-input bg-background w-full rounded-md border shadow-xs outline-none h-8 px-3 py-1 text-sm",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        )}
        {...props}
      />
      <button
        type="button"
        {...itemProps?.toggle}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 hover:bg-muted rounded-md cursor-pointer p-1 text-muted-foreground",
          itemProps?.toggle?.className
        )}
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "隐藏密码" : "显示密码"}
      >
        {showPassword ? (
          <EyeOffIcon className="size-4" />
        ) : (
          <EyeIcon className="size-4" />
        )}
      </button>
    </div>
  );
}
