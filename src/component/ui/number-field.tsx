import { ReactNode, useId, useState } from "react";
import { cn, ClassNameValue } from "@/lib";
import { ComponentProps } from "react";

type WithDataAttributes<T> = T & {
  [key: `data-${string}`]: string | number | true | null | undefined;
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
    description?: WithDataAttributes<ComponentProps<"small">>;
    invalid?: WithDataAttributes<React.ComponentProps<"small">>;
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
  const [internalInvalid, setInternalInvalid] = useState<string>();
  const internalId = useId();
  const inputId = props?.id || internalId;
  const finalInvalid = externalInvalid ?? internalInvalid;
  const isInvalid = !!finalInvalid;
  const hasInvalidContent = typeof finalInvalid === "string";

  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() =>
    defaultValue !== undefined ? String(defaultValue) : "",
  );
  const inputValue = controlledValue?.toString() ?? uncontrolledValue;

  const stepDelta = (delta: number) => {
    const currentNum = parseFloat(inputValue);
    if (isNaN(currentNum)) {
      setInputValue("0");
    } else {
      setInputValue(String(currentNum + delta));
    }
  };

  const handleMinus = () => stepDelta(-step);
  const handlePlus = () => stepDelta(step);

  const setInputValue = (str: string) => {
    const currentNum = parseFloat(str);
    if (currentNum < min) {
    
       if (onValueChange) {
        onValueChange(String(min) as unknown as number);
      } else {
        setUncontrolledValue(String(min));
      }
      setInternalInvalid("Value below minimum");
    } else if (currentNum > max) {
        if (onValueChange) {
        onValueChange(String(max) as unknown as number);
      } else {
        setUncontrolledValue(String(max));
      }
      setInternalInvalid("Value above maximum");
    } else {
      if (onValueChange) {
        onValueChange(str as unknown as number);
      } else {
        setUncontrolledValue(str);
      }
      setInternalInvalid(undefined);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!/^-?[0-9]*\.?[0-9]*$/.test(raw)) {
      setInternalInvalid("Invalid number");
      return;
    }
    setInputValue(raw);
  };

  return (
    <div
      {...itemProps?.root}
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

      <div
        {...itemProps?.group}
        className={cn(
          "border-input bg-background flex w-3xs items-center rounded-full border shadow-xs outline-none",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "group-data-invalid:border-destructive",
          itemProps?.group?.className,
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
            itemProps?.btn?.className,
          )}
        >
          −
        </button>

        <input
          {...props}
          id={inputId}
          type="text"
          inputMode="decimal"
          pattern="-?[0-9]*(\.[0-9]+)?"
          role="spinbutton"
          disabled={disabled}
          value={inputValue}
          onChange={handleChange}
          className={cn(
            "outline-none border-0 bg-transparent w-full h-8 px-2 text-sm flex-1 text-center",
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          )}
          aria-invalid={isInvalid}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={parseFloat(inputValue) || undefined}
        />

        <button
          {...itemProps?.btn}
          type="button"
          aria-label="Increase"
          disabled={disabled}
          onClick={handlePlus}
          className={cn(
            "h-8 w-10 flex items-center justify-center text-muted-foreground hover:text-primary rounded-r-full border-l border-input",
            itemProps?.btn?.className,
          )}
        >
          +
        </button>
      </div>

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
