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
        "flex",
        className
      )}
    />
  );
}

export type InputLeadingProps = HTMLAttrs<React.ComponentProps<"span">>;
export function InputLeading({ className, ...props }: InputLeadingProps) {
  return (
    <span
      {...props}
      className={cn(
        "shrink-0",
        className
      )}
    />
  );
}

export type InputTrailingProps = HTMLAttrs<React.ComponentProps<"span">>;
export function InputTrailing({ className, ...props }: InputTrailingProps) {
  return (
    <span
      {...props}
      className={cn(
        "shrink-0",
        className
      )}
    />
  );
}

export type InputFieldProps = Omit<React.ComponentProps<"input">, "type"|"className"> & {
  type?: "text" | "email" | "url" | "tel" | "search";
  className?: ClassNameValue;
};
export function InputField({ className, ...props }: InputFieldProps) {
  return (
    <input
      {...props}
      className={cn(
        "appearance-none",
        className
      )}
    />
  );
}

export type InputProps = Omit<React.ComponentProps<"input">, "type"> & {
  type?: "text" | "email" | "url" | "tel" | "search";
  value?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  invalid?: boolean;
  slotProps?: {
    group?: InputGroupProps;
    leading?: InputLeadingProps;
    trailing?: InputTrailingProps;
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
    <InputGroup
      {...slotProps?.group}
      inert={props.inert || disabled}
      data-invalid={invalid || undefined}
      className={[" h-9 rounded-md w-sm px-2 border shadow-xs outline-none border-input bg-background items-center",
        "focus-within:ring-inset focus-within:ring-ring focus-within:ring-1",
        "data-invalid:border-destructive-accent data-invalid:ring-destructive-accent",
        slotProps?.group?.className]}
    >
      {leading && (
        <InputLeading {...slotProps?.leading} className={["text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 px-2",slotProps?.leading?.className]}>
          {leading}
        </InputLeading>
      )}
      <InputField
        {...props}
        disabled={disabled}
        aria-invalid={invalid}
        className={["flex-1 outline-none border-0 ring-0 bg-transparent px-2 py-1 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground", className]}
      />
      {trailing && (
        <InputTrailing {...slotProps?.trailing} className={["text-muted-foreground [&>svg]:w-4 [&>svg]:h-4 px-2",slotProps?.trailing?.className]}>
          {trailing}
        </InputTrailing>
      )}
    </InputGroup>
  );
}
