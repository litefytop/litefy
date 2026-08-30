import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  value?: string;
  disabled?: boolean;
  className?: ClassNameValue;
  children?: React.ReactNode;
}

export const Toggle = ({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  className,
  children,
  ...props
}: ToggleProps) => {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleClick = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setUncontrolledChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      {...props}
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
        "border border-border text-foreground",
        "transition-colors duration-200",
        "aria-checked:bg-primary aria-checked:text-primary-foreground aria-checked:border-primary",
        "hover:not-aria-checked:bg-muted/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
};

export interface ToggleOptionConfig {
  label: string;
  value: string;
  disabled?: boolean;
  className?: ClassNameValue;
}

export interface ToggleGroupProps {
  options: ToggleOptionConfig[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  disabled?: boolean;
  className?: ClassNameValue;
  itemClassName?: ClassNameValue;
}

export function ToggleGroup({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  disabled,
  className,
  itemClassName,
}: ToggleGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const selectedValues = isControlled ? controlledValue : uncontrolledValue;
  const selectedSet = React.useMemo(() => new Set(selectedValues), [selectedValues]);

  const handleToggle = (val: string) => {
    const next = selectedSet.has(val)
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val];

    if (!isControlled) setUncontrolledValue(next);
    onChange?.(next);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          disabled={disabled || option.disabled}
          checked={selectedSet.has(option.value)}
          onCheckedChange={() => handleToggle(option.value)}
          className={option.className ?? itemClassName}
        >
          {option.label}
        </Toggle>
      ))}
    </div>
  );
}

Toggle.Group = ToggleGroup;
