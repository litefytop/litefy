import { ClassNameValue, cn } from "@/lib/utils";
import type { ReactNode } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export type InputProps = Omit<React.ComponentProps<"input">, "type"> & {
  type?: "text" | "email" | "url" | "tel" | "search";
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
  itemProps?: {
    group?: WithDataAttributes<React.ComponentProps<"div">>;
    leading?: WithDataAttributes<React.ComponentProps<"span">>;
    trailing?: WithDataAttributes<React.ComponentProps<"span">>;
  };
};

export function Input({
  className,
  leading,
  trailing,
  itemProps,
  invalid,
  disabled,
  ...props
}: InputProps) {
  return (
    <div
      {...itemProps?.group}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      className={cn(
        "flex px-2 h-9 items-center border shadow-xs outline-none border-input bg-background rounded-md w-sm",
        "has-focus:border-primary has-focus:ring-2 has-focus:ring-primary/20",
        "data-invalid:border-destructive/70",
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
        disabled={disabled}
        className={cn(
          "appearance-none outline-none border-0 bg-transparent px-2 py-1 flex-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-muted-foreground",
          "selection:bg-primary selection:text-primary-foreground",
          className,
        )}
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
  );
}
