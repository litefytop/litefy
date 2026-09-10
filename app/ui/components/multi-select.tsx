"use client";

import * as React from "react";
import {
  Button,
  CheckboxGroup,
  Popover,
  type CheckboxOptionConfig,
  type CheckboxOptionGroup,
  type ClassNameValue,
  cn,
} from "..";

export interface MultiSelectProps {
  options: (CheckboxOptionConfig | CheckboxOptionGroup)[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  trigger?: React.ReactNode;
  placeholder?: string;
  className?: ClassNameValue;
  classNames?: {
    content?: ClassNameValue;
  };
}

export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onChange,
  trigger,
  placeholder = "Select options",
  className,
  classNames,
}: MultiSelectProps) {
  const [uncontrolledValue, setValue] = React.useState<string[]>(defaultValue);
  const isControlled = value !== undefined;
  const innerValue = isControlled ? value : uncontrolledValue;

  const handleChange = (next: string[]) => {
    if (!isControlled) setValue(next);
    onChange?.(next);
  };

  return (
    <Popover
      alignX="start"
      trigger={trigger ?? `${placeholder} (${innerValue.length})`}
      classNames={{
        trigger: cn(Button.className.base, Button.className.variant.primary, className),
        content: classNames?.content,
      }}
    >
      <CheckboxGroup options={options} value={innerValue} onChange={handleChange} />
    </Popover>
  );
}
