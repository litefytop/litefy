"use client";
import * as React from "react";

export interface SegmentProps extends Omit<React.ComponentProps<"button">, "type" | "className"> {
    className?: string;
    checked?: boolean;
}
export function Segment({ className, checked, ...props }: SegmentProps) {
    return (<button {...props} role="radio" aria-checked={checked} className={className}/>);
}
export interface SegmentOptionConfig {
    label: string;
    value: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    attrs?: Record<string, string>;
}
export interface SegmentGroupProps extends Omit<React.ComponentProps<"div">, "className" | "children"> {
    options: SegmentOptionConfig[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    itemClassName?: string;
}
export function SegmentGroup({ options, value: controlledValue, defaultValue, onValueChange, disabled, className, itemClassName, ...props }: SegmentGroupProps) {
    const [uncontrolledValue, setValue] = React.useState<string | undefined>(defaultValue);
    const isControlled = controlledValue !== undefined;
    const selectedValue = isControlled ? controlledValue : uncontrolledValue;
    const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    const handleSelect = (val: string) => {
        if (selectedValue === val)
            return;
        if (!isControlled)
            setValue(val);
        onValueChange?.(val);
    };
    const enabledIndexes = options
        .map((option, index) => (disabled || option.disabled ? -1 : index))
        .filter((index) => index !== -1);
    const handleGroupKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
        if (!keys.includes(e.key) || enabledIndexes.length === 0)
            return;
        e.preventDefault();
        const current = itemRefs.current.findIndex((el) => el === e.target);
        const position = enabledIndexes.indexOf(current);
        let next: number;
        if (e.key === "Home") {
            next = enabledIndexes[0];
        }
        else if (e.key === "End") {
            next = enabledIndexes.at(-1)!;
        }
        else {
            const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
            const from = position === -1 ? 0 : position;
            next = enabledIndexes[(from + delta + enabledIndexes.length) % enabledIndexes.length];
        }
        const item = options[next];
        if (!item)
            return;
        itemRefs.current[next]?.focus();
        handleSelect(item.value);
    };
    const selectedEnabledIndex = (() => {
        if (selectedValue === undefined)
            return -1;
        const index = options.findIndex((option) => option.value === selectedValue);
        return index !== -1 && enabledIndexes.includes(index) ? index : -1;
    })();
    return (<div {...props} role="radiogroup" onKeyDown={handleGroupKeyDown} className={className}>
      {options.map((option, index) => (<Segment key={option.value} ref={(el) => {
                itemRefs.current[index] = el;
            }} {...option.attrs} value={option.value} disabled={disabled || option.disabled} checked={selectedValue === option.value} tabIndex={index === selectedEnabledIndex ||
                (selectedEnabledIndex === -1 && index === enabledIndexes[0])
                ? 0
                : -1} onClick={() => handleSelect(option.value)} className={option.className ?? itemClassName} style={option.style}>
          {option.label}
        </Segment>))}
    </div>);
}
