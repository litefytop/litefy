import { ComponentProps, useState, useCallback } from "react";
import { cn, ClassNameValue } from "@/lib";

type HTMLAttrs<T> = T & {
  [key: `data-${string}`]: string | number | true | null | undefined;
  className?: ClassNameValue;
};

export type NumberFieldProps = Omit<
  ComponentProps<"input">,
  "className" | "value" | "type" | "onChange"
> & {
  defaultValue?: number | string;
  value?: string;
  className?: ClassNameValue;
  invalid?: boolean;
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
  slotProps?: {
    group?: HTMLAttrs<ComponentProps<"div">>;
    btn?: HTMLAttrs<ComponentProps<"button">>;
  };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export function NumberField({
  defaultValue = 0,
  value: controlledValue,
  invalid,
  min = -Infinity,
  max = Infinity,
  step = 1,
  integer = false,
  disabled,
  inert,
  slotProps,
  onChange,
  onBlur,
  ...props
}: NumberFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() =>
    defaultValue !== undefined ? String(defaultValue) : ""
  );
  const inputValue = controlledValue !== undefined ? String(controlledValue) : uncontrolledValue;

  const normalizeValue = useCallback(
    (str: string): string => {
      const trimmed = str.trim();
      if (trimmed === "" || trimmed === "-") return "";
      let num = parseFloat(trimmed);
      if (isNaN(num)) return "";
      if (integer) {
        num = Math.round(num);
      }
      if (num < min) num = min;
      if (num > max) num = max;
      return String(num);
    },
    [min, max, integer]
  );

  const emitChange = useCallback(
    (newRawValue: string, originalEvent?: React.ChangeEvent<HTMLInputElement>) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(newRawValue);
      }
      if (onChange) {
        const fakeEvent = (originalEvent ||
          { target: { value: newRawValue }, currentTarget: { value: newRawValue } }) as React.ChangeEvent<HTMLInputElement>;
        if (!originalEvent) {
          Object.defineProperty(fakeEvent.target, "value", {
            value: newRawValue,
            writable: true,
            configurable: true,
          });
        }
        onChange(fakeEvent);
      }
    },
    [controlledValue, onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const regex = integer ? /^-?[0-9]*$/ : /^-?[0-9]*\.?[0-9]*$/;
    if (!regex.test(raw)) return;
    emitChange(raw, e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const normalized = normalizeValue(inputValue);
    if (normalized !== inputValue) {
      emitChange(normalized);
    }
    onBlur?.(e);
  };

  const stepDelta = (delta: number) => {
    const currentNum = parseFloat(inputValue);
    if (isNaN(currentNum)) return;
    let newNum = currentNum + delta;
    if (integer) {
      newNum = Math.round(newNum);
    }
    if (newNum < min) newNum = min;
    if (newNum > max) newNum = max;
    const newStr = String(newNum);
    emitChange(newStr);
  };

  const handleMinus = () => stepDelta(-step);
  const handlePlus = () => stepDelta(step);

  return (
    <div
      {...slotProps?.group}
      data-invalid={invalid ? true : undefined}
      aria-invalid={invalid}
      inert={disabled || inert}
      className={cn(
        "group border-input bg-background flex w-3xs items-center rounded-full border shadow-xs outline-none",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-invalid:border-destructive/70",
        slotProps?.group?.className
      )}
    >
      <button
        {...slotProps?.btn}
        type="button"
        aria-label="Decrease"
        disabled={disabled}
        onClick={handleMinus}
        className={cn(
          "size-9 flex items-center justify-center text-muted-foreground hover:text-primary rounded-l-full border-r border-input",
          "group-data-invalid:border-destructive/70",
          slotProps?.btn?.className
        )}
      >
        −
      </button>

      <input
        {...props}
        type="text"
        inputMode="decimal"
        pattern="-?[0-9]*(\.[0-9]+)?"
        role="spinbutton"
        disabled={disabled}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          "outline-none border-0 bg-transparent w-full h-8 px-2 text-sm flex-1 text-center",
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "group-data-invalid:border-destructive/70"
        )}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={parseFloat(inputValue) || undefined}
      />

      <button
        {...slotProps?.btn}
        type="button"
        aria-label="Increase"
        disabled={disabled}
        onClick={handlePlus}
        className={cn(
          "size-9 flex items-center justify-center text-muted-foreground hover:text-primary rounded-r-full border-l border-input",
          "group-data-invalid:border-destructive/70",
          slotProps?.btn?.className
        )}
      >
        +
      </button>
    </div>
  );
}
