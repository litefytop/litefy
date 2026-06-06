"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { cn, ClassNameValue } from "@/lib";
import { ChevronDown, X } from "lucide-react";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type ComboboxChangeEvent = React.ChangeEvent<HTMLInputElement>;
type OptionFn = (keyword: string) => Promise<string[]>;

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
  optionHeight?: number;
  overscan?: number;
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
  optionHeight = 36,
  overscan = 2,
  slotProps,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [innerLoading, setInnerLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingRequestRef = useRef<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const inputValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const preprocessedOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return null;
    return options.map((opt) => ({
      original: opt,
      lower: opt.toLowerCase(),
    }));
  }, [options]);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightIndex(-1);
    setScrollTop(0);
  }, []);

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(closeDropdown, 150);
  };

  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeightEstimate = 256;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    let top: number;
    if (spaceBelow >= dropdownHeightEstimate || spaceBelow >= spaceAbove) {
      top = rect.bottom + 4;
    } else {
      top = rect.top - dropdownHeightEstimate - 4;
    }
    setDropdownPosition({ top, left: rect.left });
  }, []);

  const fetchData = useCallback(
    async (keyword: string) => {
      if (!options) {
        setSuggestions([]);
        return;
      }
      if (preprocessedOptions) {
        const lowerKeyword = keyword.toLowerCase();
        const filtered = preprocessedOptions
          .filter((item) => item.lower.includes(lowerKeyword))
          .map((item) => item.original);
        setSuggestions(filtered);
        return;
      }
      if (typeof options === "function") {
        if (pendingRequestRef.current === keyword) return;
        pendingRequestRef.current = keyword;
        setInnerLoading(true);
        try {
          const list = await options(keyword);
          if (pendingRequestRef.current === keyword && isMountedRef.current) {
            setSuggestions(list);
          }
        } finally {
          if (pendingRequestRef.current === keyword && isMountedRef.current) {
            setInnerLoading(false);
            pendingRequestRef.current = null;
          }
        }
      }
    },
    [options, preprocessedOptions],
  );

  const openDropdown = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      updateDropdownPosition();
      fetchData(inputValue);
    }
  }, [isOpen, inputValue, fetchData, updateDropdownPosition]);

  const handleChange = (e: ComboboxChangeEvent) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(e);

    if (newValue.trim() === "") {
      setSuggestions([]);
      return;
    }
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
      openDropdown();
      slotProps?.input?.onFocus?.(e);
    },
    [disabled, openDropdown, slotProps?.input],
  );

  const handleSelect = useCallback(
    (option: string) => {
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
    },
    [closeDropdown, controlledValue, onChange, onSelect],
  );

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

  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      const target = ev.target as Node;
      const inWrap = containerRef.current?.contains(target);
      const inDrop = listContainerRef.current?.contains(target);
      if (!inWrap && !inDrop) {
        cancelClose();
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeDropdown]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => closeDropdown();
    window.addEventListener("scroll", handleClose, true);
    window.addEventListener("resize", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose, true);
      window.removeEventListener("resize", handleClose);
    };
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (!listContainerRef.current) return;
    const updateHeight = () => {
      if (listContainerRef.current) {
        setContainerHeight(listContainerRef.current.clientHeight);
      }
    };
    updateHeight();
    resizeObserverRef.current = new ResizeObserver(updateHeight);
    resizeObserverRef.current.observe(listContainerRef.current);
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [isOpen, suggestions]);

  useEffect(() => {
    if (!listContainerRef.current || highlightIndex < 0 || innerLoading) return;
    const container = listContainerRef.current;
    const itemTop = highlightIndex * optionHeight;
    const itemBottom = itemTop + optionHeight;
    const scrollTopNow = container.scrollTop;
    const containerHeightNow = container.clientHeight;

    if (itemTop < scrollTopNow) {
      container.scrollTop = itemTop;
    } else if (itemBottom > scrollTopNow + containerHeightNow) {
      container.scrollTop = itemBottom - containerHeightNow;
    }
  }, [highlightIndex, innerLoading, optionHeight]);

  const visibleRange = useMemo(() => {
    if (containerHeight <= 0) return { start: 0, end: suggestions.length };
    const totalHeight = suggestions.length * optionHeight;
    if (totalHeight <= containerHeight) {
      return { start: 0, end: suggestions.length };
    }
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / optionHeight) - overscan,
    );
    const endIndex = Math.min(
      suggestions.length,
      Math.ceil((scrollTop + containerHeight) / optionHeight) + overscan,
    );
    return { start: startIndex, end: endIndex };
  }, [scrollTop, suggestions.length, optionHeight, overscan, containerHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLUListElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [suggestions]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
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

  const visibleOptions = useMemo(() => {
    if (suggestions.length === 0) return null;
    const { start, end } = visibleRange;
    const items = [];
    for (let i = start; i < end; i++) {
      const option = suggestions[i];
      items.push(
        <li
          key={`${option}_${i}`}
          role="option"
          aria-selected={i === highlightIndex}
          data-active={i === highlightIndex || undefined}
          data-index={i}
          onClick={() => handleSelect(option)}
          className={cn(
            "cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-muted data-active:ring-2 data-active:ring-inset",
            slotProps?.option?.className,
          )}
          style={{ height: optionHeight }}
        >
          {option}
        </li>,
      );
    }
    return items;
  }, [
    suggestions,
    visibleRange,
    highlightIndex,
    optionHeight,
    slotProps?.option,
    handleSelect,
  ]);

  const dropdownContent = (
    <ul
      id="combobox-list"
      role="listbox"
      {...slotProps?.list}
      ref={listContainerRef}
      onScroll={handleScroll}
      className={cn(
        "fixed z-50 w-3xs max-h-64 rounded-md border border-input bg-background shadow-lg overflow-auto",
        slotProps?.list?.className,
      )}
      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
    >
      {innerLoading ? (
        loadingNode
      ) : suggestions.length > 0 ? (
        <div
          style={{
            height: suggestions.length * optionHeight,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: visibleRange.start * optionHeight,
              width: "100%",
            }}
          >
            {visibleOptions}
          </div>
        </div>
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
    >
      <div
        ref={triggerRef}
        data-invalid={invalid || undefined}
        onClick={() => {
          inputRef.current?.focus();
          openDropdown();
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
