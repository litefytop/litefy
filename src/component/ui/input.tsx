import { ClassNameValue, cn } from "@/lib/utils";
import type { ReactNode } from "react";

// 支持 data-* 属性的类型工具
type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
};

export type InputProps = Omit<React.ComponentProps<"input">, "className"> & {
  invalid?: boolean;
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  itemProps?: {
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    group?: WithDataAttributes<React.ComponentProps<"div">>;
    leading?: WithDataAttributes<React.ComponentProps<"span">>;
    trailing?: WithDataAttributes<React.ComponentProps<"span">>;
    error?: WithDataAttributes<React.ComponentProps<"div">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
  };
};

function Input({
  className,
  invalid,
  label,
  description,
  error,
  leading,
  trailing,
  itemProps,
  ...props
}: InputProps) {
  const hasError = invalid || !!error;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
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
        className={cn(
          "border-input bg-background flex w-full items-center rounded-md border shadow-xs outline-none has-[>input:disabled]:pointer-events-none has-[>input:disabled]:cursor-not-allowed has-[>input:disabled]:opacity-50",
          hasError &&
            "ring-destructive/20 dark:ring-destructive/40 border-destructive",
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
          className={cn(
            "appearance-none outline-none w-full h-8 px-2 py-1 text-sm flex-1 min-w-0",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
            !hasError &&
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          )}
          autoComplete="off"
          aria-invalid={hasError}
          {...props}
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
      </div>
      {error && (
        <div
          {...itemProps?.error}
          className={cn(
            "text-sm font-medium text-destructive py-1 indent-2",
            itemProps?.error?.className,
          )}
        >
          {error}
        </div>
      )}
      {description && !error && (
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

export { Input };
