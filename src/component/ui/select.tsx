import { ClassNameValue, cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useState } from "react";
import { CaretDownIcon } from "./icons";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
};

export type SelectProps = Omit<
  React.ComponentProps<"select">,
  "className" | "value" | "onChange"
> & {
  value?: string;
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: ReactNode;
  options: { label: string; value: string }[];
  placeholder?: string;
  itemProps?: {
    label?: WithDataAttributes<React.ComponentProps<"label">>;
    group?: WithDataAttributes<React.ComponentProps<"div">>;
    invalid?: WithDataAttributes<React.ComponentProps<"div">>;
    description?: WithDataAttributes<React.ComponentProps<"small">>;
  };
  onChange?: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void | { invalid?: string };
};

export function Select({
  className,
  label,
  description,
  invalid: externalInvalid,
  options,
  placeholder,
  itemProps,
  onChange,
  value,
  ...props
}: SelectProps) {
  const [internalInvalid, setInternalInvalid] = useState<string | undefined>();

  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = Boolean(finalInvalid);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const res = onChange?.(e);
    setInternalInvalid(res?.invalid);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1 indent-2",
            itemProps?.label?.className
          )}
        >
          {label}
        </label>
      )}
      <div
        {...itemProps?.group}
        data-invalid={isInvalid}
        className={cn(
          "border-input bg-background flex w-full items-center rounded-md border shadow-xs outline-none has-[>select:disabled]:pointer-events-none has-[>select:disabled]:cursor-not-allowed has-[>select:disabled]:opacity-50 data-[invalid=true]:ring-destructive/20 data-[invalid=true]:border-destructive",
          itemProps?.group?.className
        )}
      >
        <select
          {...props}
          value={value}
          onChange={handleChange}
          className={cn(
            "appearance-none outline-none w-full h-8 px-2 py-1 text-sm flex-1 min-w-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground data-[invalid=false]:focus-visible:border-ring data-[invalid=false]:focus-visible:ring-ring/50 data-[invalid=false]:focus-visible:ring-[3px]"
          )}
          aria-invalid={isInvalid}
          data-invalid={isInvalid}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none flex items-center pr-2 text-muted-foreground">
          <CaretDownIcon className="size-4 shrink-0" />
        </div>
      </div>
      {finalInvalid && (
        <div
          {...itemProps?.invalid}
          className={cn(
            "text-sm font-medium text-destructive py-1 indent-2",
            itemProps?.invalid?.className
          )}
        >
          {finalInvalid}
        </div>
      )}
      {description && !finalInvalid && (
        <small
          {...itemProps?.description}
          className={cn(
            "text-sm text-muted-foreground py-1 indent-2",
            itemProps?.description?.className
          )}
        >
          {description}
        </small>
      )}
    </div>
  );
}
