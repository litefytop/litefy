"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { type ClassNameValue, cn } from "..";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectOptionGroup = {
  group: string;
  options: SelectOption[];
};

export interface SelectProps
  extends Omit<
    React.ComponentProps<"button">,
    "onChange" | "value" | "defaultValue" | "children" | "type"
  > {
  options: (SelectOption | SelectOptionGroup)[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  /** Renders a hidden input with this name, so the value joins native form submission. */
  name?: string;
  classNames?: {
    trigger?: ClassNameValue;
    panel?: ClassNameValue;
    label?: ClassNameValue;
    option?: ClassNameValue;
  };
  styles?: {
    trigger?: React.CSSProperties;
    panel?: React.CSSProperties;
  };
}

export function Select({
  options,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  placeholder,
  invalid,
  disabled,
  required,
  name,
  classNames,
  styles,
  ...props
}: SelectProps) {
  const isControlled = controlledValue !== undefined;
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const anchorName = `--select-${uid}`;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const [uncontrolledOpen, setOpen] = React.useState(false);
  const [uncontrolledValue, setValue] = React.useState(defaultValue);
  const [highlightIndex, setHighlightIndex] = React.useState<number | null>(null);

  const isOpenControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const open = uncontrolledOpen;

  const flat = React.useMemo(
    () => options.flatMap((item) => ("options" in item ? item.options : [item])),
    [options],
  );
  const selectedLabel = flat.find((option) => option.value === value)?.label ?? null;

  const setOpenState = (next: boolean) => {
    setOpen(next);
    if (next) {
      const selectedIdx = flat.findIndex((option) => option.value === value);
      setHighlightIndex(selectedIdx === -1 ? (flat.length ? 0 : null) : selectedIdx);
    } else {
      setHighlightIndex(null);
    }
  };

  const commit = (option: SelectOption) => {
    if (!isControlled) setValue(option.value);
    onValueChange?.(option.value);
    setOpen(false);
    setHighlightIndex(null);
    triggerRef.current?.focus();
  };

  const moveHighlight = (delta: 1 | -1) => {
    if (flat.length === 0) return;
    setHighlightIndex((prev) => {
      if (prev === null) return delta === 1 ? 0 : flat.length - 1;
      return (prev + delta + flat.length) % flat.length;
    });
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpenState(true);
        else moveHighlight(e.key === "ArrowDown" ? 1 : -1);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && highlightIndex !== null) commit(flat[highlightIndex]);
        else setOpenState(!open);
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

  // Popover lifecycle (manual popover + CSS anchor positioning, same recipe as Picker).
  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (open) panel.showPopover();
    else panel.hidePopover();
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleDocumentMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, [open]);

  // Keep the highlighted option in view while moving through the list.
  React.useEffect(() => {
    if (!open || highlightIndex === null) return;
    panelRef.current
      ?.querySelector('[data-highlighted="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [open, highlightIndex]);

  const renderOption = (option: SelectOption, index: number) => (
    <div
      key={option.value}
      role="option"
      aria-selected={option.value === value}
      data-highlighted={highlightIndex === index || undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : () => commit(option)}
      className={cn(
        "cursor-pointer px-3 py-2 text-sm transition-colors select-none hover:bg-hover",
        "data-[highlighted=true]:bg-hover",
        option.value === value && "font-medium",
        disabled && "pointer-events-none opacity-50",
        classNames?.option,
      )}
    >
      {option.label}
    </div>
  );

  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        {...props}
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-haspopup="listbox"
        aria-expanded={open || undefined}
        aria-required={required || undefined}
        onClick={() => !disabled && setOpenState(!open)}
        onKeyDown={handleTriggerKeyDown}
        data-open={open || undefined}
        className={cn(
          "flex h-9 w-full min-w-3xs max-w-sm items-center justify-between gap-2 rounded-md border bg-background/90 px-3 py-1 text-sm cursor-pointer",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          "aria-invalid:border-danger aria-invalid:text-danger",
          "aria-invalid:focus-visible:outline-1 aria-invalid:focus-visible:outline-danger aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-danger/50",
          disabled && "cursor-not-allowed opacity-50",
          !selectedLabel && "text-muted-foreground",
          classNames?.trigger,
        )}
        style={{ anchorName, ...styles?.trigger }}
      >
        <span className="truncate">{selectedLabel ?? placeholder ?? ""}</span>
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[open]:rotate-180 data-[open=true]:rotate-180"
          data-open={open || undefined}
        />
      </button>
      <div
        ref={panelRef}
        popover="manual"
        tabIndex={-1}
        role="listbox"
        aria-label={placeholder}
        className={cn(
          "bg-background text-foreground max-h-64 overflow-y-auto rounded-md border p-1 shadow-lg",
          classNames?.panel,
        )}
        style={{
          margin: "4px 0 0",
          positionAnchor: anchorName,
          positionArea: "bottom span-right",
          justifySelf: "start",
          minWidth: "anchor-size(width)",
          positionTryFallbacks: "flip-block",
          ...styles?.panel,
        }}
      >
        {flat.length === 0 ? (
          <div className="pointer-events-none px-3 py-2 text-sm text-muted-foreground">
            No options available
          </div>
        ) : (
          options.map((item, index) =>
            "options" in item ? (
              <div key={`group-${item.group}-${index}`} role="presentation">
                <div
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium text-muted-foreground",
                    classNames?.label,
                  )}
                >
                  {item.group}
                </div>
                {item.options.map((option) =>
                  renderOption(
                    option,
                    flat.findIndex((o) => o.value === option.value),
                  ),
                )}
              </div>
            ) : (
              renderOption(
                item,
                flat.findIndex((o) => o.value === item.value),
              )
            ),
          )
        )}
      </div>
    </>
  );
}
