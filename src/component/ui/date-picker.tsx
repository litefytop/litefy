import * as React from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export type DatePickerProps = Omit<
  ComponentProps<"input">,
  "type" | "onChange"
> & {
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
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void | { invalid: string | boolean };
};

export function DatePicker({
  label,
  description,
  placeholder,
  disabled,
  itemProps,
  onChange,
  value,
  className,
  type = "date",
  invalid: externalInvalid,
  ...props
}: DatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalInvalid, setInternalInvalid] = React.useState<
    boolean | string | undefined
  >();
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);
  const hasInvalidContent = typeof finalInvalid === "string";
  const internalId = React.useId();
  const inputId = props?.id || internalId;
  React.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (value) el.setAttribute("value", value as string);
    else el.removeAttribute("value");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = onChange?.(e);
    setInternalInvalid(result?.invalid);
    const val = e.target.value;

    if (val) e.target.setAttribute("value", val);
    else e.target.removeAttribute("value");
  };

  return (
    <div
      {...itemProps?.root}
      inert={disabled}
      data-invalid={isInvalid ? true : undefined}
      className={cn(
        "flex flex-col gap-1 group inert:cursor-not-allowed inert:opacity-50",
        itemProps?.root?.className,
      )}
    >
      {label && (
        <label
          {...itemProps?.label}
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium leading-none indent-2 py-1 select-none",
            itemProps?.label?.className,
          )}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        ref={inputRef}
        type={type}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        data-placeholder={placeholder}
        className={cn(
          "h-9 w-full rounded-md border border-input bg-background px-3 relative",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:opacity-50 disabled:pointer-events-none",
          "group-data-invalid:border-destructive",
          "invalid:border-destructive invalid:focus:ring-destructive",
          "[&:not([value])::-webkit-datetime-edit]:opacity-0 invalid:[&:not([value])::-webkit-datetime-edit]:opacity-100",
          "[[value]::-webkit-datetime-edit]:opacity-100",
          "before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:text-muted-foreground before:pointer-events-none",
          "before:content-[attr(data-placeholder)] [[value]]:before:content-[''] invalid:before:content-['']",
          className,
        )}
      />

      <small
        {...(hasInvalidContent ? itemProps?.invalid : itemProps?.description)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground",
          "group-data-invalid:text-destructive",
          (hasInvalidContent ? itemProps?.invalid : itemProps?.description)
            ?.className,
        )}
        role={hasInvalidContent ? "alert" : undefined}
      >
        {hasInvalidContent ? finalInvalid : description}
      </small>
    </div>
  );
}
