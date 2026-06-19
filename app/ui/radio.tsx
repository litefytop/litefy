"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

const radioClass = {
  radio: "data-invalid:text-destructive data-invalid:accent-destructive",
  segment:
    "bg-input text-input-foreground border-y border-r first:border-l has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-inset has-focus-visible:outline-none has-checked:bg-primary has-checked:text-primary-foreground data-invalid:text-destructive data-invalid:has-checked:bg-destructive",
};

type RadioGroupContextValue = {
  name?: string;
  value: string | undefined;
  setValue: (v: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  variant?: "radio" | "segment";
};
const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

export type RadioGroupProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  name?: string;
  className?: ClassNameValue;
  children?: React.ReactNode;
  variant?: "radio" | "segment";
} & Omit<
  React.ComponentProps<"div">, // 改为 div 属性
  "onChange" | "defaultValue" | "value"
>;

function RadioGroup({
  defaultValue,
  value: controlledValue,
  onValueChange,
  name,
  invalid,
  disabled,
  className,
  children,
  variant = "radio",
  ...props
}: RadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(defaultValue);
  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;

  const setValue = (val: string) => {
    if (!isControlled) setUncontrolledValue(val);
    onValueChange?.(val);
  };

  const ctx = {
    name,
    value: selectedValue,
    setValue,
    invalid,
    disabled,
    variant,
  };

  return (
    <div
      {...props}
      role="radiogroup"
      aria-invalid={invalid}
      data-invalid={invalid || undefined}
      className={cn(
        "flex inert:cursor-not-allowed inert:opacity-50 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <RadioGroupContext.Provider value={ctx}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}

export type RadioProps = {
  checked?: boolean;
  onValueChange?: (checked: boolean) => void;
  value?: string;
  disabled?: boolean;
  variant?: keyof typeof radioClass;
  indicator?: (checked: boolean, wrapperClassName?: string) => React.ReactNode;
  name?: string;
  children?: React.ReactNode;
  invalid?: boolean;
} & HTMLAttrs<Omit<React.ComponentProps<"input">, "type">>;

export const Radio = ({
  value,
  defaultChecked = false,
  variant = "radio",
  indicator,
  checked,
  onValueChange,
  name,
  className,
  children,
  style,
  invalid,
  id,
  ...props
}: RadioProps) => {
  const ctx = React.useContext(RadioGroupContext);
  const fallbackId = React.useId();
  const _id = id ?? fallbackId;
  const [uncontrolledChecked, setUncontrolledChecked] =
    React.useState(defaultChecked);

  let isChecked: boolean;
  if (ctx && value !== undefined) {
    isChecked = ctx.value === value;
  } else if (checked !== undefined) {
    isChecked = checked;
  } else {
    isChecked = uncontrolledChecked;
  }

  const _name = name ?? ctx?.name;
  const _invalid = invalid ?? ctx?.invalid;

  const handleChange = () => {
    if (ctx && value) {
      ctx.setValue(value);
      return;
    }
    const next = !isChecked;
    if (checked === undefined) setUncontrolledChecked(next);
    onValueChange?.(next);
  };

  return (
    <label
      htmlFor={_id}
      style={style}
      aria-invalid={!ctx && _invalid}
      data-invalid={_invalid || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 shrink-0 h-9 min-w-9 px-3 py-1 cursor-pointer select-none relative has-disabled:cursor-not-allowed has-disabled:opacity-50",
        "has-focus-visible:[&>*:first-child]:ring-2 has-focus-visible:[&>*:first-child]:ring-ring has-focus-visible:[&>*:first-child]:ring-offset-2 has-focus-visible:[&>*:first-child]:outline-none",
        radioClass[variant],
        className,
      )}
    >
      {indicator?.(
        isChecked,
        "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 flex items-center justify-center",
      )}

      <input
        {...props}
        type="radio"
        id={_id}
        value={value}
        name={_name}
        data-invalid={_invalid || undefined}
        checked={isChecked}
        onChange={handleChange}
        data-hidden={Boolean(indicator) || variant === "segment" || undefined}
        className={cn(
          "accent-primary data-invalid:accent-destructive data-hidden:sr-only peer",
        )}
      />
      {children}
    </label>
  );
};

Radio.Group = RadioGroup;
