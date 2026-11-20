"use client";
import * as React from "react";
import { Check } from "./icons";
import { Popover } from "./popover";
export interface MultiSelectOption {
    label: string;
    value: string;
    group?: string;
    disabled?: boolean;
}
export interface MultiSelectProps extends Omit<React.ComponentProps<"button">, "children" | "className" | "style" | "type" | "onChange"> {
    options: MultiSelectOption[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (values: string[]) => void;
    trigger?: React.ReactNode;
    placeholder?: string;
    className?: string;
    classNames?: {
        content?: string;
        list?: string;
        group?: string;
        option?: string;
        check?: string;
    };
    checkNode?: React.ReactNode;
    styles?: {
        list?: React.CSSProperties;
        option?: React.CSSProperties;
    };
    disabled?: boolean;
}
const NO_VALUES: string[] = [];
export function MultiSelect({ options, value, defaultValue = NO_VALUES, onChange, trigger, placeholder = "Select options", className, classNames, checkNode, styles, disabled, ...props }: MultiSelectProps) {
    const [uncontrolledValue, setValue] = React.useState<string[]>(defaultValue);
    const isControlled = value !== undefined;
    const innerValue = isControlled ? value : uncontrolledValue;
    const [open, setOpen] = React.useState(false);
    const [highlight, setHighlight] = React.useState<number | null>(null);
    const listRef = React.useRef<HTMLUListElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const listId = React.useId();
    const groups = React.useMemo(() => {
        const map = new Map<string, MultiSelectOption[]>();
        for (const option of options) {
            const key = option.group ?? "";
            map.set(key, [...(map.get(key) ?? []), option]);
        }
        return [...map.entries()];
    }, [options]);
    const flat = React.useMemo(() => groups.flatMap(([, items]) => items), [groups]);
    const setOpenState = (next: boolean) => {
        setOpen(next);
        if (!next) {
            setHighlight(null);
            triggerRef.current?.focus();
            return;
        }
        const selectedIdx = flat.findIndex((option) => innerValue.includes(option.value));
        setHighlight(selectedIdx === -1 ? (flat.length ? 0 : null) : selectedIdx);
    };
    const toggle = (option: MultiSelectOption) => {
        if (option.disabled)
            return;
        const next = innerValue.includes(option.value)
            ? innerValue.filter((v) => v !== option.value)
            : [...innerValue, option.value];
        if (!isControlled)
            setValue(next);
        onChange?.(next);
    };
    const move = (delta: 1 | -1) => {
        if (flat.length === 0)
            return;
        setHighlight((prev) => {
            if (prev === null)
                return delta === 1 ? 0 : flat.length - 1;
            return (prev + delta + flat.length) % flat.length;
        });
    };
    const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                move(1);
                break;
            case "ArrowUp":
                e.preventDefault();
                move(-1);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (highlight !== null)
                    toggle(flat[highlight]);
                break;
            case "Escape":
                e.preventDefault();
                setOpenState(false);
                break;
        }
    };
    React.useEffect(() => {
        if (highlight === null)
            return;
        listRef.current?.querySelectorAll("[role='option']")[highlight]?.scrollIntoView({ block: "nearest" });
    }, [highlight]);
    return (<Popover {...props} aria-haspopup="listbox" aria-controls={listId} placement={{ matchWidth: true }} open={open} onOpenChange={setOpenState} trigger={trigger ?? (innerValue.length > 0 ? `${placeholder} (${innerValue.length})` : placeholder)} contentKeyDown={handleListKeyDown} disabled={disabled} classNames={{ trigger: className, content: classNames?.content }}>
      <ul ref={listRef} id={listId} role="listbox" aria-multiselectable="true" aria-label={placeholder} className={classNames?.list} style={styles?.list}>
        {groups.map(([group, items]) => (<React.Fragment key={group}>
            {group && (<li role="presentation" className={classNames?.group}>{group}</li>)}
            {items.map((option) => {
                const idx = flat.indexOf(option);
                const selected = innerValue.includes(option.value);
                return (<li key={option.value} role="option" aria-selected={selected} aria-disabled={option.disabled || undefined} data-selected={selected || undefined} data-highlighted={idx === highlight || undefined} data-grouped={option.group ? "true" : undefined} tabIndex={idx === highlight ? 0 : -1} onClick={() => toggle(option)} onMouseMove={() => setHighlight(idx)} className={classNames?.option} style={styles?.option}>
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {selected && (checkNode ?? (<Check aria-hidden data-selected="true" className={classNames?.check}/>))}
                  </li>);
            })}
          </React.Fragment>))}
      </ul>
    </Popover>);
}
