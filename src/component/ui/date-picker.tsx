import * as React from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined;
  className?: ClassNameValue;
};

export type DatePickerProps = Omit<ComponentProps<"input">, "type"> & {
  className?: ClassNameValue;
  label?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: string | boolean;
  placeholder?: string;
  type?: "date" | "time" | "datetime-local" | "month" | "week";
  itemProps?: {
    root?: WithDataAttributes<ComponentProps<"div">>;
    label?: WithDataAttributes<ComponentProps<"label">>;
    description?: WithDataAttributes<ComponentProps<"small">>;
    invalid?: WithDataAttributes<ComponentProps<"small">>;
  };
};

export function DatePicker({
  label,
  description,
  invalid,
  placeholder = "Select",
  disabled,
  itemProps,
  onChange,
  value,
  className,
  type = "date",
  ...props
}: DatePickerProps) {
  const isInvalid = Boolean(invalid);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (value) el.setAttribute("value", value as string);
    else el.removeAttribute("value");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    const val = e.target.value;
    if (val) e.target.setAttribute("value", val);
    else e.target.removeAttribute("value");
  };

  return (
    <div
      {...itemProps?.root}
      className={cn("flex flex-col gap-1", itemProps?.root?.className)}
    >
      {label && (
        <label
          {...itemProps?.label}
          data-disabled={disabled}
          className={cn(
            "text-sm font-medium leading-none",
            "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-70 indent-2 py-1",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        ref={inputRef}
        type={type}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        data-placeholder={placeholder}
        data-invalid={isInvalid}
        className={cn(
          "h-9 w-full rounded-md border border-input bg-background px-3 relative",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "disabled:opacity-50 disabled:pointer-events-none",
          "data-[invalid=true]:border-destructive",
          "[&:not([value])::-webkit-datetime-edit]:opacity-0",
          "[&[value]]::-webkit-datetime-edit]:opacity-100",
          "[&:not([value])]:color-transparent",
          "before:content-[attr(data-placeholder)]",
          "before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2",
          "before:text-muted-foreground before:pointer-events-none",
          "[[value]]:before:content-['']",
          className,
        )}
      />

      <small
        data-invalid={isInvalid}
        {...(isInvalid ? itemProps?.invalid : itemProps?.description)}
        data-disabled={disabled}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground ",
          "data-[invalid=true]:text-destructive data-[disabled=true]:opacity-70",
          (isInvalid ? itemProps?.invalid : itemProps?.description)?.className,
        )}
        role={isInvalid ? "alert" : undefined}
      >
        {isInvalid ? invalid : description}
      </small>
    </div>
  );
}
