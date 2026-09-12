import { type ClassNameValue, cn } from "../utils/cn";

type HTMLAttrs<T> = Omit<T, "className"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export interface InputGroupProps extends HTMLAttrs<React.ComponentProps<"div">> {
  invalid?: boolean;
}

export function InputGroup({ className, invalid, ...props }: InputGroupProps) {
  return (
    <div
      {...props}
      data-invalid={invalid || props["data-invalid"]}
      className={cn(
        "group/input flex h-9 w-full max-w-sm rounded-md px-2 border items-center",
        "data-invalid:border-danger",
        "data-invalid:focus-within:outline-none data-invalid:focus-within:ring-3 data-invalid:focus-within:ring-danger/50",
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
        "group-data-invalid/input:text-danger",
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
