"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn, ClassNameValue } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};
export type ComboboxChangeEvent = React.ChangeEvent<HTMLInputElement>;
type OptionFn = (keyword: string) => Promise<string[]>;
type RenderListPayload = {
  activeIndex: number;
};

export type ComboboxProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (e: ComboboxChangeEvent) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onSelect?: (option: string) => void;
  options?: string[] | OptionFn;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  debounceMs?: number;
  skeleton?: React.ReactNode;
  renderList?: (data: string[], payload: RenderListPayload) => React.ReactNode;
  slotProps?: {
    container?: HTMLAttrs<Omit<React.ComponentProps<"div">, "ref">>;
    input?: HTMLAttrs<
      Omit<
        React.ComponentProps<"input">,
        | "disabled"
        | "clearable"
        | "placeholder"
        | "ref"
        | "value"
        | "defaultValue"
      >
    >;
    list?: HTMLAttrs<Omit<React.ComponentProps<"ul">, "ref">>;
    option?: HTMLAttrs<React.ComponentProps<"li">>;
    clearButton?: HTMLAttrs<React.ComponentProps<"button">>;
  };
};

export function Combobox({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onBlur,
  onSelect,
  options,
  placeholder = "Search or type...",
  disabled,
  invalid,
  clearable = true,
  debounceMs = 300,
  skeleton,
  renderList,
  slotProps,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [innerLoading, setInnerLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingRequestRef = useRef<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const inputValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(closeDropdown, 150);
  };

  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, []);

  const fetchData = useCallback(
    async (keyword: string) => {
      if (!options) {
        setSuggestions([]);
        return;
      }
      if (Array.isArray(options)) {
        const filtered = options.filter((opt) =>
          opt.toLowerCase().includes(keyword.toLowerCase()),
        );
        setSuggestions(filtered);
        return;
      }
      if (pendingRequestRef.current === keyword) return;
      pendingRequestRef.current = keyword;
      setInnerLoading(true);
      try {
        const list = await options(keyword);
        if (pendingRequestRef.current === keyword) {
          setSuggestions(list);
        }
      } finally {
        if (pendingRequestRef.current === keyword) {
          setInnerLoading(false);
          pendingRequestRef.current = null;
        }
      }
    },
    [options],
  );

  const handleChange = (e: ComboboxChangeEvent) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(e);


    setIsOpen(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchData(newValue);
    }, debounceMs);
  };

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      cancelClose();
      if (disabled) return;
      setIsOpen(true);
      setHighlightIndex(-1);
      fetchData(inputValue);
      slotProps?.input?.onFocus?.(e);
    },
    [disabled, inputValue, fetchData, slotProps?.input],
  );

  const handleSelect = (option: string) => {
    cancelClose();
    if (controlledValue === undefined) setInternalValue(option);
    const fakeEvent = {
      target: { value: option },
      currentTarget: { value: option },
    } as ComboboxChangeEvent;
    onChange?.(fakeEvent);
    onSelect?.(option);
    closeDropdown();
    inputRef.current?.focus();
  };

  const handleClear = () => {
    cancelClose();
    if (controlledValue === undefined) setInternalValue("");
    const fakeEvent = {
      target: { value: "" },
      currentTarget: { value: "" },
    } as ComboboxChangeEvent;
    onChange?.(fakeEvent);
    setSuggestions([]);
    closeDropdown();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter" && inputValue.trim()) e.preventDefault();
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex]);
        }
        break;
      case "Escape":
        closeDropdown();
        break;
    }
  };

  const toggleDropdown = () => {
    if (disabled) return;
    cancelClose();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      fetchData(inputValue);
    }
  };

  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      const target = ev.target as Node;
      const inWrap = containerRef.current?.contains(target);
      const inDrop = dropdownRef.current?.contains(target);
      if (!inWrap && !inDrop) {
        cancelClose();
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();
    const onScrollResize = () => updateDropdownPosition();
    window.addEventListener("scroll", onScrollResize, true);
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    if (
      !dropdownRef.current ||
      highlightIndex < 0 ||
      innerLoading ||
      renderList
    )
      return;
    const item = dropdownRef.current.children[highlightIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, innerLoading, renderList]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const showClear = clearable && inputValue.length > 0;
  const shouldShowList = isOpen && (suggestions.length > 0 || innerLoading);
  const loadingNode = skeleton ?? (
    <li className="py-3 text-center text-sm text-muted-foreground">
      Loading...
    </li>
  );
  const listPayload: RenderListPayload = { activeIndex: highlightIndex };

  const defaultListContent = suggestions.map((option, idx) => (
    <li
      role="option"
      {...slotProps?.option}
      key={`${option}_${idx}`}
      aria-selected={idx === highlightIndex}
      data-active={idx === highlightIndex || undefined}
      onClick={() => handleSelect(option)}
      className={cn(
        "cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-gray-100 data-active:bg-accent data-active:text-accent-foreground",
        slotProps?.option?.className,
      )}
    >
      {option}
    </li>
  ));

  const dropdownContent = (
    <ul
      id="combobox-list"
      role="listbox"
      {...slotProps?.list}
      ref={dropdownRef}
      className={cn(
        "fixed z-50 w-3xs max-h-64 rounded-md border border-input bg-background shadow-lg overflow-auto",
        slotProps?.list?.className,
      )}
      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
    >
      {innerLoading ? (
        loadingNode
      ) : suggestions.length > 0 ? (
        renderList ? (
          renderList(suggestions, listPayload)
        ) : (
          defaultListContent
        )
      ) : (
        <li className="py-3 text-center text-sm text-muted-foreground">
          No data
        </li>
      )}
    </ul>
  );

  return (
    <div
      {...slotProps?.container}
      ref={containerRef}
      className={cn("relative w-3xs", slotProps?.container?.className)}
      data-invalid={invalid}
    >
      <div
        ref={triggerRef}
        onClick={() => {
          inputRef.current?.focus();
          toggleDropdown();
        }}
        className={cn(
          "flex items-center h-9 w-full rounded-md border border-input bg-background px-3 shadow-xs",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "data-invalid:border-destructive data-invalid:ring-destructive/20",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-text",
        )}
      >
        <input
          {...slotProps?.input}
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={(e) => {
            scheduleClose();
            onBlur?.(e);
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
            slotProps?.input?.className,
          )}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="combobox-list"
        />
        {showClear && (
          <button
            aria-label="Clear"
            {...slotProps?.clearButton}
            type="button"
            onClick={handleClear}
            className={cn(
              "shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground",
              slotProps?.clearButton?.className,
            )}
            tabIndex={-1}
          >
            <X className="size-4" />
          </button>
        )}
        <ChevronDown
          data-open={isOpen || undefined}
          className="size-4 transition-transform duration-200 data-open:rotate-180"
        />
      </div>

      {shouldShowList &&
        typeof document !== "undefined" &&
        createPortal(dropdownContent, document.body)}
    </div>
  );
}
