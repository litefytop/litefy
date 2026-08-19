"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = T & {
  [key: `data-${string}`]: string | number | true | null | undefined;
  className?: ClassNameValue;
};

type BaseNumberFieldProps = Omit<
  React.ComponentProps<"input">,
  "className" | "value" | "defaultValue" | "type" | "onChange"
> & {
  className?: ClassNameValue;
  invalid?: boolean;
  min?: number;
  max?: number;
  step?: number;
  slotProps?: {
    group?: HTMLAttrs<React.ComponentProps<"div">>;
    stepDown?: HTMLAttrs<React.ComponentProps<"button">>;
    stepUp?: HTMLAttrs<React.ComponentProps<"button">>;
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
    className,
    invalid,
    min = positiveInteger ? 0 : -Infinity,
    max = Infinity,
    step = 1,
    slotProps,
    disabled,
    inert,
    defaultValue = "",
    onValueChange,
    value: controlledValue,
    ...rest
  } = props;

  const isControlled = "value" in props;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(
    String(defaultValue ?? ""),
  );

  const value = isControlled
    ? String(controlledValue ?? "")
    : uncontrolledValue;

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
    const raw = e.target.value;
    if (positiveInteger) {
      if (!/^\d*$/.test(raw)) return;
    } else {
      const regex = /^-?[0-9]*\.?[0-9]*$/;
      if (!regex.test(raw)) return;
    }
    emitChange(raw);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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

      const newStr = String(newNum);
      emitChange(newStr);
    },
    [value, min, max, positiveInteger, step, emitChange],
  );

  const handleMinus = () => stepDelta(-step);
  const handlePlus = () => stepDelta(step);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handlePlus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleMinus();
    }
    rest.onKeyDown?.(e);
  };

  const safeMin = Number.isFinite(min) ? min : undefined;
  const safeMax = Number.isFinite(max) ? max : undefined;
  const numValue = value === "" ? undefined : parseFloat(value);
  const valuenow =
    numValue !== undefined && !Number.isNaN(numValue) ? numValue : undefined;

  return (
    <div
      {...slotProps?.group}
      data-invalid={invalid || undefined}
      inert={disabled || inert}
      className={cn(
        "group border-input bg-background flex w-3xs items-center rounded-full border shadow-xs outline-none",
        "invalid:cursor-not-allowed invalid:opacity-50",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-invalid:border-destructive/70 data-invalid:ring-destructive/20",
        slotProps?.group?.className,
      )}
    >
      <button
        {...slotProps?.stepDown}
        type="button"
        aria-label="Decrease"
        disabled={disabled || valuenow === min}
        onClick={handleMinus}
        className={cn(
          "size-9 flex items-center justify-center text-muted-foreground hover:text-primary rounded-l-full border-r border-input",
          "group-data-invalid:border-destructive/70",
          slotProps?.stepDown?.className,
        )}
      >
        −
      </button>

      <input
        {...rest}
        type="text"
        inputMode={positiveInteger ? "numeric" : "decimal"}
        pattern={positiveInteger ? "[0-9]*" : "-?[0-9]*\\.?[0-9]*"}
        aria-invalid={invalid}
        role="spinbutton"
        disabled={disabled}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "outline-none border-0 bg-transparent w-full h-8 px-2 text-sm flex-1 text-center",
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "group-aria-invalid:border-destructive/70",
          className,
        )}
        aria-valuemin={safeMin}
        aria-valuemax={safeMax}
        aria-valuenow={valuenow}
      />

      <button
        {...slotProps?.stepUp}
        type="button"
        aria-label="Increase"
        disabled={disabled || valuenow === max}
        onClick={handlePlus}
        className={cn(
          "size-9 flex items-center justify-center text-muted-foreground hover:text-primary rounded-r-full border-l border-input",
          "group-data-invalid:border-destructive/70",
          slotProps?.stepUp?.className,
        )}
      >
        +
      </button>
    </div>
  );
}
