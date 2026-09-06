"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface InputOtpGroupProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function InputOtpGroup({ className, ...props }: InputOtpGroupProps) {
  return <div {...props} className={cn("flex items-center gap-2", className)} />;
}

export interface InputOtpSlotProps extends Omit<
  React.ComponentProps<"input">,
  "className" | "ref"
> {
  className?: ClassNameValue;
  ref?: React.Ref<HTMLInputElement>;
}

export function InputOtpSlot({ className, ref, ...props }: InputOtpSlotProps) {
  return (
    <input
      {...props}
      ref={ref}
      className={cn(
        "size-9 rounded-md border border-border bg-background/90 text-center text-sm font-medium outline-none transition-colors",
        "focus:border-primary focus:ring-2 focus:ring-ring/50",
        "aria-invalid:border-danger aria-invalid:text-danger",
        "aria-invalid:focus-visible:outline-1 aria-invalid:focus-visible:outline-danger aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-danger/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}

export interface InputOtpClassNames {
  group?: ClassNameValue;
  slot?: ClassNameValue;
}

export interface InputOtpStyles {
  group?: React.CSSProperties;
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
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: InputOtpClassNames;
  styles?: InputOtpStyles;
}

export function InputOtp({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  disabled = false,
  invalid,
  mask = false,
  name,
  "aria-label": ariaLabel,
  className,
  style,
  classNames,
  styles,
}: InputOtpProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = (isControlled ? value : uncontrolledValue) ?? "";
  const chars = Array.from({ length }, (_, i) => currentValue[i] ?? "");

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolledValue(next);
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
    if (char) focusInput(index + 1);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusInput(index + 1);
    } else if (e.key === "Backspace" && !chars[index] && index > 0) {
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
    if (!text) return;
    const next = [...chars];
    for (let i = 0; i < text.length && index + i < length; i++) {
      next[index + i] = text[i];
    }
    setValue(next.join(""));
    focusInput(index + text.length);
  };

  const handleGroupPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    e.preventDefault();
    const firstEmpty = chars.findIndex((c) => !c);
    focusInput(firstEmpty === -1 ? length - 1 : firstEmpty);
  };

  return (
    <InputOtpGroup
      onPointerDown={handleGroupPointerDown}
      data-invalid={invalid || undefined}
      className={cn(className, classNames?.group)}
      style={{ ...style, ...styles?.group }}
    >
      {chars.map((char, index) => (
        <InputOtpSlot
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          value={char}
          type={mask ? "password" : "text"}
          inputMode="numeric"
          disabled={disabled}
          aria-invalid={invalid}
          aria-label={ariaLabel ? `${ariaLabel} ${index + 1}` : undefined}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          onFocus={(e) => e.target.select()}
          className={classNames?.slot}
          style={styles?.slot}
        />
      ))}
      {name && <input type="hidden" name={name} value={currentValue} />}
    </InputOtpGroup>
  );
}
