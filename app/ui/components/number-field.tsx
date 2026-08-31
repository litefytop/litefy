"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export type NumberGroupProps = Omit<React.ComponentProps<"div">, "className"> & {
  className?: ClassNameValue;
};
export function NumberGroup({ className, ...props }: NumberGroupProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-3xs items-center rounded-full border border-border",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-invalid:border-destructive-accent data-invalid:ring-destructive data-invalid:text-destructive",
        className,
      )}
    />
  );
}

export type NumberDecrementProps = Omit<React.ComponentProps<"button">, "className"> & {
  className?: ClassNameValue;
};
export function NumberDecrement({ className, ...props }: NumberDecrementProps) {
  return (
    <button
      type="button"
      aria-label="Decrease"
      {...props}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-l-full hover:text-primary",
        className,
      )}
    />
  );
}

export type NumberIncrementProps = Omit<React.ComponentProps<"button">, "className"> & {
  className?: ClassNameValue;
};
export function NumberIncrement({ className, ...props }: NumberIncrementProps) {
  return (
    <button
      type="button"
      aria-label="Increase"
      {...props}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-r-full hover:text-primary",
        className,
      )}
    />
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
        "h-8 w-full min-w-0 flex-1 border-0 bg-transparent px-2 text-center text-sm ring-0",
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        className,
      )}
    />
  );
}

type BaseNumberFieldProps = Omit<
  React.ComponentProps<"input">,
  "className" | "value" | "defaultValue" | "type" | "onChange"
> & {
  invalid?: boolean;
  min?: number;
  max?: number;
  step?: number;
  classNames?: {
    group?: ClassNameValue;
    decrement?: ClassNameValue;
    increment?: ClassNameValue;
    root?: ClassNameValue;
  };
  styles?: {
    group?: React.CSSProperties;
    decrement?: React.CSSProperties;
    increment?: React.CSSProperties;
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
  const valuenow = numValue !== undefined && !Number.isNaN(numValue) ? numValue : undefined;

  return (
    <NumberGroup
      data-invalid={invalid || undefined}
      className={classNames?.group}
      style={styles?.group}
    >
      <NumberDecrement
        disabled={disabled || valuenow === min}
        onClick={handleMinus}
        className={classNames?.decrement}
        style={styles?.decrement}
      >
        −
      </NumberDecrement>
      <NumberRoot
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
        className={classNames?.root}
        style={styles?.root}
        aria-valuemin={safeMin}
        aria-valuemax={safeMax}
        aria-valuenow={valuenow}
      />
      <NumberIncrement
        disabled={disabled || valuenow === max}
        onClick={handlePlus}
        className={classNames?.increment}
        style={styles?.increment}
      >
        +
      </NumberIncrement>
    </NumberGroup>
  );
}
