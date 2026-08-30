"use client";
import { ChevronDown } from "lucide-react";
import * as React from "react";
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

export interface MultiSelectRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function MultiSelectRoot({ className, ...props }: MultiSelectRootProps) {
  return <div className={cn(className)} {...props} />;
}

export interface MultiSelectTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
}
export function MultiSelectTrigger({ className, ...props }: MultiSelectTriggerProps) {
  return (
    <button
      type="button"
      aria-haspopup="listbox"
      className={cn(className)}
      {...props}
    />
  );
}

export interface MultiSelectPopoverProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function MultiSelectPopover({ className, ...props }: MultiSelectPopoverProps) {
  return (
    <div
      popover="manual"
      role="listbox"
      aria-multiselectable="true"
      className={cn(className)}
      {...props}
    />
  );
}

export interface MultiSelectGroupProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function MultiSelectGroup({ className, ...props }: MultiSelectGroupProps) {
  return <div role="presentation" className={cn(className)} {...props} />;
}

export interface MultiSelectLabelProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function MultiSelectLabel({ className, ...props }: MultiSelectLabelProps) {
  return <div className={cn(className)} {...props} />;
}

export interface MultiSelectOptionProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
}
export function MultiSelectOption({ className, ...props }: MultiSelectOptionProps) {
  return <li role="option" className={cn(className)} {...props} />;
}

export interface MultiSelectProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "className" | "type"
> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  options: (SelectOption | SelectOptionGroup)[];
  placeholder?: string;
  empty?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  selectedIcon?: React.ReactNode;
  slotProps?: {
    container?: HTMLAttrs<React.ComponentProps<"div">>;
    trigger?: HTMLAttrs<React.ComponentProps<"button">>;
    panel?: HTMLAttrs<React.ComponentProps<"div">>;
    option?: HTMLAttrs<React.ComponentProps<"li">>;
    group?: HTMLAttrs<React.ComponentProps<"div">>;
    groupLabel?: HTMLAttrs<React.ComponentProps<"div">>;
  };
}

export function MultiSelect({
  value,
  defaultValue = [],
  onChange,
  options,
  placeholder = "Select...",
  empty = "No options available...",
  disabled = false,
  invalid = false,
  selectedIcon = "✓",
  slotProps = {},
  ...props
}: MultiSelectProps) {
  const id = React.useId();
  const triggerId = slotProps.trigger?.id || `multi-select-trigger-${id}`;
  const panelId = slotProps.panel?.id || `multi-select-panel-${id}`;
  const anchorName = `--multi-select-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const [_value, setValue] = React.useState(defaultValue);
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const value$ = value !== undefined ? value : _value;

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
    if (value$.length === 0) {
      return placeholder;
    }
    if (value$.length === 1) {
      const found = flatOptions.find((opt) => opt.value === value$[0]);
      return found?.label ?? value$[0];
    }
    return `Selected ${value$.length} items`;
  }, [value$, placeholder, flatOptions]);

  const toggleOption = (option: string) => {
    const newSelected = value$.includes(option)
      ? value$.filter((v) => v !== option)
      : [...value$, option];
    if (value === undefined) setValue(newSelected);
    onChange?.(newSelected);
  };

  const openPopover = React.useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.showPopover();
    setIsOpen(true);
    setHighlightIndex(-1);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, []);

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
    if (!isOpen) return;
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closePopover();
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [isOpen, closePopover]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) return;
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1 < flatOptions.length ? prev + 1 : prev));
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
      const items = listRef.current.querySelectorAll<HTMLElement>('[role="option"]');
      const target = items[highlightIndex];
      if (target) {
        target.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex]);

  const renderOption = (opt: SelectOption) => {
    const isSelected = value$.includes(opt.value);
    const isHighlighted = valueToIndexMap.get(opt.value) === highlightIndex;
    return (
      <MultiSelectOption
        key={opt.value}
        {...slotProps?.option}
        tabIndex={-1}
        aria-selected={isSelected}
        data-active={isHighlighted || undefined}
        onClick={() => toggleOption(opt.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleOption(opt.value);
          }
        }}
        className={["flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
          "hover:bg-hover data-[active=true]:bg-hover",
          slotProps?.option?.className]}
      >
        <span
          aria-selected={isSelected}
          className={cn(
            "flex size-4 items-center justify-center rounded-sm border border-primary",
             "aria-selected:bg-primary aria-selected:text-primary-foreground bg-transparent",
          )}
        >
          {isSelected && selectedIcon}
        </span>
        <span className="flex-1 truncate">{opt.label}</span>
      </MultiSelectOption>
    );
  };

  return (
    <MultiSelectRoot
      {...slotProps?.container}
      className={cn(
        "relative w-sm",
        slotProps?.container?.className,
      )}
    >
      <MultiSelectTrigger
        {...slotProps?.trigger}
        ref={triggerRef}
        id={triggerId}
        disabled={disabled}
        onClick={togglePopover}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-invalid={invalid ? true : undefined}
        style={{ anchorName, ...slotProps?.trigger?.style }}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border   px-3 text-sm group",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-invalid:border-destructive-accent data-invalid:ring-destructive data-invalid:text-destructive",
          slotProps?.trigger?.className,
        )}
      >
        {displayContent}
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            "group-aria-expanded:rotate-180",
          )}
        />
      </MultiSelectTrigger>

      <MultiSelectPopover
        ref={panelRef}
        id={panelId}
        {...slotProps?.panel}
        style={{
          margin: "4px 0 0",
          positionAnchor: anchorName,
          positionArea: "bottom span-right",
          justifySelf: "start",
          width: "anchor-size(width)",
          positionTryFallbacks: "flip-block",
          ...slotProps?.panel?.style,
        }}
        className={cn(
          "max-h-64 rounded-md border border-input shadow-lg overflow-auto p-1",
          slotProps?.panel?.className,
        )}
      >
        <ul ref={listRef} className="m-0 p-0 list-none space-y-0">
          {options.length === 0 ? (
            <li className="py-2 text-center text-sm text-muted-foreground">{empty}</li>
          ) : (
            options.map((item) => {
              if ("group" in item) {
                return (
                  <MultiSelectGroup
                    key={item.group}
                    {...slotProps?.group}
                    className={cn("py-1 not-last:border-b border-border", slotProps?.group?.className)}
                  >
                    <MultiSelectLabel
                      {...slotProps?.groupLabel}
                      className={cn(
                        "px-2 py-1 text-xs font-semibold text-muted-foreground",
                        slotProps?.groupLabel?.className,
                      )}
                    >
                      {item.group}
                    </MultiSelectLabel>
                    {item.options.map(renderOption)}
                    
                  </MultiSelectGroup>
                );
              }
              return renderOption(item);
            })
          )}
        </ul>
      </MultiSelectPopover>

      <input  {...props} type="hidden" value={value$.join(",")} disabled={disabled} />
    </MultiSelectRoot>
  );
}
