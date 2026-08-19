"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { type ClassNameValue, cn } from "@/lib";

type SelectOption = {
  label: string;
  value: string;
};

type SelectOptionGroup = {
  group: string;
  options: SelectOption[];
};

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export interface MultiSelectProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "className" | "type"
  > {
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
  emptyFallback?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: ClassNameValue;
  selectedIcon?: React.ReactNode;
  renderDisplay?: (
    selected: string[],
    options: (SelectOption | SelectOptionGroup)[],
  ) => React.ReactNode;
  slotProps?: {
    container?: HTMLAttrs<React.ComponentProps<"div">>;
    trigger?: HTMLAttrs<React.ComponentProps<"button">>;
    panel?: HTMLAttrs<React.ComponentProps<"div">>;
    option?: HTMLAttrs<React.ComponentProps<"div">>;
    group?: HTMLAttrs<React.ComponentProps<"div">>;
    groupLabel?: HTMLAttrs<React.ComponentProps<"div">>;
  };
}

function useSupportsAnchor() {
  const [supported, setSupported] = React.useState(false);
  React.useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports("anchor-name", "--test")) {
      setSupported(true);
    }
  }, []);
  return supported;
}

export function MultiSelect({
  value: controlledValue,
  defaultValue = [],
  onChange,
  options,
  placeholder = "Select...",
  emptyFallback = "No options available...",
  disabled = false,
  invalid = false,
  className,
  selectedIcon = "✓",
  renderDisplay,
  slotProps = {},
  ...inputProps
}: MultiSelectProps) {
  const id = React.useId();
  const triggerId = slotProps.trigger?.id || `multi-select-trigger-${id}`;
  const panelId = slotProps.panel?.id || `multi-select-panel-${id}`;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const supportsAnchor = useSupportsAnchor();
  const anchorName = `--anchor-${triggerId}`;
  const [panelPosition, setPanelPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected =
    controlledValue !== undefined ? controlledValue : internalValue;

  const flatOptions = React.useMemo(() => {
    const result: { label: string; value: string; group?: string }[] = [];
    for (const item of options) {
      if ("group" in item) {
        for (const opt of item.options) {
          result.push({ ...opt, group: item.group });
        }
      } else {
        result.push(item);
      }
    }
    return result;
  }, [options]);

  const valueToIndexMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const [index, opt] of flatOptions.entries()) {
      map.set(opt.value, index);
    }
    return map;
  }, [flatOptions]);

  const displayContent = React.useMemo(() => {
    if (renderDisplay) {
      return renderDisplay(selected, options);
    }
    return selected.length > 0
      ? `Selected ${selected.length} items`
      : placeholder;
  }, [selected, options, renderDisplay, placeholder]);

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    if (controlledValue === undefined) setInternalValue(newSelected);
    onChange?.(newSelected);
  };

  const updatePanelPosition = React.useCallback(() => {
    if (supportsAnchor) return;
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = triggerRect.bottom + 4;
    let left = triggerRect.left;
    if (top + panelRect.height > viewportHeight) {
      top = triggerRect.top - panelRect.height - 4;
    }
    if (left + panelRect.width > viewportWidth) {
      left = viewportWidth - panelRect.width - 8;
    }
    if (left < 8) left = 8;
    setPanelPosition({ top, left });
  }, [supportsAnchor]);

  const openPopover = React.useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.showPopover();
    setIsOpen(true);
    setHighlightIndex(-1);
    if (listRef.current) listRef.current.scrollTop = 0;
    updatePanelPosition();
  }, [updatePanelPosition]);

  const closePopover = React.useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.hidePopover();
    setIsOpen(false);
  }, []);

  const togglePopover = React.useCallback(() => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  }, [isOpen, openPopover, closePopover]);

  React.useEffect(() => {
    if (supportsAnchor || !isOpen) return;

    const handleUpdate = () => {
      if (timerRef.current) return;
      timerRef.current = setTimeout(() => {
        updatePanelPosition();
        timerRef.current = null;
      }, 100);
    };

    window.addEventListener("resize", handleUpdate);
    window.addEventListener("scroll", handleUpdate, { passive: true });

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [supportsAnchor, isOpen, updatePanelPosition]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev + 1 < flatOptions.length ? prev + 1 : prev,
        );
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < flatOptions.length) {
          toggleOption(flatOptions[highlightIndex].value);
        }
        break;
      }
      case "Escape": {
        closePopover();
        triggerRef.current?.focus();
        break;
      }
    }
  };

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const handleToggle = (e: Event) => {
      const open = (e as ToggleEvent).newState === "open";
      setIsOpen(open);
    };
    panel.addEventListener("toggle", handleToggle);
    return () => panel.removeEventListener("toggle", handleToggle);
  }, []);

  React.useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      const target = items[highlightIndex] as HTMLElement;
      if (target) {
        target.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex]);

  const panelStyle = supportsAnchor
    ? ({
        positionAnchor: anchorName,
        positionArea: "end center",
      } as React.CSSProperties)
    : panelPosition
      ? ({
          position: "fixed",
          top: panelPosition.top,
          left: panelPosition.left,
          margin: 0,
        } as React.CSSProperties)
      : undefined;

  const OptionItem = ({
    opt,
    isSelected,
    isHighlighted,
    onToggle,
  }: {
    opt: { label: string; value: string };
    isSelected: boolean;
    isHighlighted: boolean;
    onToggle: (value: string) => void;
  }) => (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
      data-active={isHighlighted || undefined}
      onClick={() => onToggle(opt.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(opt.value);
        }
      }}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "data-[active=true]:bg-accent data-[active=true]:ring-2 data-[active=true]:ring-ring",
        slotProps?.option?.className,
      )}
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-sm border border-primary",
          isSelected ? "bg-primary text-primary-foreground" : "bg-transparent",
        )}
      >
        {isSelected && selectedIcon}
      </span>
      <span className="flex-1 truncate">{opt.label}</span>
    </div>
  );

  const panelContent = (
    <div
      id={panelId}
      ref={panelRef}
      popover="auto"
      role="listbox"
      aria-multiselectable="true"
      className={cn(
        "w-full max-h-64 rounded-md border border-input bg-background shadow-lg overflow-auto p-1",
        slotProps?.panel?.className,
      )}
      style={panelStyle}
    >
      <div ref={listRef} className="space-y-0">
        {options.length === 0 ? (
          <div className="py-2 text-center text-sm text-muted-foreground">
            {emptyFallback}
          </div>
        ) : (
          options.map((item) => {
            if ("group" in item) {
              return (
                <div
                  key={item.group}
                  role="presentation"
                  {...slotProps?.group}
                  className={cn("py-1", slotProps?.group?.className)}
                >
                  <div
                    {...slotProps?.groupLabel}
                    className={cn(
                      "px-2 py-1 text-xs font-semibold text-muted-foreground",
                      slotProps?.groupLabel?.className,
                    )}
                  >
                    {item.group}
                  </div>
                  {item.options.map((opt) => {
                    const isSelected = selected.includes(opt.value);
                    const isHighlighted =
                      valueToIndexMap.get(opt.value) === highlightIndex;
                    return (
                      <OptionItem
                        key={opt.value}
                        opt={opt}
                        isSelected={isSelected}
                        isHighlighted={isHighlighted}
                        onToggle={toggleOption}
                      />
                    );
                  })}
                  <hr className="my-1 border-border" />
                </div>
              );
            }
            const isSelected = selected.includes(item.value);
            const isHighlighted =
              valueToIndexMap.get(item.value) === highlightIndex;
            return (
              <OptionItem
                key={item.value}
                opt={item}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                onToggle={toggleOption}
              />
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      <div
        {...slotProps?.container}
        className={cn(
          "relative inline-block w-full min-w-3xs max-w-sm",
          className,
        )}
      >
        <button
          {...slotProps?.trigger}
          ref={triggerRef}
          id={triggerId}
          type="button"
          disabled={disabled}
          onClick={togglePopover}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={panelId}
          data-invalid={invalid ? true : undefined}
          className={cn(
            "flex h-9 w-full min-w-3xs max-w-sm items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs group",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-invalid:border-destructive data-invalid:ring-destructive/20 data-invalid:text-destructive",
            slotProps?.trigger?.className,
          )}
          style={supportsAnchor ? { anchorName } : undefined}
        >
          <span className="truncate">{displayContent}</span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              "group-aria-expanded:rotate-180",
            )}
          />
        </button>
      </div>

      {createPortal(panelContent, document.body)}

      <input
        type="hidden"
        {...inputProps}
        value={selected.join(",")}
        disabled={disabled}
      />
    </>
  );
}
