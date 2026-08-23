import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";
import { Check } from "lucide-react";

export interface CheckboxIndicatorProps extends Omit<
  React.ComponentProps<"input">,
  "type" | "className" | "value"
> {
  className?: ClassNameValue;
  onCheckedChange?: (checked: boolean) => void;
  value?: string;
}

export function CheckboxIndicator({
  className,
  children,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxIndicatorProps) {
  const [_checked, setChecked] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const checked$ = isControlled ? checked : _checked;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    if (!isControlled) {
      setChecked(next);
    }
    onCheckedChange?.(next);
  };
  return (
    <span
      role="checkbox"
      aria-checked={checked$}
      className={cn("inline-flex items-center justify-center min-w-3 min-h-3", className)}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked$}
        onChange={handleChange}
        className={cn("sr-only")}
      />
      {children}
    </span>
  );
}

export interface CheckboxProps extends CheckboxIndicatorProps {
  indicator?: React.ReactNode;
  slots?: {
    label?: Omit<React.ComponentProps<"label">, "children">;
    indicator?: Omit<CheckboxIndicatorProps, "children">;
  };
}

export const Checkbox = ({
  children,
  indicator,
  className,
  slots,
  checked,
  ...props
}: CheckboxProps) => {
  return (
    <label
      {...slots?.label}
      className={cn(
        "flex items-center gap-4 select-none has-disabled:opacity-50 has-disabled:cursor-not-allowed font-medium",
        slots?.label?.className,
      )}
    >
      <CheckboxIndicator
        {...props}
        checked={checked}
        className={cn(
          `transition-colors duration-300 aria-checked:bg-primary text-background bg-background 
          has-focus-visible:ring-2 has-focus-visible:ring-ring 
          [&_svg:not([class*='size-'])]:size-3 [&_svg]:stroke-4 
          border border-border rounded-sm`,
          className,
        )}
      >
        {indicator ?? <Check />}
      </CheckboxIndicator>

      {children}
    </label>
  );
};

export interface CheckboxOptionConfig extends Omit<CheckboxProps, "children"> {
  label: string;
  value: string;
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
  value,
  defaultValue = [],
  onChange,
  name,
  disabled,
  className,
  itemClassName,
  itemIndicator,
}: CheckboxGroupProps) {
  const [_value, setValue] = React.useState<string[]>(defaultValue);
  const isControlled = value !== undefined;
  const value$ = isControlled ? value : _value;
  const selectedSet = React.useMemo(() => new Set(value$), [value$]);

  const handleToggle = (val: string) => {
    const next = selectedSet.has(val) ? value$.filter((v) => v !== val) : [...value$, val];

    if (!isControlled) {
      setValue(next);
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
          className={[option.className , itemClassName]}
          indicator={option.indicator ?? itemIndicator}
        >
          {option.label}
        </Checkbox>
      ))}
    </div>
  );
}

Checkbox.Group = CheckboxGroup;
