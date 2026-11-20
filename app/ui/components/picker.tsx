"use client";
import * as React from "react";
import { useFloatingPanel } from "../utils/use-floating-panel";
import { useFloatingPosition, useMergedPanelRef } from "../utils/floating-position";
export interface PickerRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
    anchorName?: string;
}
export function PickerRoot({ className, anchorName, ...props }: PickerRootProps) {
    return <div {...props} data-anchor-name={anchorName} className={className}/>;
}
export interface PickerInputProps extends Omit<React.ComponentProps<"input">, "className"> {
    className?: string;
}
export function PickerInput({ "aria-expanded": ariaExpanded = false, ...props }: PickerInputProps) {
    const autoId = React.useId();
    const id = props.id ?? autoId;
    return (<input role="combobox" {...props} aria-expanded={ariaExpanded} id={id}/>);
}
export interface PickerContentProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
    anchorName?: string;
    /** 下拉列表需要跟随锚点宽度；日历等自有尺寸的面板应传 false，避免被窄字段压缩。 */
    matchWidth?: boolean;
}
export function PickerContent({ className, anchorName, matchWidth = true, ref, ...props }: PickerContentProps) {
    const panelRef = useMergedPanelRef<HTMLDivElement>(ref);
    useFloatingPosition(panelRef, anchorName);
    return (<div ref={panelRef} popover="manual" role="dialog" tabIndex={-1} {...props} data-float-anchor={anchorName} data-float-side="bottom" data-float-align="center" data-float-gap={4} data-float-match-width={matchWidth && anchorName ? "true" : undefined} className={className}/>);
}
export interface PickerClassNames {
    input?: string;
    leading?: string;
    trailing?: string;
    popover?: string;
}
export interface PickerStyles {
    input?: React.CSSProperties;
    leading?: React.CSSProperties;
    trailing?: React.CSSProperties;
    popover?: React.CSSProperties;
}
export interface PickerProps extends Omit<PickerInputProps, "value" | "defaultValue" | "onChange" | "className"> {
    className?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    children?: React.ReactNode;
    panelRef?: React.Ref<HTMLDivElement>;
    matchPanelWidth?: boolean;
    classNames?: PickerClassNames;
    styles?: PickerStyles;
}
export function Picker({ className, value: controlledValue, defaultValue = "", onValueChange, open: controlledOpen, defaultOpen = false, onOpenChange, leading, trailing, children, panelRef, matchPanelWidth = true, classNames, styles, style, onClick: onClickProp, onKeyDown: onKeyDownProp, "aria-invalid": ariaInvalid, ...props }: PickerProps) {
    const anchorName = `--picker-${React.useId().replaceAll(/[^a-zA-Z0-9_-]/gu, "")}`;
    const panelId = `${anchorName}-panel`;
    const popoverRef = useMergedPanelRef<HTMLDivElement>(panelRef);
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
      <PickerRoot anchorName={anchorName} style={style} className={className} data-open={open || undefined} data-invalid={ariaInvalid || undefined}>
        {leading ? (<span className={classNames?.leading} style={styles?.leading}>{leading}</span>) : null}
        <PickerInput {...props} aria-invalid={ariaInvalid} style={styles?.input} value={value} aria-expanded={open} aria-controls={panelId} onClick={(e) => {
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
        }} data-trailing={trailing ? "true" : undefined} className={classNames?.input}/>
        {trailing && (<span style={styles?.trailing} className={classNames?.trailing}>
            {trailing}
          </span>)}
      </PickerRoot>
      <PickerContent ref={popoverRef} id={panelId} anchorName={anchorName} matchWidth={matchPanelWidth} onKeyDown={(e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                handleOpenChange(false);
            }
        }} style={styles?.popover} className={classNames?.popover}>
        {children}
      </PickerContent>
    </>);
}
