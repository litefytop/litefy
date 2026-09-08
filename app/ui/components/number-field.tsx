"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { type ClassNameValue, cn } from "..";
import { InputGroup, InputLeading, InputRoot, InputTrailing } from "./input-group";

export type NumberVariant = "default" | "embedded";

export interface NumberStepperProps
  extends Omit<React.ComponentProps<"button">, "className" | "type"> {
  className?: ClassNameValue;
  direction?: "up" | "down";
}

/**
 * Step button for the embedded NumberField. Renders a Plus (up) or Minus
 * (down) icon by default; `children` overrides the icon.
 */
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

type BaseNumberFieldProps = Omit<
  React.ComponentProps<"input">,
  "className" | "value" | "defaultValue" | "type" | "onChange"
> & {
  className?: ClassNameValue;
  invalid?: boolean;
  min?: number;
  max?: number;
  step?: number;
  indicator?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  thousands?: boolean;
  /**
   * `"default"` — bordered shell with a trailing step cue / suffix.
   * `"embedded"` — borderless inline field with clickable leading/trailing
   * steppers (Minus / Plus); `prefix`, `suffix` and `indicator` are ignored.
   */
  variant?: NumberVariant;
  classNames?: {
    leading?: ClassNameValue;
    trailing?: ClassNameValue;
    root?: ClassNameValue;
  };
  styles?: {
    leading?: React.CSSProperties;
    trailing?: React.CSSProperties;
    root?: React.CSSProperties;
  };
};

type PositiveIntegerMode = BaseNumberFieldProps & {
  positiveInteger: true;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value?: number) => void;
};

type NormalMode = BaseNumberFieldProps & {
  positiveInteger?: false;
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value?: string) => void;
};

export type NumberFieldProps = PositiveIntegerMode | NormalMode;

export function NumberField(props: NumberFieldProps) {
  const {
    positiveInteger = false,
    invalid,
    min = positiveInteger ? 0 : -Infinity,
    max = Infinity,
    step = 1,
    indicator = true,
    prefix,
    suffix,
    thousands = false,
    variant = "default",
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

  const isControlled = "value" in props;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(
    String(defaultValue ?? ""),
  );
  const [focused, setFocused] = React.useState(false);

  const value = isControlled ? String(controlledValue ?? "") : uncontrolledValue;

  // Authoritative latest value for imperative stepping: synchronous stepper
  // clicks re-render asynchronously, so the `value` closure goes stale between
  // rapid clicks and would swallow steps.
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
        (onValueChange as PositiveIntegerMode["onValueChange"])?.(num);
      } else {
        const val = newRawValue === "" ? undefined : newRawValue;
        (onValueChange as NormalMode["onValueChange"])?.(val);
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

  if (variant === "embedded") {
    return (
      <div
        data-invalid={invalid || undefined}
        className={cn(
          "group/input inline-flex h-9 items-center overflow-hidden rounded-md",
          "data-invalid:border data-invalid:border-danger",
          className,
        )}
        style={style}
      >
        <NumberStepper
          direction="down"
          aria-label="Decrease"
          disabled={disabled}
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
          disabled={disabled}
          onClick={() => stepDelta(step)}
        />
      </div>
    );
  }

  return (
    <InputGroup
      data-invalid={invalid || undefined}
      className={className}
      style={style}
    >
      {(prefix || classNames?.leading || styles?.leading) && (
        <InputLeading className={classNames?.leading} style={styles?.leading}>
          {prefix}
        </InputLeading>
      )}
      <InputRoot
        {...inputProps}
        aria-invalid={invalid}
        className={classNames?.root}
        style={styles?.root}
      />
      <InputTrailing className={cn("gap-1.5 pr-1", classNames?.trailing)} style={styles?.trailing}>
        {suffix ? (
          <span className="text-sm text-muted-foreground">{suffix}</span>
        ) : (
          indicator && (
            <span
              aria-hidden
              className="pointer-events-none flex shrink-0 select-none flex-col items-center justify-center leading-none text-muted-foreground/80"
            >
              <ChevronUp className="size-3 -mb-0.5" />
              <ChevronDown className="size-3" />
            </span>
          )
        )}
      </InputTrailing>
    </InputGroup>
  );
}
