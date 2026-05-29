"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  itemProps?: {
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
  itemProps,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const inputValue = controlledValue !== undefined ? controlledValue : internalValue;

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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showClear = clearable && inputValue.length > 0;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      data-invalid={invalid}
      {...itemProps?.container}
    >
      <div
        className={cn(
          "flex items-center h-9 w-full rounded-md border border-input bg-background px-3 shadow-xs",
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
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent py-1 text-sm outline-none",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed",
            itemProps?.input?.className
          )}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="combobox-list"
          {...itemProps?.input}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground",
              itemProps?.clearButton?.className
            )}
            aria-label="Clear"
            tabIndex={-1}
            {...itemProps?.clearButton}
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
            itemProps?.triggerButton?.className
          )}
          aria-label="Toggle dropdown"
          tabIndex={-1}
          {...itemProps?.triggerButton}
        >
          <ChevronDown className="size-4 transition-transform" data-open={isOpen} />
        </button>
      </div>

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <ul
          id="combobox-list"
          role="listbox"
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-lg",
            "max-h-64 overflow-auto",
            itemProps?.list?.className
          )}
          style={{ maxHeight }}
          {...itemProps?.list}
        >
          {isLoading ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">Loading...</li>
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
                  itemProps?.option?.className
                )}
                {...itemProps?.option}
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
