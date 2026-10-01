import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";

/** 与 Segment 一致的变体:fill 选中填充主色;text 纯文字无填充,选中文字着主色并加下划线 */
export type ToggleVariant = "fill" | "text";
export interface ToggleProps extends Omit<React.ComponentProps<"button">, "type" | "className"> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    value?: string;
    disabled?: boolean;
    variant?: ToggleVariant;
    className?: ClassNameValue;
}
export const Toggle = ({ checked: controlledChecked, defaultChecked = false, onCheckedChange, disabled, variant = "fill", className, children, onClick, ...props }: ToggleProps) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolledChecked;
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled)
            return;
        const next = !checked;
        if (!isControlled)
            setUncontrolledChecked(next);
        onCheckedChange?.(next);
    };
    return (<button {...props} type="button" aria-pressed={checked} disabled={disabled} onClick={handleClick} className={cn("relative inline-flex items-center justify-center gap-2 h-9 min-w-9 px-3 py-1 text-sm font-medium cursor-pointer select-none transition-colors duration-200", variant === "fill" ? cn("rounded-md text-muted-foreground hover:bg-accent", "aria-pressed:bg-primary aria-pressed:text-primary-foreground") : cn("rounded-md text-muted-foreground hover:bg-accent", "aria-pressed:text-primary aria-pressed:underline aria-pressed:decoration-2 aria-pressed:underline-offset-4"), className)}>
      {children}
    </button>);
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
    variant?: ToggleVariant;
    className?: ClassNameValue;
    itemClassName?: ClassNameValue;
}
export function ToggleGroup({ options, value: controlledValue, defaultValue = [], onChange, disabled, variant, className, itemClassName, }: ToggleGroupProps) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(defaultValue);
    const isControlled = controlledValue !== undefined;
    const selectedValues = isControlled ? controlledValue : uncontrolledValue;
    const selectedSet = React.useMemo(() => new Set(selectedValues), [selectedValues]);
    const handleToggle = (val: string) => {
        const next = selectedSet.has(val)
            ? selectedValues.filter((v) => v !== val)
            : [...selectedValues, val];
        if (!isControlled)
            setUncontrolledValue(next);
        onChange?.(next);
    };
    return (<div className={cn("inline-flex rounded-md group", variant !== "text" && "overflow-hidden", className)}>
      {options.map((option) => (<Toggle key={option.value} value={option.value} variant={variant} disabled={disabled || option.disabled} checked={selectedSet.has(option.value)} onCheckedChange={() => handleToggle(option.value)} className={cn(variant !== "text" && "rounded-none", option.className ?? itemClassName)}>
          {option.label}
        </Toggle>))}
    </div>);
}
Toggle.Group = ToggleGroup;
