import { ReactNode, useState } from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type NumberFieldProps = Omit<
  ComponentProps<"input">,
  "className" | "value" | "onChange" | "type"
> & {
  defaultValue?: number;
  value?: number | undefined;
  className?: ClassNameValue;
  label?: ReactNode;
  description?: ReactNode;
  invalid?: string;
  min?: number;
  max?: number;
  step?: number;
  itemProps?: {
    root?: WithDataAttributes<ComponentProps<"div">>;
    label?: WithDataAttributes<ComponentProps<"label">>;
    group?: WithDataAttributes<ComponentProps<"div">>;
    btn?: WithDataAttributes<ComponentProps<"button">>;
    desc?: WithDataAttributes<ComponentProps<"small">>;
    error?: WithDataAttributes<ComponentProps<"small">>;
  };
  onValueChange?: (val: number | undefined) => void | { invalid?: string };
};

export function NumberField({
  defaultValue,
  value: controlledValue,
  label,
  description,
  invalid: externalInvalid,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled,
  itemProps,
  onValueChange,
  ...props
}: NumberFieldProps) {
  const [internalValue, setInternalValue] = useState<number | undefined>(defaultValue);
  const [internalInvalid, setInternalInvalid] = useState<string>();

  const finalValue = controlledValue !== undefined ? controlledValue : internalValue;
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = !!finalInvalid;

  const updateValue = (val: number | undefined) => {
    let invalidMsg: string | undefined;

    if (val !== undefined) {
      if (val < min) invalidMsg = `Value must be at least ${min}`;
      if (val > max) invalidMsg = `Value must be at most ${max}`;
    }

    const clampedVal = val === undefined ? undefined : Math.max(min, Math.min(max, val));

    if (controlledValue === undefined) {
      setInternalValue(clampedVal);
    }

    const res = onValueChange?.(clampedVal);
    setInternalInvalid(invalidMsg ?? res?.invalid);
  };

  const handleMinus = () => updateValue((finalValue ?? 0) - step);
  const handlePlus = () => updateValue((finalValue ?? 0) + step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      updateValue(undefined);
      return;
    }

    const num = parseFloat(value);
    if (!isNaN(num)) {
      updateValue(num);
    }
  };

  return (
    <div {...itemProps?.root} className={cn("flex flex-col gap-1", itemProps?.root?.className)}>
      {label && (
        <label
          {...itemProps?.label}
          className={cn(
            "text-sm font-medium leading-none py-2 indent-2",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
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
          "border-input bg-background flex w-3xs items-center rounded-full border shadow-xs outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "data-[invalid=true]:border-destructive has-invalid:border-destructive",
          itemProps?.group?.className
        )}
      >
        <button
          {...itemProps?.btn}
          type="button"
          aria-label="Decrease"
          disabled={disabled}
          onClick={handleMinus}
          className={cn(
            "h-8 w-10 flex items-center justify-center text-muted-foreground hover:text-primary rounded-l-full border-r border-input",
            "disabled:opacity-50 disabled:pointer-events-none",
            itemProps?.btn?.className
          )}
        >
          −
        </button>

        <input
          {...props}
          type="text"
          inputMode="numeric"
          role="spinbutton"
          disabled={disabled}
          value={finalValue ?? ""}
          onChange={handleChange}
          className={cn(
            "outline-none border-0 bg-transparent w-full h-8 px-2 text-sm flex-1 text-center",
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground"
          )}
          aria-invalid={isInvalid}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={finalValue}
          data-invalid={isInvalid}
        />

        <button
          {...itemProps?.btn}
          type="button"
          aria-label="Increase"
          disabled={disabled}
          onClick={handlePlus}
          className={cn(
            "h-8 w-10 flex items-center justify-center text-muted-foreground hover:text-primary rounded-r-full border-l border-input",
            "disabled:opacity-50 disabled:pointer-events-none",
            itemProps?.btn?.className
          )}
        >
          +
        </button>
      </div>

      <small
        data-invalid={isInvalid}
        {...(isInvalid ? itemProps?.error : itemProps?.desc)}
        className={cn(
          "text-sm indent-2 h-5 text-muted-foreground data-[invalid=true]:text-destructive",
          (isInvalid ? itemProps?.error : itemProps?.desc)?.className
        )}
        role={isInvalid ? "alert" : undefined}
      >
        {isInvalid ? finalInvalid : description}
      </small>
    </div>
  );
}
