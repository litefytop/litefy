"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { InputGroup, InputLeading, InputTrailing } from "./input-group";
import { NumberRoot, useNumberCore } from "./number-field";

export type NumberInputProps = Omit<
  React.ComponentProps<"input">,
  "className" | "value" | "defaultValue" | "type" | "onChange" | "size" | "prefix"
> & {
  value?: number | string;
  defaultValue?: number | string;
  invalid?: boolean;
  min?: number;
  max?: number;
  step?: number;
  thousands?: boolean;
  positiveInteger?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  indicator?: boolean;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: {
    leading?: ClassNameValue;
    trailing?: ClassNameValue;
    root?: ClassNameValue;
  };
  styles?: {
    leading?: React.CSSProperties;
    trailing?: React.CSSProperties;
    root?: React.CSSProperties;
  };
  disabled?: boolean;
  onValueChange?: ((value?: number) => void) | ((value?: string) => void);
};

export function NumberInput(props: NumberInputProps) {
  const {
    positiveInteger = false,
    invalid,
    min = positiveInteger ? 0 : -Infinity,
    max = Infinity,
    step = 1,
    thousands = false,
    indicator = true,
    prefix,
    suffix,
    className,
    style,
    classNames,
    styles,
    disabled,
    defaultValue = "",
    onValueChange,
    value: controlledValue,
    ...rest
  } = props;

  const { inputProps } = useNumberCore({
    positiveInteger,
    min,
    max,
    step,
    thousands,
    disabled,
    defaultValue: String(defaultValue ?? ""),
    onValueChange: onValueChange as (value?: string) => void,
    controlledValue,
    isControlled: "value" in props,
    rest: rest as Parameters<typeof useNumberCore>[0]["rest"],
  });

  return (
    <InputGroup invalid={invalid} className={className} style={style}>
      {(prefix || classNames?.leading || styles?.leading) && (
        <InputLeading className={classNames?.leading} style={styles?.leading}>
          {prefix}
        </InputLeading>
      )}
      <NumberRoot
        {...inputProps}
        aria-invalid={invalid}
        className={classNames?.root}
        style={styles?.root}
      />
      <InputTrailing className={cn("gap-1.5 pr-1", classNames?.trailing)} style={styles?.trailing}>
        {suffix ? (
          <span className="text-sm text-muted-foreground">{suffix}</span>
        ) : (
          indicator && (
            <span
              aria-hidden
              className="pointer-events-none flex shrink-0 select-none flex-col items-center justify-center leading-none text-muted-foreground/80"
            >
              <ChevronUp className="size-3 -mb-0.5" />
              <ChevronDown className="size-3" />
            </span>
          )
        )}
      </InputTrailing>
    </InputGroup>
  );
}
