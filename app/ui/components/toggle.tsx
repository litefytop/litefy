import * as React from "react";

export interface ToggleProps extends Omit<React.ComponentProps<"button">, "type" | "className"> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    value?: string;
    disabled?: boolean;
    className?: string;
}
export const Toggle = ({ checked: controlledChecked, defaultChecked = false, onCheckedChange, disabled, className, children, onClick, ...props }: ToggleProps) => {
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
    return (<button {...props} type="button" aria-pressed={checked} disabled={disabled} onClick={handleClick} className={className}>
      {children}
    </button>);
};
export interface ToggleOptionConfig {
    label: React.ReactNode;
    value: string;
    disabled?: boolean;
    className?: string;
}
export interface ToggleGroupProps extends Omit<React.ComponentProps<"div">, "className" | "children" | "onChange"> {
    options: ToggleOptionConfig[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (values: string[]) => void;
    disabled?: boolean;
    className?: string;
    itemClassName?: string;
}
const EMPTY_VALUES: string[] = [];
export function ToggleGroup({ options, value: controlledValue, defaultValue = EMPTY_VALUES, onChange, disabled, className, itemClassName, ...props }: ToggleGroupProps) {
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
    return (<div {...props} className={className}>
      {options.map((option) => (<Toggle key={option.value} value={option.value} disabled={disabled || option.disabled} checked={selectedSet.has(option.value)} onCheckedChange={() => handleToggle(option.value)} className={option.className ?? itemClassName}>
          {option.label}
        </Toggle>))}
    </div>);
}
