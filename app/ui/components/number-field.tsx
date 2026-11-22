"use client";
import * as React from "react";
import { Minus, Plus } from "./icons";
export interface NumberStepperProps extends Omit<React.ComponentProps<"button">, "className" | "type"> {
    className?: string;
    direction?: "up" | "down";
    classNames?: {
        icon?: string;
    };
}
export function NumberStepper({ className, classNames, direction = "up", children, ...props }: NumberStepperProps) {
    return (<button aria-label={direction === "up" ? "Increase" : "Decrease"} {...props} type="button" tabIndex={-1} className={className}>
      {children ?? (direction === "up" ? <Plus aria-hidden className={classNames?.icon}/> : <Minus aria-hidden className={classNames?.icon}/>)}
    </button>);
}
export type NumberRootProps = Omit<React.ComponentProps<"input">, "className"> & {
    className?: string;
};
export function NumberRoot(props: NumberRootProps) {
    return (<input {...props}/>);
}
export function groupThousands(numStr: string): string {
    if (numStr === "" || !/^-?\d+(\.\d*)?$/u.test(numStr))
        return numStr;
    const negative = numStr.startsWith("-");
    const body = negative ? numStr.slice(1) : numStr;
    const [intPart, decPart] = body.split(".");
    const grouped = intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/gu, ",");
    return `${negative ? "-" : ""}${grouped}${decPart !== undefined ? `.${decPart}` : ""}`;
}
type NumberCoreOptions = {
    positiveInteger: boolean;
    min: number;
    max: number;
    step: number;
    thousands: boolean;
    disabled?: boolean;
    defaultValue: string;
    onValueChange: ((value?: number) => void) | ((value?: string) => void) | undefined;
    controlledValue: string | number | undefined;
    isControlled: boolean;
    rest: Record<string, unknown> & {
        onBlur?: React.FocusEventHandler<HTMLInputElement>;
        onFocus?: React.FocusEventHandler<HTMLInputElement>;
        onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    };
};
export function useNumberCore(opts: NumberCoreOptions) {
    const { positiveInteger, min, max, step, thousands, disabled, defaultValue, onValueChange, controlledValue, isControlled, rest, } = opts;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(String(defaultValue ?? ""));
    const [focused, setFocused] = React.useState(false);
    const nodeRef = React.useRef<HTMLInputElement | null>(null);
    const value = isControlled ? String(controlledValue ?? "") : uncontrolledValue;
    const valueRef = React.useRef(value);
    React.useEffect(() => {
        valueRef.current = value;
    }, [value]);
    const normalize = React.useCallback((str: string): string => {
        const trimmed = str.trim();
        if (trimmed === "")
            return "";
        let num = parseFloat(trimmed);
        if (Number.isNaN(num))
            return "";
        if (positiveInteger) {
            num = Math.floor(num);
            if (num < 0)
                num = 0;
        }
        if (num < min)
            num = min;
        if (num > max)
            num = max;
        return String(num);
    }, [min, max, positiveInteger]);
    const emitChange = React.useCallback((newRawValue: string) => {
        valueRef.current = newRawValue;
        if (!isControlled) {
            setUncontrolledValue(newRawValue);
        }
        if (positiveInteger) {
            const num = newRawValue === "" ? undefined : parseInt(newRawValue, 10);
            (onValueChange as (value?: number) => void)?.(num);
        }
        else {
            const val = newRawValue === "" ? undefined : newRawValue;
            (onValueChange as (value?: string) => void)?.(val);
        }
    }, [isControlled, positiveInteger, onValueChange]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replaceAll(',', "");
        if (positiveInteger) {
            if (!/^\d*$/u.test(raw))
                return;
        }
        else {
            const regex = /^-?[0-9]*\.?[0-9]*$/u;
            if (!regex.test(raw))
                return;
        }
        emitChange(raw);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        const current = valueRef.current;
        const normalized = normalize(current);
        if (normalized !== current) {
            emitChange(normalized);
        }
        rest.onBlur?.(e);
    };
    const stepDelta = React.useCallback((delta: number) => {
        const current = valueRef.current;
        let currentNum: number;
        if (positiveInteger) {
            currentNum = current === "" ? 0 : parseInt(current, 10);
        }
        else {
            currentNum = parseFloat(current);
            if (Number.isNaN(currentNum))
                currentNum = 0;
        }
        let newNum = currentNum + delta;
        if (positiveInteger) {
            newNum = Math.floor(newNum);
        }
        else {
            const stepStr = String(step);
            const decimalMatch = stepStr.match(/\.(\d+)$/u);
            const decimalPlaces = decimalMatch ? decimalMatch[1].length : 0;
            const factor = 10 ** decimalPlaces;
            const scaledCurrent = Math.round(currentNum * factor);
            const scaledDelta = delta * factor;
            newNum = (scaledCurrent + scaledDelta) / factor;
        }
        if (newNum < min)
            newNum = min;
        if (newNum > max)
            newNum = max;
        emitChange(String(newNum));
    }, [min, max, positiveInteger, step, emitChange]);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            stepDelta(step);
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            stepDelta(-step);
        }
        rest.onKeyDown?.(e);
    };
    React.useEffect(() => {
        const el = nodeRef.current;
        if (!focused || !el)
            return;
        const onWheel = (e: WheelEvent) => {
            if (e.deltaY === 0 || el.readOnly)
                return;
            e.preventDefault();
            stepDelta(e.deltaY < 0 ? step : -step);
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [focused, step, stepDelta]);
    const safeMin = Number.isFinite(min) ? min : undefined;
    const safeMax = Number.isFinite(max) ? max : undefined;
    const numValue = value === "" ? undefined : parseFloat(value);
    const valuenow = numValue !== undefined && !Number.isNaN(numValue) ? numValue : undefined;
    const displayValue = thousands && !focused ? groupThousands(value) : value;
    const canDecrement = !disabled && (valuenow ?? 0) > min;
    const canIncrement = !disabled && (valuenow ?? 0) < max;
    const inputProps = {
        ...rest,
        type: "text" as const,
        inputMode: positiveInteger ? ("numeric" as const) : ("decimal" as const),
        role: "spinbutton" as const,
        disabled,
        value: displayValue,
        onChange: handleChange,
        onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
            nodeRef.current = e.currentTarget;
            setFocused(true);
            rest.onFocus?.(e);
        },
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        "aria-valuemin": safeMin,
        "aria-valuemax": safeMax,
        "aria-valuenow": valuenow,
    };
    return { inputProps, stepDelta, canDecrement, canIncrement };
}
export type NumberFieldProps = Omit<React.ComponentProps<"input">, "className" | "value" | "defaultValue" | "type" | "onChange" | "size" | "prefix"> & {
    value?: number | string;
    defaultValue?: number | string;
    invalid?: boolean;
    min?: number;
    max?: number;
    step?: number;
    thousands?: boolean;
    positiveInteger?: boolean;
    className?: string;
    style?: React.CSSProperties;
    classNames?: {
        root?: string;
        stepper?: string;
        stepperIcon?: string;
        hint?: string;
    };
    styles?: {
        root?: React.CSSProperties;
        stepper?: React.CSSProperties;
        hint?: React.CSSProperties;
    };
    disabled?: boolean;
    incrementLabel?: string;
    decrementLabel?: string;
    onValueChange?: ((value?: number) => void) | ((value?: string) => void);
};
export function NumberField(props: NumberFieldProps) {
    const { positiveInteger = false, invalid, min = 0, max = 999, step = 1, thousands = false, className, style, classNames, styles, disabled, defaultValue = "", onValueChange, value: controlledValue, incrementLabel = "Increase", decrementLabel = "Decrease", ...rest } = props;
    const { inputProps, stepDelta, canDecrement, canIncrement } = useNumberCore({
        positiveInteger,
        min,
        max,
        step,
        thousands,
        disabled,
        defaultValue: String(defaultValue ?? ""),
        onValueChange: onValueChange as NumberCoreOptions["onValueChange"],
        controlledValue,
        isControlled: "value" in props,
        rest: rest as NumberCoreOptions["rest"],
    });
    const hintId = React.useId();
    const describedBy = [hintId, rest["aria-describedby"]].filter(Boolean).join(" ");
    return (<div data-invalid={invalid || undefined} className={className} style={style}>
      <NumberStepper direction="down" aria-label={decrementLabel} disabled={disabled || !canDecrement} onClick={() => stepDelta(-step)} className={classNames?.stepper} classNames={{ icon: classNames?.stepperIcon }} style={styles?.stepper}/>
      <NumberRoot {...inputProps} aria-invalid={invalid} aria-describedby={describedBy} className={classNames?.root} style={styles?.root}/>
      <NumberStepper direction="up" aria-label={incrementLabel} disabled={disabled || !canIncrement} onClick={() => stepDelta(step)} className={classNames?.stepper} classNames={{ icon: classNames?.stepperIcon }} style={styles?.stepper}/>
      <span id={hintId} className={classNames?.hint} style={styles?.hint}>↑ ↓</span>
    </div>);
}
