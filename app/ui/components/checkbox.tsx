import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface CheckboxIndicatorProps extends Omit<React.ComponentProps<"input">, "type" | "checked" | "defaultChecked" | "className" | "children" | "value"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode | ((checked: boolean) => React.ReactNode);
  className?: ClassNameValue;
  value?: string;
} ;

export function CheckboxIndicator({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  children,
  className,
  ...props
}: CheckboxIndicatorProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) {
      setUncontrolledChecked(next);
    }
    onCheckedChange?.(next);
  };

  React.useEffect(() => {
    if (isControlled) {
      setUncontrolledChecked(controlledChecked);
    }
  }, [controlledChecked, isControlled]);

  const content = typeof children === "function" ? children(checked) : children;

  return (
    <span className="focus-within:outline-2 focus-within:outline-ring flex">
      {content}
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        data-sr-only={Boolean(children)||undefined}
        className={cn("data-sr-only:sr-only", className)}
      />
    </span>
  );
}

export interface CheckboxProps extends  Omit<CheckboxIndicatorProps, "children"> {
  indicator?: React.ReactNode | ((checked: boolean) => React.ReactNode);
  children?: React.ReactNode;
  indicatorClassName?: ClassNameValue;
} ;

export const Checkbox = ({
  children,
  indicator,
  className,
  indicatorClassName,
  ...props
}: CheckboxProps) => {
  return (
    <label className={cn("flex items-center gap-2 select-none has-disabled:opacity-50 has-disabled:cursor-not-allowed", className)}>
      <CheckboxIndicator {...props} children={indicator} className={cn("accent-primary",indicatorClassName)} />
      {children}
    </label>
  );
};

export interface CheckboxOptionConfig {
  label: string;
  value: string;
  disabled?: boolean;
  className?: ClassNameValue;
  indicator?: CheckboxProps["indicator"];
}

export interface CheckboxGroupProps {
  options: CheckboxOptionConfig[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  name?: string;
  disabled?: boolean;
  className?: ClassNameValue;
  itemClassName?: ClassNameValue;
  itemIndicator?: CheckboxProps["indicator"];
}

export function CheckboxGroup({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  name,
  disabled,
  className,
  itemClassName,
  itemIndicator,
}: CheckboxGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const selectedValues = isControlled ? controlledValue : uncontrolledValue;
  const selectedSet = React.useMemo(() => new Set(selectedValues), [selectedValues]);

  const handleToggle = (val: string) => {
    const next = selectedSet.has(val)
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val];

    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          value={option.value}
          disabled={disabled || option.disabled}
          name={name}
          checked={selectedSet.has(option.value)}
          onCheckedChange={() => handleToggle(option.value)}
          className={option.className ?? itemClassName}
          indicator={option.indicator ?? itemIndicator}
        >
          {option.label}
        </Checkbox>
      ))}
    </div>
  );
}

Checkbox.Group = CheckboxGroup;
