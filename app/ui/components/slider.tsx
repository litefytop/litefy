"use client";
import * as React from "react";
import { resolveSlotClassName, type SlotClassName } from "../utils/cn";
export interface SliderRootProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function SliderRoot(props: SliderRootProps) {
    return <div {...props}/>;
}
export interface SliderTrackProps extends Omit<React.ComponentProps<"div">, "className" | "ref"> {
    className?: string;
    ref?: React.Ref<HTMLDivElement>;
}
export function SliderTrack({ className, ref, ...props }: SliderTrackProps) {
    return <div {...props} ref={ref} className={className}/>;
}
export interface SliderFillProps extends Omit<React.ComponentProps<"div">, "className"> {
    className?: string;
}
export function SliderFill(props: SliderFillProps) {
    return <div {...props} aria-hidden/>;
}
export interface SliderLabelProps extends Omit<React.ComponentProps<"label">, "className"> {
    className?: string;
}
export function SliderLabel(props: SliderLabelProps) {
    return <label {...props}/>;
}
export interface SliderValueProps extends Omit<React.ComponentProps<"span">, "className"> {
    className?: string;
}
export function SliderValue(props: SliderValueProps) {
    return <span {...props}/>;
}
export interface SliderThumbProps extends Omit<React.ComponentProps<"button">, "className" | "ref"> {
    className?: string;
    ref?: React.Ref<HTMLButtonElement>;
}
export function SliderThumb({ className, ref, ...props }: SliderThumbProps) {
    return (<button {...props} ref={ref} type="button" className={className}/>);
}
export interface SliderClassNames {
    track?: SlotClassName;
    fill?: SlotClassName;
    thumb?: SlotClassName;
    label?: SlotClassName;
    value?: SlotClassName;
    bubble?: string;
}
export interface SliderStyles {
    track?: React.CSSProperties;
    fill?: React.CSSProperties;
    thumb?: React.CSSProperties;
    label?: React.CSSProperties;
    value?: React.CSSProperties;
    bubble?: React.CSSProperties;
}
export type SliderProps = {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    defaultValue?: number;
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
    name?: string;
    label?: React.ReactNode;
    hideValue?: boolean;
    id?: string;
    "data-variant"?: string;
    onChange?: (val: number) => void;
    "aria-label"?: string;
    className?: string;
    style?: React.CSSProperties;
    classNames?: SliderClassNames;
    styles?: SliderStyles;
};
export function Slider({ min = 0, max = 100, step = 1, value: controlledValue, defaultValue = 0, orientation = "horizontal", disabled = false, name, label, hideValue = false, id, "data-variant": dataVariant, onChange, "aria-label": ariaLabel, className, style, classNames, styles, }: SliderProps) {
    const trackRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLButtonElement>(null);
    const dragRef = React.useRef({ dragging: false, pointerId: -1, startValue: 0 });
    const [dragging, setDragging] = React.useState(false);
    const [dragStartValue, setDragStartValue] = React.useState(0);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const autoId = React.useId();
    const thumbId = id ?? autoId;
    const labelId = label !== null && label !== undefined ? `${thumbId}-label` : undefined;
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : uncontrolledValue;
    const isVertical = orientation === "vertical";
    const clamp = (num: number) => Math.min(max, Math.max(min, num));
    const stepDecimals = (String(step).split(".")[1] ?? "").length;
    const alignStep = (num: number) => {
        return Number(clamp(Math.round((num - min) / step) * step + min).toFixed(stepDecimals));
    };
    const valueFromPointer = (clientX: number, clientY: number) => {
        const track = trackRef.current;
        if (!track)
            return currentValue;
        const rect = track.getBoundingClientRect();
        const ratio = isVertical
            ? 1 - (clientY - rect.top) / rect.height
            : (clientX - rect.left) / rect.width;
        return alignStep(min + Math.min(1, Math.max(0, ratio)) * (max - min));
    };
    const updateValue = (next: number) => {
        if (disabled)
            return;
        const aligned = alignStep(next);
        if (!isControlled)
            setUncontrolledValue(aligned);
        onChange?.(aligned);
    };
    const dragCleanupRef = React.useRef<(() => void) | null>(null);
    React.useEffect(() => () => {
        dragCleanupRef.current?.();
        dragCleanupRef.current = null;
        dragRef.current.dragging = false;
    }, []);
    const handleThumbPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (disabled || e.button !== 0)
            return;
        e.preventDefault();
        dragRef.current = { dragging: true, pointerId: e.pointerId, startValue: currentValue };
        setDragStartValue(currentValue);
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
        const onMove = (ev: PointerEvent) => {
            if (ev.pointerId !== dragRef.current.pointerId)
                return;
            updateValue(valueFromPointer(ev.clientX, ev.clientY));
        };
        const endDrag = () => {
            dragRef.current.dragging = false;
            setDragging(false);
            const thumb = thumbRef.current;
            if (thumb?.hasPointerCapture(dragRef.current.pointerId))
                thumb.releasePointerCapture(dragRef.current.pointerId);
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
            document.removeEventListener("pointercancel", onCancel);
            document.removeEventListener("keydown", onEsc);
            dragCleanupRef.current = null;
        };
        const onUp = (ev: PointerEvent) => {
            if (ev.pointerId !== dragRef.current.pointerId)
                return;
            endDrag();
        };
        const onCancel = (ev: PointerEvent) => {
            if (ev.pointerId !== dragRef.current.pointerId)
                return;
            updateValue(dragRef.current.startValue);
            endDrag();
        };
        const onEsc = (ev: KeyboardEvent) => {
            if (ev.key !== "Escape")
                return;
            updateValue(dragRef.current.startValue);
            endDrag();
        };
        dragCleanupRef.current?.();
        dragCleanupRef.current = endDrag;
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
        document.addEventListener("pointercancel", onCancel);
        document.addEventListener("keydown", onEsc);
    };
    const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (disabled)
            return;
        e.preventDefault();
        updateValue(valueFromPointer(e.clientX, e.clientY));
        thumbRef.current?.focus();
    };
    const handleThumbKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled)
            return;
        const largeStep = step * Math.max(1, Math.round((max - min) / 10 / step));
        let handled = true;
        switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
                updateValue(currentValue + step);
                break;
            case "ArrowLeft":
            case "ArrowDown":
                updateValue(currentValue - step);
                break;
            case "PageUp":
                updateValue(currentValue + largeStep);
                break;
            case "PageDown":
                updateValue(currentValue - largeStep);
                break;
            case "Home":
                updateValue(min);
                break;
            case "End":
                updateValue(max);
                break;
            default:
                handled = false;
        }
        if (handled)
            e.preventDefault();
    };
    const percent = max > min ? Math.min(100, Math.max(0, ((currentValue - min) / (max - min)) * 100)) : 0;
    const percentStr = `${percent}%`;
    const fillStyle: React.CSSProperties = isVertical
        ? { bottom: 0, left: 0, right: 0, height: percentStr }
        : { top: 0, bottom: 0, left: 0, width: percentStr };
    const thumbStyle: React.CSSProperties = isVertical
        ? { bottom: percentStr, left: "50%", transform: "translate(-50%, 50%)" }
        : { left: percentStr, top: "50%", transform: "translate(-50%, -50%)" };
    const delta = dragging ? Number((currentValue - dragStartValue).toFixed(stepDecimals)) : 0;
    const deltaText = delta === 0 ? "" : delta > 0 ? `+${delta}` : `${delta}`;
    const state = { disabled };
    return (<SliderRoot data-variant={dataVariant} className={className} data-disabled={disabled || undefined} aria-disabled={disabled || undefined} style={style}>
      {label !== null && label !== undefined && (<SliderLabel id={labelId} htmlFor={thumbId} className={resolveSlotClassName(classNames?.label, state)} style={styles?.label}>{label}</SliderLabel>)}
      <SliderTrack ref={trackRef} onPointerDown={handleTrackPointerDown} className={resolveSlotClassName(classNames?.track, state)} style={styles?.track}>
        <SliderFill className={resolveSlotClassName(classNames?.fill, state)} style={{ ...fillStyle, ...styles?.fill }}/>
        <SliderThumb ref={thumbRef} id={thumbId} disabled={disabled} tabIndex={disabled ? -1 : 0} role="slider" aria-labelledby={labelId} aria-label={labelId ? undefined : ariaLabel} aria-valuemin={min} aria-valuemax={max} aria-valuenow={currentValue} aria-orientation={orientation} aria-disabled={disabled || undefined} onPointerDown={handleThumbPointerDown} onKeyDown={handleThumbKeyDown} className={resolveSlotClassName(classNames?.thumb, state)} style={{ ...thumbStyle, ...styles?.thumb }}>
          <span aria-hidden data-show={deltaText || undefined} className={classNames?.bubble} style={styles?.bubble}>{deltaText}</span>
        </SliderThumb>
      </SliderTrack>
      {!hideValue && (<SliderValue aria-hidden className={resolveSlotClassName(classNames?.value, state)} style={styles?.value}>{currentValue}</SliderValue>)}
      {name && <input type="hidden" name={name} value={currentValue}/>}
    </SliderRoot>);
}
