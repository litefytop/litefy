import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface CheckboxRootProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "className" | "value"
> {
  className?: ClassNameValue;
  onCheckedChange?: (checked: boolean) => void;
  value?: string;
}

export function CheckboxRoot({
  className,
  children,
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxRootProps) {
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
  return children ? (
    <span role="checkbox" aria-checked={checked} className={cn(className)}>
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={cn("sr-only")}
      />
      {children}
    </span>
  ) : (
    <input
      {...props}
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className={cn(className)}
    />
  );
}

export interface CheckboxProps extends CheckboxRootProps {
  indicator?: React.ReactNode;
}

export const Checkbox = ({ children, indicator, className, ...props }: CheckboxProps) => {
  return (
    <label
      className={cn(
        "flex items-center gap-4 select-none has-disabled:opacity-50 has-disabled:cursor-not-allowed font-medium",
        className,
      )}
    >
      <CheckboxRoot
        {...props}
        className={`flex items-center justify-center  
          transition-colors duration-300 accent-primary aria-checked:bg-primary text-background bg-background 
          has-focus-visible:ring-2 has-focus-visible:ring-ring 
          [&_svg:not([class*='size-'])]:size-3 [&_svg]:stroke-4 
          border border-border rounded-sm`}
      >
        {indicator}
      </CheckboxRoot>

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
