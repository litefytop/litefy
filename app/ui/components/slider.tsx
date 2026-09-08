"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

export interface SliderRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function SliderRoot({ className, ...props }: SliderRootProps) {
  return <div {...props} className={cn("relative", className)} />;
}

export interface SliderTrackProps extends Omit<React.ComponentProps<"div">, "className" | "ref"> {
  className?: ClassNameValue;
  ref?: React.Ref<HTMLDivElement>;
}

export function SliderTrack({ className, ref, ...props }: SliderTrackProps) {
  return <div {...props} ref={ref} className={cn("relative touch-none select-none", className)} />;
}

export interface SliderFillProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function SliderFill({ className, ...props }: SliderFillProps) {
  return <div {...props} aria-hidden className={cn("absolute", className)} />;
}

export interface SliderThumbProps extends Omit<
  React.ComponentProps<"button">,
  "className" | "ref"
> {
  className?: ClassNameValue;
  ref?: React.Ref<HTMLButtonElement>;
}

export function SliderThumb({ className, ref, ...props }: SliderThumbProps) {
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      className={cn("absolute block outline-none", className)}
    />
  );
}

export interface SliderClassNames {
  track?: ClassNameValue;
  fill?: ClassNameValue;
  thumb?: ClassNameValue;
}

export interface SliderStyles {
  track?: React.CSSProperties;
  fill?: React.CSSProperties;
  thumb?: React.CSSProperties;
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
  onChange?: (val: number) => void;
  invalid?: boolean;
  "aria-label"?: string;
  className?: ClassNameValue;
  style?: React.CSSProperties;
  classNames?: SliderClassNames;
  styles?: SliderStyles;
};

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue = 0,
  orientation = "horizontal",
  disabled = false,
  name,
  onChange,
  invalid,
  "aria-label": ariaLabel,
  className,
  style,
  classNames,
  styles,
}: SliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLButtonElement>(null);
  const dragRef = React.useRef({ dragging: false, pointerId: -1 });
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : uncontrolledValue;
  const isVertical = orientation === "vertical";

  const clamp = (num: number) => Math.min(max, Math.max(min, num));

  const alignStep = (num: number) => {
    const decimals = (String(step).split(".")[1] ?? "").length;
    return Number(clamp(Math.round((num - min) / step) * step + min).toFixed(decimals));
  };

  const valueFromPointer = (clientX: number, clientY: number) => {
    const track = trackRef.current;
    if (!track) return currentValue;
    const rect = track.getBoundingClientRect();
    const ratio = isVertical
      ? 1 - (clientY - rect.top) / rect.height
      : (clientX - rect.left) / rect.width;
    return alignStep(min + Math.min(1, Math.max(0, ratio)) * (max - min));
  };

  const updateValue = (next: number) => {
    if (disabled) return;
    const aligned = alignStep(next);
    if (!isControlled) setUncontrolledValue(aligned);
    onChange?.(aligned);
  };

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || e.button !== 0) return;
    e.preventDefault();
    dragRef.current = { dragging: true, pointerId: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== dragRef.current.pointerId) return;
      updateValue(valueFromPointer(ev.clientX, ev.clientY));
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== dragRef.current.pointerId) return;
      dragRef.current.dragging = false;
      thumbRef.current?.releasePointerCapture(dragRef.current.pointerId);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    updateValue(valueFromPointer(e.clientX, e.clientY));
    thumbRef.current?.focus();
  };

  const handleThumbKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
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
    if (handled) e.preventDefault();
  };

  const percent =
    max > min ? Math.min(100, Math.max(0, ((currentValue - min) / (max - min)) * 100)) : 0;
  const percentStr = `${percent}%`;

  const fillStyle: React.CSSProperties = isVertical
    ? { bottom: 0, left: 0, right: 0, height: percentStr }
    : { top: 0, bottom: 0, left: 0, width: percentStr };

  const thumbStyle: React.CSSProperties = isVertical
    ? { bottom: percentStr, left: "50%", transform: "translate(-50%, 50%)" }
    : { left: percentStr, top: "50%", transform: "translate(-50%, -50%)" };

  return (
    <SliderRoot
      className={cn("group", className)}
      style={style}
      data-invalid={invalid || undefined}
    >
      <SliderTrack
        ref={trackRef}
        onPointerDown={handleTrackPointerDown}
        className={cn(
          "rounded-full bg-muted",
          isVertical ? "h-64 w-2" : "h-2 w-3xs",

          classNames?.track,
        )}
        style={styles?.track}
      >
        <SliderFill
          className={cn("rounded-full bg-primary", classNames?.fill)}
          style={{ ...fillStyle, ...styles?.fill }}
        />
        <SliderThumb
          ref={thumbRef}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          role="slider"
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          aria-orientation={orientation}
          aria-disabled={disabled || undefined}
          onPointerDown={handleThumbPointerDown}
          onKeyDown={handleThumbKeyDown}
          className={cn(
            "size-5 touch-none rounded-full border-2 border-primary bg-background shadow-sm",
            "cursor-grab active:cursor-grabbing",
            "group-data-invalid:border-danger",
            classNames?.thumb,
          )}
          style={{ ...thumbStyle, ...styles?.thumb }}
        />
      </SliderTrack>
      {name && <input type="hidden" name={name} value={currentValue} />}
    </SliderRoot>
  );
}
