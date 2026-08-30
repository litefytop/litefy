import type { ReactNode } from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export type InputGroupProps = HTMLAttrs<React.ComponentProps<"div">>;
export function InputGroup({ className, ...props }: InputGroupProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex h-9 w-sm rounded-md px-2 border shadow-xs bg-input items-center",
        "focus-within:ring-inset focus-within:ring-ring focus-within:ring-1",
        "data-invalid:border-destructive-accent data-invalid:ring-destructive-accent",
        className,
      )}
    />
  );
}

export type InputLeadingProps = HTMLAttrs<React.ComponentProps<"span">>;
export function InputLeading({ className, ...props }: InputLeadingProps) {
  return (
    <span
      {...props}
      className={cn("shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 px-2", className)}
    />
  );
}

export type InputTrailingProps = HTMLAttrs<React.ComponentProps<"span">>;
export function InputTrailing({ className, ...props }: InputTrailingProps) {
  return (
    <span
      {...props}
      className={cn("shrink-0 text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 px-2", className)}
    />
  );
}

export type InputProps = Omit<React.ComponentProps<"input">, "type" | "className"> & {
  type?: "text" | "email" | "url" | "tel" | "search";
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
  classNames?: {
    root?: ClassNameValue;
    leading?: ClassNameValue;
    trailing?: ClassNameValue;
    input?: ClassNameValue;
  };
  styles?: {
    root?: React.CSSProperties;
    leading?: React.CSSProperties;
    trailing?: React.CSSProperties;
    input?: React.CSSProperties;
  };
};

export function Input({ classNames, styles, leading, trailing, invalid, ...props }: InputProps) {
  return (
    <InputGroup className={classNames?.root} style={styles?.root} data-invalid={invalid || undefined}>
      {leading && (
        <InputLeading className={classNames?.leading} style={styles?.leading}>
          {leading}
        </InputLeading>
      )}
      <input
        {...props}
        aria-invalid={invalid}
        className={cn(
          "flex-1 border-0 ring-0 bg-transparent px-2 py-1 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          classNames?.input,
        )}
        style={styles?.input}
      />
      {trailing && (
        <InputTrailing className={classNames?.trailing} style={styles?.trailing}>
          {trailing}
        </InputTrailing>
      )}
    </InputGroup>
  );
}
