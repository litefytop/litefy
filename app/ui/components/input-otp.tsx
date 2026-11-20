"use client";
import * as React from "react";
export interface InputOtpGroupProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function InputOtpGroup(props: InputOtpGroupProps) {
    return <div {...props}/>;
}
export interface InputOtpSlotProps extends Omit<React.ComponentProps<"input">, "className" | "ref"> {
    className?: string;
    ref?: React.Ref<HTMLInputElement>;
}
export function InputOtpSlot({ className, ref, ...props }: InputOtpSlotProps) {
    return (<input {...props} ref={ref} className={className}/>);
}
export interface InputOtpClassNames {
    slot?: string;
}
export interface InputOtpStyles {
    slot?: React.CSSProperties;
}
export interface InputOtpProps {
    length?: number;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    invalid?: boolean;
    mask?: boolean;
    name?: string;
    "aria-label"?: string;
    className?: string;
    style?: React.CSSProperties;
    classNames?: InputOtpClassNames;
    styles?: InputOtpStyles;
}
export function InputOtp({ length = 6, value, defaultValue = "", onValueChange, disabled = false, invalid, mask = false, name, "aria-label": ariaLabel, className, style, classNames, styles, }: InputOtpProps) {
    const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = (isControlled ? value : uncontrolledValue) ?? "";
    const chars = Array.from({ length }, (_, i) => currentValue[i] ?? "");
    const slots = chars.map((char, id) => ({ id, char }));
    const setValue = (next: string) => {
        if (!isControlled)
            setUncontrolledValue(next);
        onValueChange?.(next);
    };
    const focusInput = (index: number) => {
        const input = inputsRef.current[Math.min(length - 1, Math.max(0, index))];
        if (input) {
            input.focus();
            input.select();
        }
    };
    const handleChange = (index: number, raw: string) => {
        const char = raw.slice(-1);
        const next = [...chars];
        next[index] = char;
        setValue(next.join(""));
        if (char)
            focusInput(index + 1);
    };
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            focusInput(index - 1);
        }
        else if (e.key === "ArrowRight") {
            e.preventDefault();
            focusInput(index + 1);
        }
        else if (e.key === "Backspace" && !chars[index] && index > 0) {
            e.preventDefault();
            const next = [...chars];
            next[index - 1] = "";
            setValue(next.join(""));
            focusInput(index - 1);
        }
    };
    const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").trim();
        if (!text)
            return;
        const next = [...chars];
        for (let i = 0; i < text.length && index + i < length; i++) {
            next[index + i] = text[i];
        }
        setValue(next.join(""));
        focusInput(index + text.length);
    };
    const handleGroupPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).tagName === "INPUT")
            return;
        e.preventDefault();
        const firstEmpty = chars.findIndex((c) => !c);
        focusInput(firstEmpty === -1 ? length - 1 : firstEmpty);
    };
    return (<InputOtpGroup onPointerDown={handleGroupPointerDown} data-invalid={invalid || undefined} className={className} style={style}>
      {slots.map(({ id, char }) => (<InputOtpSlot key={id} ref={(el) => {
                inputsRef.current[id] = el;
            }} value={char} type={mask ? "password" : "text"} inputMode="numeric" disabled={disabled} aria-invalid={invalid} aria-label={ariaLabel ? `${ariaLabel} ${id + 1}` : undefined} autoComplete={id === 0 ? "one-time-code" : "off"} onChange={(e) => handleChange(id, e.target.value)} onKeyDown={(e) => handleKeyDown(id, e)} onPaste={(e) => handlePaste(id, e)} onFocus={(e) => e.target.select()} className={classNames?.slot} style={styles?.slot}/>))}
      {name && <input type="hidden" name={name} value={currentValue}/>}
    </InputOtpGroup>);
}
