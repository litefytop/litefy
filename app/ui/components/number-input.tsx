"use client";
import * as React from "react";
import { ChevronDown, ChevronUp } from "./icons";
import { InputLeading, InputTrailing } from "./input";
import { NumberRoot, useNumberCore } from "./number-field";
import { Field, type FieldClassNames, type FieldValidateResult } from "./field";
export type NumberInputProps = Omit<React.ComponentProps<"input">, "className" | "value" | "defaultValue" | "type" | "onChange" | "size" | "prefix"> & {
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
    [key: `data-${string}`]: string | number | null | undefined | true;
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        leading?: string;
        trailing?: string;
        root?: string;
        indicator?: string;
        indicatorIcon?: string;
        hint?: string;
    };
    styles?: {
        leading?: React.CSSProperties;
        trailing?: React.CSSProperties;
        root?: React.CSSProperties;
        indicator?: React.CSSProperties;
        indicatorIcon?: React.CSSProperties;
        hint?: React.CSSProperties;
    };
    disabled?: boolean;
    label?: React.ReactNode;
    description?: React.ReactNode;
    validate?: (value: string) => FieldValidateResult | Promise<FieldValidateResult>;
    validateTrigger?: "submit" | "change" | "blur";
    fieldClassNames?: FieldClassNames;
    onValueChange?: ((value?: number) => void) | ((value?: string) => void);
};
export function NumberInput(props: NumberInputProps) {
    const { positiveInteger = false, invalid, min = 0, max = 99, step = 1, thousands = false, indicator = true, prefix, suffix, className, style, classNames, styles, disabled, defaultValue = "", onValueChange, value: controlledValue, "data-border": border, label, description, validate, validateTrigger, fieldClassNames, ...rest } = props;
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
    const hintId = React.useId();
    const composeBox = (field?: { id: string; name: string; describedBy: string | undefined; invalid: boolean }) => {
        const describedBy = [field?.describedBy, rest["aria-describedby"], hintId].filter(Boolean).join(" ") || undefined;
        return (<div data-invalid={invalid || field?.invalid || undefined} data-border={border} className={className} style={style}>
      {(prefix || classNames?.leading || styles?.leading) && (<InputLeading className={classNames?.leading} style={styles?.leading}>
          {prefix}
        </InputLeading>)}
      <NumberRoot {...inputProps} id={field?.id ?? rest.id} name={field?.name ?? rest.name} aria-describedby={describedBy} aria-invalid={invalid || field?.invalid} data-invalid={invalid || field?.invalid || undefined} className={classNames?.root} style={styles?.root}/>
      {(suffix || indicator) && (<InputTrailing className={classNames?.trailing} style={styles?.trailing}>
        {suffix ? suffix : (indicator && (<span aria-hidden className={classNames?.indicator}>
              <ChevronUp aria-hidden className={classNames?.indicatorIcon} style={styles?.indicatorIcon}/>
              <ChevronDown aria-hidden className={classNames?.indicatorIcon} style={styles?.indicatorIcon}/>
            </span>))}
      </InputTrailing>)}
      <span id={hintId} className={classNames?.hint} style={styles?.hint}>
          ↑ ↓
        </span>
    </div>);
    };
    if (label === undefined && description === undefined && validate === undefined) {
        return composeBox();
    }
    return (<Field
      name={rest.name ?? ""}
      label={label}
      description={description}
      required={rest.required}
      validate={validate}
      validateTrigger={validateTrigger}
      fieldClassNames={fieldClassNames}
    >
      {(f) => composeBox({ id: f.id, name: f.name, describedBy: f.describedBy, invalid: f.invalid })}
    </Field>);
}
