import type { ReactNode } from "react";
import { type ClassNameValue, cn } from "..";

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
        "flex h-9 w-full max-w-sm rounded-md px-2 border bg-background/90 items-center",
        "focus-within:ring-inset focus-within:ring-ring focus-within:ring-1",
        "data-invalid:border-danger",
        "data-invalid:focus-within:outline-1 data-invalid:focus-within:outline-danger data-invalid:focus-within:ring-3 data-invalid:focus-within:ring-danger/50",
        "has-[[aria-invalid=true]]:border-danger",
        "has-[[aria-invalid=true]]:focus-within:outline-1 has-[[aria-invalid=true]]:focus-within:outline-danger has-[[aria-invalid=true]]:focus-within:ring-3 has-[[aria-invalid=true]]:focus-within:ring-danger/50",
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

export type InputRootProps = Omit<React.ComponentProps<"input">, "className"> & {
  className?: ClassNameValue;
};

export function InputRoot({ className, ...props }: InputRootProps) {
  return (
    <input
      {...props}
      className={cn(
        "flex-1 border-0 ring-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "aria-invalid:border-danger aria-invalid:text-danger",
        "aria-invalid:focus-visible:outline-1 aria-invalid:focus-visible:outline-danger aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-danger/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
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
  className?: ClassNameValue;
  leading?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
  classNames?: {
    leading?: ClassNameValue;
    trailing?: ClassNameValue;
    root?: ClassNameValue;
  };
  styles?: {
    group?: React.CSSProperties;
    leading?: React.CSSProperties;
    trailing?: React.CSSProperties;
    root?: React.CSSProperties;
  };
};

export function Input({ classNames, styles, leading, trailing, invalid, className, ...props }: InputProps) {
  return (
    <InputGroup
      className={className}
      style={styles?.group}
      data-invalid={invalid || undefined}
    >
      {leading && (
        <InputLeading className={classNames?.leading} style={styles?.leading}>
          {leading}
        </InputLeading>
      )}
      <InputRoot
        {...props}
        aria-invalid={invalid}
        className={classNames?.root}
        style={styles?.root}
      />
      {trailing && (
        <InputTrailing className={classNames?.trailing} style={styles?.trailing}>
          {trailing}
        </InputTrailing>
      )}
    </InputGroup>
  );
}
