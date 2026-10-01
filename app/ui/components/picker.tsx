"use client";
import * as React from "react";
import { type ClassNameValue, cn } from "../utils/cn";
import { useFloatingPanel } from "../utils/use-floating-panel";
import { useFloatingPosition, useMergedPanelRef } from "../utils/floating-position";
export interface PickerRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: ClassNameValue;
    /** Registers this element as the positioning anchor (`data-anchor-name`) for the panel. */
    anchorName?: string;
}
export function PickerRoot({ className, anchorName, ...props }: PickerRootProps) {
    return <div {...props} data-anchor-name={anchorName} className={cn("relative max-w-[40ch]", className)}/>;
}
export interface PickerInputProps extends Omit<React.ComponentProps<"input">, "className"> {
    className?: ClassNameValue;
}
export function PickerInput({ className, ...props }: PickerInputProps) {
    const autoId = React.useId();
    const id = props.id ?? autoId;
    return (<input role="combobox" {...props} id={id} className={cn("h-9 w-full px-3 py-2 text-sm border rounded-md outline-none cursor-pointer", "placeholder:text-muted-foreground focus:ring-inset focus:ring-1 focus:ring-ring", "aria-invalid:border-danger aria-invalid:text-danger", "aria-invalid:focus-visible:outline-1 aria-invalid:focus-visible:outline-danger aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-danger/50", className)}/>);
}
export interface PickerContentProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: ClassNameValue;
    /** Anchor element name (matching the anchor's `data-anchor-name`) consumed by the built-in JS positioning. */
    anchorName?: string;
}
export function PickerContent({ className, anchorName, ref, ...props }: PickerContentProps) {
    const panelRef = useMergedPanelRef<HTMLDivElement>(ref);
    useFloatingPosition(panelRef, anchorName);
    return (<div ref={panelRef} popover="manual" tabIndex={-1} {...props} data-float-anchor={anchorName} data-float-side="bottom" data-float-align="center" data-float-gap={4} data-float-match-width={anchorName ? "true" : undefined} className={cn("bg-surface-raised text-foreground border shadow-elevated rounded-xl", className)}/>);
}
export interface PickerClassNames {
    input?: ClassNameValue;
    trailing?: ClassNameValue;
    popover?: ClassNameValue;
}
export interface PickerStyles {
    input?: React.CSSProperties;
    trailing?: React.CSSProperties;
    popover?: React.CSSProperties;
}
export interface PickerProps extends Omit<PickerInputProps, "value" | "defaultValue" | "onChange" | "className"> {
    className?: ClassNameValue;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    trailing?: React.ReactNode;
    children?: React.ReactNode;
    panelRef?: React.Ref<HTMLDivElement>;
    classNames?: PickerClassNames;
    styles?: PickerStyles;
}
export function Picker({ className, value: controlledValue, defaultValue = "", onValueChange, open: controlledOpen, defaultOpen = false, onOpenChange, trailing, children, panelRef, classNames, styles, style, onClick: onClickProp, onKeyDown: onKeyDownProp, ...props }: PickerProps) {
    const anchorName = `--picker-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const setPanelRefs = (el: HTMLDivElement | null) => {
        popoverRef.current = el;
        if (typeof panelRef === "function")
            panelRef(el);
        else if (panelRef)
            panelRef.current = el;
    };
    const [uncontrolledValue, setValue] = React.useState(defaultValue);
    const [uncontrolledOpen, setOpen] = React.useState(defaultOpen);
    const isValueControlled = controlledValue !== undefined;
    const isOpenControlled = controlledOpen !== undefined;
    const value = isValueControlled ? controlledValue : uncontrolledValue;
    const open = isOpenControlled ? controlledOpen : uncontrolledOpen;
    const handleOpenChange = React.useCallback((next: boolean) => {
        if (!isOpenControlled)
            setOpen(next);
        onOpenChange?.(next);
    }, [isOpenControlled, onOpenChange]);
    useFloatingPanel({
        open,
        panelRef: popoverRef,
        onOpenChange: handleOpenChange,
        restoreFocus: true,
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isValueControlled)
            setValue(e.target.value);
        onValueChange?.(e.target.value);
    };
    return (<>
      <PickerRoot anchorName={anchorName} style={style} className={cn(className)} data-open={open || undefined}>
        <PickerInput {...props} style={styles?.input} value={value} aria-expanded={open} onClick={(e) => {
            onClickProp?.(e);
            if (!e.defaultPrevented)
                handleOpenChange(!open);
        }} onChange={handleInputChange} onKeyDown={(e) => {
            onKeyDownProp?.(e);
            if (e.defaultPrevented)
                return;
            if (e.key === "Escape") {
                handleOpenChange(false);
                return;
            }
            if (e.key === "ArrowDown" && !open) {
                e.preventDefault();
                handleOpenChange(true);
            }
        }} className={cn(trailing && "pr-9", classNames?.input)}/>
        {trailing && (<span style={styles?.trailing} className={cn("pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:size-4", classNames?.trailing)}>
            {trailing}
          </span>)}
      </PickerRoot>
      <PickerContent ref={setPanelRefs} anchorName={anchorName} onKeyDown={(e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                handleOpenChange(false);
            }
        }} style={styles?.popover} className={classNames?.popover}>
        {children}
      </PickerContent>
    </>);
}
