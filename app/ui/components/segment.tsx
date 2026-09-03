"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface SegmentProps extends Omit<React.ComponentProps<"button">, "type" | "className"> {
  className?: ClassNameValue;
  checked?: boolean;
}

export function Segment({ className, checked, ...props }: SegmentProps) {
  return (
    <button
      {...props}
      type="button"
      role="radio"
      aria-checked={checked}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 h-9 min-w-9 px-3 py-1 text-sm font-medium cursor-pointer select-none",
        "bg-muted text-muted-foreground border-y border-r first:border-l border-border",
        "first:rounded-l-md last:rounded-r-md",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:z-10",
        "aria-checked:bg-primary aria-checked:text-primary-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}

export interface SegmentOptionConfig {
  label: string;
  value: string;
  disabled?: boolean;
  className?: ClassNameValue;
}

export interface SegmentGroupProps {
  options: SegmentOptionConfig[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: ClassNameValue;
  itemClassName?: ClassNameValue;
}

export function SegmentGroup({
  options,
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled,
  invalid,
  className,
  itemClassName,
}: SegmentGroupProps) {
  const [uncontrolledValue, setValue] = React.useState<string | undefined>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : uncontrolledValue;

  const handleSelect = (val: string) => {
    if (selectedValue === val) return;
    if (!isControlled) setValue(val);
    onValueChange?.(val);
  };

  return (
    <div
      role="radiogroup"
      aria-invalid={invalid}
      data-invalid={invalid || undefined}
      className={cn("inline-flex rounded-md border border-border bg-muted group", className)}
    >
      {options.map((option) => (
        <Segment
          key={option.value}
          value={option.value}
          disabled={disabled || option.disabled}
          checked={selectedValue === option.value}
          onClick={() => handleSelect(option.value)}
          className={cn(
            "border-y-0 border-r first:border-l-0 last:border-r-0",
            "group-data-invalid:aria-checked:bg-danger",
            "group-data-invalid:text-danger",
            option.className ?? itemClassName,
          )}
        >
          {option.label}
        </Segment>
      ))}
    </div>
  );
}
