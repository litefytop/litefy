"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "@/lib";

export interface PickerRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function PickerRoot({ className, ...props }: PickerRootProps) {
  return <div {...props} className={cn("relative", className)} />;
}

export interface PickerInputProps extends Omit<React.ComponentProps<"input">, "className"> {
  className?: ClassNameValue;
}

export function PickerInput({ className, ...props }: PickerInputProps) {
  return (
    <input
      {...props}
      className={cn(
        "h-9 w-full px-3 py-2 text-sm border rounded-md bg-muted outline-none cursor-pointer",
        "placeholder:text-muted-foreground focus:ring-inset focus:ring-1 focus:ring-ring",
        className,
      )}
    />
  );
}

export interface PickerContentProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function PickerContent({ className, ...props }: PickerContentProps) {
  return (
    <div
      popover="manual"
      {...props}
      className={cn(
        "bg-popover text-popover-foreground border shadow-lg rounded-md",
        className,
      )}
    />
  );
}

export interface PickerClassNames {
  root?: ClassNameValue;
  input?: ClassNameValue;
  trailing?: ClassNameValue;
  popover?: ClassNameValue;
}

export interface PickerStyles {
  root?: React.CSSProperties;
  input?: React.CSSProperties;
  trailing?: React.CSSProperties;
  popover?: React.CSSProperties;
}

export interface PickerProps
  extends Omit<PickerInputProps, "value" | "defaultValue" | "onChange" | "className"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: PickerClassNames;
  styles?: PickerStyles;
}

export function Picker({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trailing,
  children,
  classNames,
  styles,
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  ...props
}: PickerProps) {
  const anchorName = `--picker-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const [uncontrolledValue, setValue] = React.useState(defaultValue);
  const [uncontrolledOpen, setOpen] = React.useState(defaultOpen);
  const isValueControlled = controlledValue !== undefined;
  const isOpenControlled = controlledOpen !== undefined;
  const value = isValueControlled ? controlledValue : uncontrolledValue;
  const open = isOpenControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setOpen(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  React.useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;
    if (open) {
      popover.showPopover();
    } else {
      popover.hidePopover();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleDocumentMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (popoverRef.current?.contains(target)) return;
      handleOpenChange(false);
    };
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, [open, handleOpenChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValueControlled) setValue(e.target.value);
    onValueChange?.(e.target.value);
  };

  return (
    <>
      <PickerRoot
        style={{ anchorName, ...styles?.root }}
        className={classNames?.root}
        data-open={open || undefined}
      >
        <PickerInput
          {...props}
          style={styles?.input}
          value={value}
          aria-expanded={open}
          onClick={(e) => {
            onClickProp?.(e);
            if (!e.defaultPrevented) handleOpenChange(!open);
          }}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            onKeyDownProp?.(e);
            if (e.defaultPrevented) return;
            if (e.key === "Escape") {
              handleOpenChange(false);
              return;
            }
            if (e.key === "ArrowDown" && !open) {
              e.preventDefault();
              handleOpenChange(true);
            }
          }}
          className={cn(trailing && "pr-9", classNames?.input)}
        />
        {trailing && (
          <span
            style={styles?.trailing}
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground [&>svg]:size-4",
              classNames?.trailing,
            )}
          >
            {trailing}
          </span>
        )}
      </PickerRoot>
      <PickerContent
        ref={popoverRef}
        style={{
          margin: "4px 0 0",
          positionAnchor: anchorName,
          positionArea: "bottom span-right",
          justifySelf: "start",
          minWidth: "anchor-size(width)",
          positionTryFallbacks: "flip-block",
          ...styles?.popover,
        }}
        className={classNames?.popover}
      >
        {children}
      </PickerContent>
    </>
  );
}
