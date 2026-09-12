"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { FormContext } from "./form";

export interface RadioRootProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "className"
> {
  className?: ClassNameValue;
}

export function RadioRoot({ className, ...props }: RadioRootProps) {
  return <input {...props} type="radio" className={cn("sr-only peer", className)} />;
}

export interface RadioIndicatorProps extends Omit<React.ComponentProps<"span">, "className"> {
  className?: ClassNameValue;
}

export function RadioIndicator({ className, children, ...props }: RadioIndicatorProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center justify-center min-w-4 min-h-4 rounded-full border border-border",
        "has-focus-visible:ring-3 has-focus-visible:ring-ring has-focus-visible:outline-1 has-focus-visible:outline-outline",
        "transition-colors duration-300 has-checked:border-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface RadioLabelProps extends Omit<React.ComponentProps<"label">, "className"> {
  className?: ClassNameValue;
}

export function RadioLabel({ className, children, ...props }: RadioLabelProps) {
  return (
    <label {...props} className={cn("flex items-center gap-2 select-none", className)}>
      {children}
    </label>
  );
}

export interface RadioProps extends Omit<RadioRootProps, "className" | "style"> {
  className?: ClassNameValue;
  style?: React.CSSProperties;
  onCheckedChange?: (checked: boolean) => void;
  indicator?: React.ReactNode;
  classNames?: {
    indicator?: ClassNameValue;
    label?: ClassNameValue;
  };
  styles?: {
    indicator?: React.CSSProperties;
    label?: React.CSSProperties;
  };
}

export const Radio = ({
  className,
  style,
  children,
  checked,
  defaultChecked,
  onChange,
  onCheckedChange,
  disabled,
  classNames,
  styles,
  indicator,
  ...props
}: RadioProps) => {
  const [_checked, setChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const checked$ = isControlled ? checked : _checked;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (e.target.checked) {
      if (!isControlled) setChecked(true);
      onCheckedChange?.(true);
    }
  };
  return (
    <RadioLabel
      className={cn(classNames?.label, className)}
      style={style}
    >
      <RadioIndicator
        className={classNames?.indicator}
        style={styles?.indicator}
      >
        <RadioRoot
          {...props}
          disabled={disabled}
          checked={checked$}
          onChange={handleChange}
        />
        {indicator ?? (
          <span className="size-2 scale-0 rounded-full bg-primary transition-transform duration-150 peer-checked:scale-100" />
        )}
      </RadioIndicator>
      {children}
    </RadioLabel>
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
  className?: ClassNameValue;
  "aria-label"?: string;
  common?: {
    classNames?: {
      indicator?: ClassNameValue;
      label?: ClassNameValue;
    };
    styles?: {
      indicator?: React.CSSProperties;
      label?: React.CSSProperties;
    };
    indicator?: React.ReactNode;
  };
}

export function RadioGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled,
  className,
  "aria-label": ariaLabel,
  common,
}: RadioGroupProps) {
  const [_value, setValue] = React.useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const value$ = isControlled ? value : _value;
  const {
    register: registerField,
    unregister: unregisterField,
    setFormValues,
  } = React.useContext(FormContext);

  React.useEffect(() => {
    if (!name) return;
    registerField(name, null, (v) => {
      const next =
        v === null || v === undefined
          ? undefined
          : Array.isArray(v)
            ? String(v[0] ?? "")
            : String(v);
      if (!isControlled) setValue(next);
      else if (next !== undefined) onValueChange?.(next);
    });
    return () => unregisterField(name);
  }, [name, isControlled, onValueChange, registerField, unregisterField]);

  const handleSelect = (val: string) => {
    if (!isControlled) setValue(val);
    onValueChange?.(val);
    if (name) setFormValues((prev) => ({ ...prev, [name]: val }));
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-2", className)}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          name={name}
          disabled={disabled || option.disabled}
          checked={value$ === option.value}
          onCheckedChange={() => handleSelect(option.value)}
          classNames={option.classNames ?? common?.classNames}
          styles={option.styles ?? common?.styles}
          indicator={option.indicator ?? common?.indicator}
        >
          {option.label}
        </Radio>
      ))}
    </div>
  );
}

Radio.Group = RadioGroup;
