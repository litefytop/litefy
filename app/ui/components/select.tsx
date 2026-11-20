"use client";
import * as React from "react";
import { ChevronDown } from "./icons";
import { useFloatingPanel } from "../utils/use-floating-panel";
import { useFloatingPosition } from "../utils/floating-position";
import { Field, type FieldClassNames, type FieldValidateResult } from "./field";
export type SelectOption = {
    label: string;
    value: string;
};
export type SelectOptionGroup = {
    group: string;
    options: SelectOption[];
};
export interface SelectClassNames {
    panel?: string;
    label?: string;
    option?: string;
    value?: string;
    chevron?: string;
    empty?: string;
}
export interface SelectProps extends Omit<React.ComponentProps<"button">, "onChange" | "value" | "defaultValue" | "children" | "type" | "className" | "style"> {
    options: (SelectOption | SelectOptionGroup)[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    placeholder?: string;
    label?: React.ReactNode;
    description?: React.ReactNode;
    validate?: (value: string) => FieldValidateResult | Promise<FieldValidateResult>;
    validateTrigger?: "submit" | "change" | "blur";
    fieldClassNames?: FieldClassNames;
    name?: string;
    className?: string;
    style?: React.CSSProperties;
    classNames?: SelectClassNames;
    chevronNode?: React.ReactNode;
    styles?: {
        panel?: React.CSSProperties;
    };
}
export function Select({ options, value: controlledValue, defaultValue = "", onValueChange, placeholder, label, description, validate, validateTrigger, fieldClassNames, disabled, name, className, style, "aria-haspopup": ariaHasPopup, classNames, chevronNode, styles, open: controlledOpen, onOpenChange, ref, ...props }: SelectProps) {
    const isControlled = controlledValue !== undefined;
    const isOpenControlled = controlledOpen !== undefined;
    const uid = React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "");
    const anchorName = `--select-${uid}`;
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const hiddenRef = React.useRef<HTMLInputElement>(null);
    const mountedRef = React.useRef(false);
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
    const [uncontrolledValue, setValue] = React.useState(defaultValue);
    const [highlightIndex, setHighlightIndex] = React.useState<number | null>(null);
    const value = isControlled ? controlledValue : uncontrolledValue;
    const open = isOpenControlled ? controlledOpen : uncontrolledOpen;
    const flat = React.useMemo(() => options.flatMap((item) => ("options" in item ? item.options : [item])), [options]);
    const selectedLabel = flat.find((option) => option.value === value)?.label ?? null;
    const setOpenState = (next: boolean) => {
        if (!isOpenControlled)
            setUncontrolledOpen(next);
        onOpenChange?.(next);
    };
    const [prevOpen, setPrevOpen] = React.useState(open);
    if (open !== prevOpen) {
        setPrevOpen(open);
        if (!open) {
            setHighlightIndex(null);
        }
        else {
            const selectedIdx = flat.findIndex((option) => option.value === value);
            setHighlightIndex(selectedIdx === -1 ? (flat.length ? 0 : null) : selectedIdx);
        }
    }
    React.useEffect(() => {
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }
        if (name) {
            hiddenRef.current?.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: value }));
        }
    }, [value, name]);
    const setTriggerRef = (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") {
            ref(node);
        }
        else if (ref) {
            ref.current = node;
        }
    };
    const commit = (option: SelectOption) => {
        if (!isControlled)
            setValue(option.value);
        onValueChange?.(option.value);
        triggerRef.current?.focus();
        setOpenState(false);
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
        props.onKeyDown?.(e);
        if (e.defaultPrevented || disabled)
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
                break;
        }
    };
    useFloatingPanel({
        open,
        panelRef,
        anchorRef: triggerRef,
        onOpenChange: (next) => {
            if (!next)
                setOpenState(false);
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
    const renderOption = (option: SelectOption, index: number) => (<div key={option.value} id={`${anchorName}-${index}`} role="option" aria-selected={option.value === value} data-highlighted={highlightIndex === index || undefined} data-selected={option.value === value || undefined} data-disabled={disabled || undefined} onClick={disabled ? undefined : () => commit(option)} className={classNames?.option}>
      {option.label}
    </div>);
    const composeBody = (field?: { id: string; describedBy: string | undefined; invalid: boolean }) => (<>
      {name && <input type="hidden" ref={hiddenRef} name={name} value={value}/>}
      <button {...props} ref={setTriggerRef} type="button" role="combobox" disabled={disabled} id={field?.id ?? props.id} aria-describedby={field?.describedBy ?? props["aria-describedby"]} aria-invalid={field?.invalid || undefined} aria-haspopup={ariaHasPopup ?? "listbox"} aria-expanded={open} aria-controls={`${anchorName}-panel`} aria-activedescendant={open && highlightIndex !== null ? `${anchorName}-${highlightIndex}` : undefined} data-open={open || undefined} data-placeholder-shown={!selectedLabel || undefined} data-anchor-name={anchorName} onClick={() => !disabled && setOpenState(!open)} onKeyDown={handleTriggerKeyDown} className={className} style={style}>
        {label}
        <span className={classNames?.value}>{selectedLabel ?? placeholder ?? ""}</span>
        {chevronNode ?? <ChevronDown aria-hidden className={classNames?.chevron} data-open={open || undefined}/>}
      </button>
      <div ref={panelRef} id={`${anchorName}-panel`} popover="manual" tabIndex={-1} role="listbox" aria-label={placeholder ?? (typeof label === "string" ? label : undefined)} data-float-anchor={anchorName} data-float-side="bottom" data-float-align="center" data-float-gap={4} data-float-match-width="true" className={classNames?.panel} style={styles?.panel}>
        {flat.length === 0 ? (<div className={classNames?.empty}>
            No options available
          </div>) : (options.map((item) => "options" in item ? (<div key={item.group} role="presentation">
                <div className={classNames?.label}>
                  {item.group}
                </div>
                {item.options.map((option) => renderOption(option, flat.findIndex((o) => o.value === option.value)))}
              </div>) : (renderOption(item, flat.findIndex((o) => o.value === item.value)))))}
      </div>
    </>);
    if (description === undefined && validate === undefined) {
        return composeBody();
    }
    return (<Field
      name={name ?? ""}
      description={description}
      validate={validate}
      validateTrigger={validateTrigger}
      fieldClassNames={fieldClassNames}
    >
      {(f) => composeBody({ id: f.id, describedBy: f.describedBy, invalid: f.invalid })}
    </Field>);
}
