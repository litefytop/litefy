"use client";

import * as React from "react";
import { type ClassNameValue, cn } from "..";

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
        "h-9 w-full px-3 py-2 text-sm border rounded-md outline-none cursor-pointer",
        "placeholder:text-muted-foreground focus:ring-inset focus:ring-1 focus:ring-ring",
        "aria-invalid:border-danger aria-invalid:text-danger",
        "aria-invalid:focus-visible:outline-1 aria-invalid:focus-visible:outline-danger aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-danger/50",
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
      tabIndex={-1}
      {...props}
      className={cn("bg-background text-foreground border shadow-lg rounded-lg", className)}
    />
  );
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

export interface PickerProps extends Omit<
  PickerInputProps,
  "value" | "defaultValue" | "onChange" | "className"
> {
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

export function Picker({
  className,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trailing,
  children,
  panelRef,
  classNames,
  styles,
  style,
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  ...props
}: PickerProps) {
  const anchorName = `--picker-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);

  const setPanelRefs = (el: HTMLDivElement | null) => {
    popoverRef.current = el;
    if (typeof panelRef === "function") panelRef(el);
    else if (panelRef) panelRef.current = el;
  };

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
      previouslyFocusedRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      popover.showPopover();
    } else {
      popover.hidePopover();
      const active = document.activeElement;
      if (
        (active === null || active === document.body || popover.contains(active)) &&
        previouslyFocusedRef.current
      ) {
        previouslyFocusedRef.current.focus?.();
      }
      previouslyFocusedRef.current = null;
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
        style={{ anchorName, ...style }}
        className={cn(className)}
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
        ref={setPanelRefs}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            handleOpenChange(false);
          }
        }}
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
