"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { useFloatingPanel } from "../utils/use-floating-panel";
import { useFloatingPosition } from "../utils/floating-position";
export type SelectOption = {
    label: string;
    value: string;
};
export type SelectOptionGroup = {
    group: string;
    options: SelectOption[];
};
export interface SelectProps extends Omit<React.ComponentProps<"button">, "onChange" | "value" | "defaultValue" | "children" | "type" | "className" | "style"> {
    options: (SelectOption | SelectOptionGroup)[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    name?: string;
    className?: ClassNameValue;
    style?: React.CSSProperties;
    classNames?: {
        panel?: ClassNameValue;
        label?: ClassNameValue;
        option?: ClassNameValue;
    };
    styles?: {
        panel?: React.CSSProperties;
    };
}
export function Select({ options, value: controlledValue, defaultValue = "", onValueChange, placeholder, disabled, required, name, className, style, classNames, styles, ...props }: SelectProps) {
    const isControlled = controlledValue !== undefined;
    const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const anchorName = `--select-${uid}`;
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const [uncontrolledOpen, setOpen] = React.useState(false);
    const [uncontrolledValue, setValue] = React.useState(defaultValue);
    const [highlightIndex, setHighlightIndex] = React.useState<number | null>(null);
    const value = isControlled ? controlledValue : uncontrolledValue;
    const open = uncontrolledOpen;
    const flat = React.useMemo(() => options.flatMap((item) => ("options" in item ? item.options : [item])), [options]);
    const selectedLabel = flat.find((option) => option.value === value)?.label ?? null;
    const setOpenState = (next: boolean) => {
        setOpen(next);
        if (next) {
            const selectedIdx = flat.findIndex((option) => option.value === value);
            setHighlightIndex(selectedIdx === -1 ? (flat.length ? 0 : null) : selectedIdx);
        }
        else {
            setHighlightIndex(null);
        }
    };
    const commit = (option: SelectOption) => {
        if (!isControlled)
            setValue(option.value);
        onValueChange?.(option.value);
        setOpen(false);
        setHighlightIndex(null);
        triggerRef.current?.focus();
    };
    const moveHighlight = (delta: 1 | -1) => {
        if (flat.length === 0)
            return;
        setHighlightIndex((prev) => {
            if (prev === null)
                return delta === 1 ? 0 : flat.length - 1;
            return (prev + delta + flat.length) % flat.length;
        });
    };
    const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled)
            return;
        switch (e.key) {
            case "ArrowDown":
            case "ArrowUp":
                e.preventDefault();
                if (!open)
                    setOpenState(true);
                else
                    moveHighlight(e.key === "ArrowDown" ? 1 : -1);
                return;
            case "Enter":
            case " ":
                e.preventDefault();
                if (open && highlightIndex !== null)
                    commit(flat[highlightIndex]);
                else
                    setOpenState(!open);
                return;
            case "Escape":
                if (open) {
                    e.preventDefault();
                    setOpenState(false);
                }
                return;
            case "Home":
                if (open) {
                    e.preventDefault();
                    setHighlightIndex(flat.length ? 0 : null);
                }
                return;
            case "End":
                if (open) {
                    e.preventDefault();
                    setHighlightIndex(flat.length ? flat.length - 1 : null);
                }
                return;
            case "Tab":
                setOpenState(false);
                return;
        }
    };
    useFloatingPanel({
        open,
        panelRef,
        anchorRef: triggerRef,
        onOpenChange: (next) => {
            if (!next)
                setOpen(false);
        },
    });
    useFloatingPosition(panelRef, anchorName);
    React.useEffect(() => {
        if (!open || highlightIndex === null)
            return;
        panelRef.current
            ?.querySelector('[data-highlighted="true"]')
            ?.scrollIntoView({ block: "nearest" });
    }, [open, highlightIndex]);
    const renderOption = (option: SelectOption, index: number) => (<div key={option.value} role="option" data-slot="select-option" aria-selected={option.value === value} data-highlighted={highlightIndex === index || undefined} data-selected={option.value === value || undefined} data-disabled={disabled || undefined} onClick={disabled ? undefined : () => commit(option)} className={cn(classNames?.option)}>
      {option.label}
    </div>);
    return (<>
      {name && <input type="hidden" name={name} value={value}/>}
      <button {...props} ref={triggerRef} type="button" disabled={disabled} aria-haspopup="listbox" aria-expanded={open || undefined} aria-required={required || undefined} data-open={open || undefined} data-placeholder-shown={!selectedLabel || undefined} data-anchor-name={anchorName} onClick={() => !disabled && setOpenState(!open)} onKeyDown={handleTriggerKeyDown} className={cn("litefy-select", className)} style={style}>
        <span data-slot="select-value">{selectedLabel ?? placeholder ?? ""}</span>
        <ChevronDown aria-hidden data-slot="select-chevron" data-open={open || undefined}/>
      </button>
      <div ref={panelRef} popover="manual" tabIndex={-1} role="listbox" aria-label={placeholder} data-slot="select-panel" data-float-anchor={anchorName} data-float-side="bottom" data-float-align="center" data-float-gap={4} data-float-match-width className={cn(classNames?.panel)} style={styles?.panel}>
        {flat.length === 0 ? (<div data-slot="select-empty">
            No options available
          </div>) : (options.map((item, index) => "options" in item ? (<div key={`group-${item.group}-${index}`} role="presentation">
                <div data-slot="select-group-label" className={cn(classNames?.label)}>
                  {item.group}
                </div>
                {item.options.map((option) => renderOption(option, flat.findIndex((o) => o.value === option.value)))}
              </div>) : (renderOption(item, flat.findIndex((o) => o.value === item.value)))))}
      </div>
    </>);
}
