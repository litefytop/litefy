import type { ReactNode } from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export type InputProps = Omit<React.ComponentProps<"input">, "type"> & {
  type?: "text" | "email" | "url" | "tel" | "search";
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
  slotProps?: {
    group?: HTMLAttrs<React.ComponentProps<"div">>;
    leading?: HTMLAttrs<React.ComponentProps<"span">>;
    trailing?: HTMLAttrs<React.ComponentProps<"span">>;
  };
};

export function Input({
  className,
  leading,
  trailing,
  slotProps,
  invalid,
  disabled,
  ...props
}: InputProps) {
  return (
    <div
      {...slotProps?.group}
      inert={props.inert || disabled}
      data-invalid={invalid || undefined}
      className={cn(
        "flex px-2 h-9 items-center border shadow-xs outline-none border-input bg-background rounded-md w-sm",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-invalid:border-destructive/70 data-invalid:ring-destructive/20",
        slotProps?.group?.className,
      )}
    >
      {leading && (
        <span
          {...slotProps?.leading}
          className={cn(
            "shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 px-2",
            slotProps?.leading?.className,
          )}
        >
          {leading}
        </span>
      )}
      <input
        {...props}
        disabled={disabled}
        aria-invalid={invalid}
        className={cn(
          "appearance-none outline-none border-0 bg-transparent px-2 py-1 flex-1",
          "placeholder:text-muted-foreground",
          "selection:bg-primary selection:text-primary-foreground",
          className,
        )}
      />
      {trailing && (
        <span
          {...slotProps?.trailing}
          className={cn(
            "shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 [&>svg]:shrink-0 px-2",
            slotProps?.trailing?.className,
          )}
        >
          {trailing}
        </span>
      )}
    </div>
  );
}
