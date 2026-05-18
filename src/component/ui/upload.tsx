import * as React from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type UploadProps = Omit<
  ComponentProps<"input">,
  "type" | "className"
> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: string;
  className?: ClassNameValue;
  buttonText?: string;
  itemProps?: {
    root?: WithDataAttributes<ComponentProps<"div">>;
    label?: WithDataAttributes<ComponentProps<"label">>;
    description?: WithDataAttributes<ComponentProps<"small">>;
    invalid?: WithDataAttributes<ComponentProps<"small">>;
  };
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void | { invalid?: string };
};

export function Upload({
  className,
  label,
  description,
  invalid,
  disabled,
  itemProps,
  ...props
}: UploadProps) {
  const isInvalid = !!invalid;

  return (
    <div {...itemProps?.root} className={cn("flex flex-col gap-1", itemProps?.root?.className)}>
      {label && (
        <label
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none py-1 indent-2",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <input
        type="file"
        disabled={disabled}
        data-invalid={isInvalid}
        {...props}
        className={cn(
          "appearance-none outline-none h-9 font-medium text-sm border rounded-full",
          "file:bg-primary file:text-primary-foreground file:h-full  file:rounded-l-full file:px-3",
          "disabled:opacity-50 disabled:pointer-events-none",
          "data-[invalid=true]:border-destructive data-[invalid=true]:file:bg-destructive",
          className
        )}
      />

      <small
        data-invalid={isInvalid ? "true" : "false"}
        {...(isInvalid ? itemProps?.invalid : itemProps?.description)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground data-[invalid=true]:text-destructive",
          (isInvalid ? itemProps?.invalid : itemProps?.description)?.className,
        )}
        role={isInvalid ? "alert" : undefined}
      >
        {isInvalid ? invalid : description}
      </small>
    </div>
  );
}
