"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

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
        "focus-visible:ring-inset focus-visible:z-10",
        "aria-checked:bg-primary aria-checked:text-primary-foreground",
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
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelect = (val: string) => {
    if (selectedValue === val) return;
    if (!isControlled) setValue(val);
    onValueChange?.(val);
  };

  const enabledIndexes = options
    .map((option, index) => (disabled || option.disabled ? -1 : index))
    .filter((index) => index !== -1);

  const handleGroupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key) || enabledIndexes.length === 0) return;
    e.preventDefault();
    const current = itemRefs.current.findIndex((el) => el === e.target);
    const position = enabledIndexes.indexOf(current);
    let next: number;
    if (e.key === "Home") {
      next = enabledIndexes[0];
    } else if (e.key === "End") {
      next = enabledIndexes[enabledIndexes.length - 1];
    } else {
      const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const from = position === -1 ? 0 : position;
      next =
        enabledIndexes[
          (from + delta + enabledIndexes.length) % enabledIndexes.length
        ];
    }
    const item = options[next];
    if (!item) return;
    itemRefs.current[next]?.focus();
    handleSelect(item.value);
  };

  const selectedEnabledIndex = (() => {
    if (selectedValue === undefined) return -1;
    const index = options.findIndex((option) => option.value === selectedValue);
    return index !== -1 && enabledIndexes.includes(index) ? index : -1;
  })();

  return (
    <div
      role="radiogroup"
      aria-invalid={invalid}
      data-invalid={invalid || undefined}
      onKeyDown={handleGroupKeyDown}
      className={cn("inline-flex rounded-md border border-border bg-muted group", className)}
    >
      {options.map((option, index) => (
        <Segment
          key={option.value}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          value={option.value}
          disabled={disabled || option.disabled}
          checked={selectedValue === option.value}
          tabIndex={index === selectedEnabledIndex || (selectedEnabledIndex === -1 && index === enabledIndexes[0]) ? 0 : -1}
          onClick={() => handleSelect(option.value)}
          className={cn(
            "border-y-0 border-r first:border-l-0 last:border-r-0",

            option.className ?? itemClassName,
          )}
        >
          {option.label}
        </Segment>
      ))}
    </div>
  );
}

Segment.Group = SegmentGroup;
