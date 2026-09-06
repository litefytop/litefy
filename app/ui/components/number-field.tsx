"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type ClassNameValue, cn } from "..";
import { InputGroup, InputLeading, InputRoot, InputTrailing } from "./input";

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
        // The group carries the invalid border/ring; the input itself stays bare.
        "aria-invalid:text-danger",
        "disabled:cursor-not-allowed disabled:opacity-50",
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
  /** Non-interactive up/down cue in the trailing area — signals keyboard stepping. Always shown. */
  indicator?: boolean;
  /** Content rendered before the number (e.g. a currency symbol). */
  prefix?: React.ReactNode;
  /** Content rendered after the number, before the stepping cue. */
  suffix?: React.ReactNode;
  /** Group the integer part with thousands separators while the input is not focused. */
  thousands?: boolean;
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
    const normalized = normalize(value);
    if (normalized !== value) {
      emitChange(normalized);
    }
    rest.onBlur?.(e);
  };

  const stepDelta = React.useCallback(
    (delta: number) => {
      let currentNum: number;
      if (positiveInteger) {
        currentNum = value === "" ? 0 : parseInt(value, 10);
      } else {
        currentNum = parseFloat(value);
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
    [value, min, max, positiveInteger, step, emitChange],
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
        {...rest}
        type="text"
        inputMode={positiveInteger ? "numeric" : "decimal"}
        aria-invalid={invalid}
        role="spinbutton"
        disabled={disabled}
        value={displayValue}
        onChange={handleChange}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={classNames?.root}
        style={styles?.root}
        aria-valuemin={safeMin}
        aria-valuemax={safeMax}
        aria-valuenow={valuenow}
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
