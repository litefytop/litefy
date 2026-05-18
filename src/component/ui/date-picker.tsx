import * as React from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined;
  className?: ClassNameValue;
};

export type DatePickerProps = Omit<
  ComponentProps<"input">,
  "type" | "className"
> & {
  label?: React.ReactNode;
  description?: React.ReactNode;
  invalid?: string;
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
  type = "date",
  ...props
}: DatePickerProps) {
  const isInvalid = !!invalid;
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
    <div {...itemProps?.root} className={cn("flex flex-col gap-1")}>
      {label && (
        <label
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none py-1 indent-2",
            itemProps?.label?.className
          )}
        >
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type={type}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        data-placeholder={placeholder}
        {...props}
        className={cn(
          "h-10 w-full rounded-md border border-input bg-background px-3 text-sm relative",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          disabled && "opacity-50 pointer-events-none",
          isInvalid && "border-destructive",

          // 全浏览器原生占位隐藏
          "[&:not([value])::-webkit-datetime-edit]:opacity-0",
          "[&[value]]::-webkit-datetime-edit]:opacity-100",
          "[&:not([value])]:color-transparent",
          "[[value]]:text-inherit",

          // 自定义 placeholder
          "before:content-[attr(data-placeholder)]",
          "before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2",
          "before:text-muted-foreground before:pointer-events-none",
          "[[value]]:before:content-['']",
        )}
      />

      <small
        data-invalid={isInvalid}
        {...(isInvalid ? itemProps?.invalid : itemProps?.description)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground data-[invalid=true]:text-destructive",
          (isInvalid ? itemProps?.invalid : itemProps?.description)?.className
        )}
        role={isInvalid ? "alert" : undefined}
      >
        {isInvalid ? invalid : description}
      </small>
    </div>
  );
}
