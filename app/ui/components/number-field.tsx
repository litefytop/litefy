"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";

export type NumberVariant = "default" | "embedded";

export interface NumberStepperProps
  extends Omit<React.ComponentProps<"button">, "className" | "type"> {
  className?: ClassNameValue;
  direction?: "up" | "down";
}

export function NumberStepper({ className, direction = "up", children, ...props }: NumberStepperProps) {
  return (
    <button
      {...props}
      type="button"
      tabIndex={-1}
      aria-label={direction === "up" ? "Increase" : "Decrease"}
      className={cn(
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-hover hover:text-foreground",
        className,
      )}
    >
      {children ?? (direction === "up" ? <Plus className="size-4" /> : <Minus className="size-4" />)}
    </button>
  );
}

export type NumberRootProps = Omit<React.ComponentProps<"input">, "className"> & {
  className?: ClassNameValue;
};

export function NumberRoot({ className, ...props }: NumberRootProps) {
  return (
    <input
      {...props}
      className={cn(
        "h-8 w-full min-w-0 flex-1 border-0 bg-transparent px-2 text-left text-sm ring-0 outline-none",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "group-data-invalid/input:text-danger",
        className,
      )}
    />
  );
}

export function groupThousands(numStr: string): string {
  if (numStr === "" || !/^-?\d+(\.\d*)?$/.test(numStr)) return numStr;
  const negative = numStr.startsWith("-");
  const body = negative ? numStr.slice(1) : numStr;
  const [intPart, decPart] = body.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}${grouped}${decPart !== undefined ? `.${decPart}` : ""}`;
}

type NumberCoreOptions = {
  positiveInteger: boolean;
  min: number;
  max: number;
  step: number;
  thousands: boolean;
  disabled?: boolean;
  defaultValue: string;
  onValueChange: ((value?: number) => void) | ((value?: string) => void) | undefined;
  controlledValue: string | number | undefined;
  isControlled: boolean;
  rest: Record<string, unknown> & {
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  };
};

export function useNumberCore(opts: NumberCoreOptions) {
  const {
    positiveInteger,
    min,
    max,
    step,
    thousands,
    disabled,
    defaultValue,
    onValueChange,
    controlledValue,
    isControlled,
    rest,
  } = opts;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(
    String(defaultValue ?? ""),
  );
  const [focused, setFocused] = React.useState(false);

  const value = isControlled ? String(controlledValue ?? "") : uncontrolledValue;

  
  
  
  const valueRef = React.useRef(value);
  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const normalize = React.useCallback(
    (str: string): string => {
      const trimmed = str.trim();
      if (trimmed === "") return "";
      let num = parseFloat(trimmed);
      if (Number.isNaN(num)) return "";
      if (positiveInteger) {
        num = Math.floor(num);
        if (num < 0) num = 0;
      }
      if (num < min) num = min;
      if (num > max) num = max;
      return String(num);
    },
    [min, max, positiveInteger],
  );

  const emitChange = React.useCallback(
    (newRawValue: string) => {
      valueRef.current = newRawValue;
      if (!isControlled) {
        setUncontrolledValue(newRawValue);
      }
      if (positiveInteger) {
        const num = newRawValue === "" ? undefined : parseInt(newRawValue, 10);
        (onValueChange as (value?: number) => void)?.(num);
      } else {
        const val = newRawValue === "" ? undefined : newRawValue;
        (onValueChange as (value?: string) => void)?.(val);
      }
    },
    [isControlled, positiveInteger, onValueChange],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (positiveInteger) {
      if (!/^\d*$/.test(raw)) return;
    } else {
      const regex = /^-?[0-9]*\.?[0-9]*$/;
      if (!regex.test(raw)) return;
    }
    emitChange(raw);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    const current = valueRef.current;
    const normalized = normalize(current);
    if (normalized !== current) {
      emitChange(normalized);
    }
    rest.onBlur?.(e);
  };

  const stepDelta = React.useCallback(
    (delta: number) => {
      const current = valueRef.current;
      let currentNum: number;
      if (positiveInteger) {
        currentNum = current === "" ? 0 : parseInt(current, 10);
      } else {
        currentNum = parseFloat(current);
        if (Number.isNaN(currentNum)) currentNum = 0;
      }

      let newNum = currentNum + delta;
      if (positiveInteger) {
        newNum = Math.floor(newNum);
      } else {
        const stepStr = String(step);
        const decimalMatch = stepStr.match(/\.(\d+)$/);
        const decimalPlaces = decimalMatch ? decimalMatch[1].length : 0;
        const factor = 10 ** decimalPlaces;
        const scaledCurrent = Math.round(currentNum * factor);
        const scaledDelta = delta * factor;
        newNum = (scaledCurrent + scaledDelta) / factor;
      }

      if (newNum < min) newNum = min;
      if (newNum > max) newNum = max;

      emitChange(String(newNum));
    },
    [min, max, positiveInteger, step, emitChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      stepDelta(step);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      stepDelta(-step);
    }
    rest.onKeyDown?.(e);
  };

  const safeMin = Number.isFinite(min) ? min : undefined;
  const safeMax = Number.isFinite(max) ? max : undefined;
  const numValue = value === "" ? undefined : parseFloat(value);
  const valuenow = numValue !== undefined && !Number.isNaN(numValue) ? numValue : undefined;
  const displayValue = thousands && !focused ? groupThousands(value) : value;

  const canDecrement = !disabled && (valuenow ?? 0) > min;
  const canIncrement = !disabled && (valuenow ?? 0) < max;

  const inputProps = {
    ...rest,
    type: "text" as const,
    inputMode: positiveInteger ? ("numeric" as const) : ("decimal" as const),
    role: "spinbutton" as const,
    disabled,
    value: displayValue,
    onChange: handleChange,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      rest.onFocus?.(e);
    },
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    "aria-valuemin": safeMin,
    "aria-valuemax": safeMax,
    "aria-valuenow": valuenow,
  };

  return { inputProps, stepDelta, canDecrement, canIncrement };
}

export type NumberFieldProps = Omit<
  React.ComponentProps<"input">,
  "className" | "value" | "defaultValue" | "type" | "onChange" | "size" | "prefix"
> & {
  value?: number | string;
  defaultValue?: number | string;
  invalid?: boolean;
  variant?: NumberVariant;
  min?: number;
  max?: number;
  step?: number;
  thousands?: boolean;
  positiveInteger?: boolean;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: {
    root?: ClassNameValue;
  };
  styles?: {
    root?: React.CSSProperties;
  };
  disabled?: boolean;
  onValueChange?: ((value?: number) => void) | ((value?: string) => void);
};

export function NumberField(props: NumberFieldProps) {
  const {
    positiveInteger = false,
    invalid,
    variant = "default",
    min = positiveInteger ? 0 : -Infinity,
    max = Infinity,
    step = 1,
    thousands = false,
    className,
    style,
    classNames,
    styles,
    disabled,
    defaultValue = "",
    onValueChange,
    value: controlledValue,
    ...rest
  } = props;

  const { inputProps, stepDelta, canDecrement, canIncrement } = useNumberCore({
    positiveInteger,
    min,
    max,
    step,
    thousands,
    disabled,
    defaultValue: String(defaultValue ?? ""),
    onValueChange: onValueChange as NumberCoreOptions["onValueChange"],
    controlledValue,
    isControlled: "value" in props,
    rest: rest as NumberCoreOptions["rest"],
  });

  const bordered = variant !== "embedded";

  return (
    <div
      data-invalid={invalid || undefined}
      className={cn(
        "group/input inline-flex h-9 items-center overflow-hidden rounded-md",
        bordered && "border border-border",
        "data-invalid:border data-invalid:border-danger",
        className,
      )}
      style={style}
    >
      <NumberStepper
        direction="down"
        aria-label="Decrease"
        disabled={disabled || !canDecrement}
        onClick={() => stepDelta(-step)}
      />
      <NumberRoot
        {...inputProps}
        aria-invalid={invalid}
        className={cn("w-16 text-center px-1", classNames?.root)}
        style={styles?.root}
      />
      <NumberStepper
        direction="up"
        aria-label="Increase"
        disabled={disabled || !canIncrement}
        onClick={() => stepDelta(step)}
      />
    </div>
  );
}
