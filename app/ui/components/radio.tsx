"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface RadioProps extends Omit<React.ComponentProps<"input">, "type" | "className"> {
  className?: ClassNameValue;
  invalid?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indicator?: (checked: boolean, wrapperClassName?: string) => React.ReactNode;
}

export const Radio = ({
  children,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  indicator,
  className,
  style,
  invalid,
  id,
  ...props
}: RadioProps) => {
  const fallbackId = React.useId();
  const _id = id ?? fallbackId;
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked$ = isControlled ? controlledChecked : uncontrolledChecked;

  const handleChange = () => {
    if (checked$) return;
    if (!isControlled) setUncontrolledChecked(true);
    onCheckedChange?.(true);
  };

  return (
    <label
      htmlFor={_id}
      style={style}
      aria-invalid={invalid}
      data-invalid={invalid || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0 h-9 min-w-9 px-3 py-1 cursor-pointer select-none relative has-disabled:cursor-not-allowed has-disabled:opacity-50",
        "has-focus-visible:[&>*:first-child]:ring-2 has-focus-visible:[&>*:first-child]:ring-ring has-focus-visible:[&>*:first-child]:ring-offset-2",
        "data-invalid:text-destructive",
        className,
      )}
    >
      {indicator?.(
        checked$,
        "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 flex items-center justify-center",
      )}

      <input
        {...props}
        type="radio"
        id={_id}
        data-invalid={invalid || undefined}
        checked={checked$}
        onChange={handleChange}
        data-hidden={Boolean(indicator) || undefined}
        className={cn("accent-primary data-invalid:accent-destructive data-hidden:sr-only peer")}
      />
      {children}
    </label>
  );
};

export interface RadioOptionConfig extends Omit<RadioProps, "children"> {
  label: string;
  value: string;
}

export interface RadioGroupProps {
  options: RadioOptionConfig[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: ClassNameValue;
  common?: {
    className?: ClassNameValue;
    indicator?: RadioProps["indicator"];
  };
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  invalid,
  className,
  common,
}: RadioGroupProps) {
  const [_value, setValue] = React.useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const value$ = isControlled ? value : _value;

  const handleSelect = (val: string) => {
    if (!isControlled) setValue(val);
    onValueChange?.(val);
  };

  return (
    <div
      role="radiogroup"
      aria-invalid={invalid}
      data-invalid={invalid || undefined}
      className={cn("flex flex-col gap-2", className)}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          name={name}
          disabled={disabled || option.disabled}
          invalid={invalid || option.invalid}
          checked={value$ === option.value}
          onCheckedChange={() => handleSelect(option.value)}
          indicator={option.indicator ?? common?.indicator}
          className={option.className ?? common?.className}
        >
          {option.label}
        </Radio>
      ))}
    </div>
  );
}

Radio.Group = RadioGroup;
