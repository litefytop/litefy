"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn, ClassNameValue } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";

export type ComboboxChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type ComboboxProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (e: ComboboxChangeEvent) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onSelect?: (option: string) => void;
  options?: string[];
  fetchOptions?: (input: string) => Promise<string[]>;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  className?: ClassNameValue;
  debounceMs?: number;
  maxHeight?: number;
  loadingText?: string;
  slotProps?: {
    container?: React.HTMLAttributes<HTMLDivElement>;
    input?: React.InputHTMLAttributes<HTMLInputElement>;
    list?: React.HTMLAttributes<HTMLUListElement>;
    option?: React.LiHTMLAttributes<HTMLLIElement>;
    clearButton?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    triggerButton?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  };
};

export function Combobox({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onBlur,
  onSelect,
  options: staticOptions,
  fetchOptions,
  placeholder = "Search or type...",
  disabled,
  invalid,
  clearable = true,
  className,
  debounceMs = 300,
  maxHeight = 256,
  loadingText = "Loading...",
  slotProps,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const inputValue = controlledValue !== undefined ? controlledValue : internalValue;

  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, []);

  const updateSuggestions = useCallback(
    async (input: string) => {
      if (fetchOptions) {
        setIsLoading(true);
        try {
          const results = await fetchOptions(input);
          setSuggestions(results);
        } finally {
          setIsLoading(false);
        }
      } else if (staticOptions) {
        const filtered = staticOptions.filter((opt) =>
          opt.toLowerCase().includes(input.toLowerCase())
        );
        setSuggestions(filtered);
      }
    },
    [fetchOptions, staticOptions]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(e);

    if (newValue.trim() === "") {
      setSuggestions([]);
      setIsOpen(false);
      setHighlightIndex(-1);
    } else {
      setIsOpen(true);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        updateSuggestions(newValue);
      }, debounceMs);
    }
  };

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
      setIsOpen(true);
      setHighlightIndex(-1);
      updateSuggestions(inputValue);
      slotProps?.input?.onFocus?.(e);
    },
    [disabled, inputValue, updateSuggestions, slotProps?.input]
  );

  const handleSelect = (option: string) => {
    if (controlledValue === undefined) setInternalValue(option);
    const fakeEvent = {
      target: { value: option },
      currentTarget: { value: option },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(fakeEvent);
    onSelect?.(option);
    setIsOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    if (controlledValue === undefined) setInternalValue("");
    const fakeEvent = {
      target: { value: "" },
      currentTarget: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(fakeEvent);
    setSuggestions([]);
    setIsOpen(false);
    setHighlightIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
      if (!isOpen && inputValue.trim()) {
        updateSuggestions(inputValue);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      if (isOutsideContainer && isOutsideDropdown) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();
    const handleScrollOrResize = () => updateDropdownPosition();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updateDropdownPosition]);

  const showClear = clearable && inputValue.length > 0;
  const shouldShowList = isOpen && (suggestions.length > 0 || isLoading);

  const dropdownContent = (
    <ul
      ref={dropdownRef}
      id="combobox-list"
      role="listbox"
      data-open={shouldShowList}
      className={cn(
        "fixed z-50 w-3xs rounded-md border border-input bg-background shadow-lg",
        "max-h-64 overflow-auto data-[open=false]:hidden",
        slotProps?.list?.className
      )}
      style={{ top: dropdownPosition.top, left: dropdownPosition.left, maxHeight }}
      {...slotProps?.list}
    >
      {isLoading ? (
        <li className="px-3 py-2 text-sm text-muted-foreground">{loadingText}</li>
      ) : (
        suggestions.map((option, idx) => (
          <li
            key={option}
            role="option"
            aria-selected={idx === highlightIndex}
            onClick={() => handleSelect(option)}
            className={cn(
              "cursor-pointer px-3 py-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              idx === highlightIndex && "bg-accent text-accent-foreground",
              slotProps?.option?.className
            )}
            {...slotProps?.option}
          >
            {option}
          </li>
        ))
      )}
    </ul>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      data-invalid={invalid}
      {...slotProps?.container}
    >
      <div
        ref={triggerRef}
        className={cn(
          "flex items-center h-9 w-3xs rounded-md border border-input bg-background px-3 shadow-xs",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "data-invalid:border-destructive data-invalid:ring-destructive/20",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent py-1 text-sm outline-none",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed",
            slotProps?.input?.className
          )}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="combobox-list"
          {...slotProps?.input}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground",
              slotProps?.clearButton?.className
            )}
            aria-label="Clear"
            tabIndex={-1}
            {...slotProps?.clearButton}
          >
            <X className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={cn(
            "shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground",
            "disabled:cursor-not-allowed",
            slotProps?.triggerButton?.className
          )}
          aria-label="Toggle dropdown"
          tabIndex={-1}
          {...slotProps?.triggerButton}
        >
          <ChevronDown className="size-4 transition-transform" data-open={isOpen} />
        </button>
      </div>

      {typeof document !== "undefined" && createPortal(dropdownContent, document.body)}
    </div>
  );
}
