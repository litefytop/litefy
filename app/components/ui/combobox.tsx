"use client";

import { ChevronDown, X } from "lucide-react";
import type React from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { type ClassNameValue, cn } from "@/lib";

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
  className?: ClassNameValue;
};

export type ComboboxChangeEvent = React.ChangeEvent<HTMLInputElement>;

type PaginationParams = {
  page: number;
  size: number;
  keyword: string;
};

type OptionFn = (params: PaginationParams) => Promise<{
  list: string[];
  hasMore: boolean;
}>;

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
  pageSize?: number;
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
  pageSize = 50,
  slotProps,
}: ComboboxProps) {
  const _id = useId();
  const id = slotProps?.list?.id ?? _id;
  const popoverId = `combobox-popover-${id}`;
  const anchorName = `--anchor-${id}`;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const isFetchingRef = useRef(false);

  const inputValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const preprocessedOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return null;
    return options.map((opt) => ({
      original: opt,
      lower: opt.toLowerCase(),
    }));
  }, [options]);

  const fetchData = useCallback(
    async (keyword: string, nextPage = 1, isAppend = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        if (preprocessedOptions) {
          const lowerKeyword = keyword.toLowerCase();
          const filtered = preprocessedOptions
            .filter((item) => item.lower.includes(lowerKeyword))
            .map((item) => item.original);
          setSuggestions(filtered);
          setHasMore(false);
          return;
        }

        if (typeof options === "function") {
          const res = await options({
            page: nextPage,
            size: pageSize,
            keyword,
          });

          if (isAppend) {
            setSuggestions((prev) => [...prev, ...res.list]);
          } else {
            setSuggestions(res.list);
          }
          setHasMore(res.hasMore);
          setPage(nextPage);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          isFetchingRef.current = false;
        }
      }
    },
    [options, preprocessedOptions, pageSize],
  );

  const handleChange = (e: ComboboxChangeEvent) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(e);

    if (newValue.trim() === "") {
      setSuggestions([]);
      setPage(1);
      setHasMore(true);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchData(newValue, 1, false);
    }, debounceMs);
  };

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (disabled) return;
      slotProps?.input?.onFocus?.(e);
      const popover = document.getElementById(popoverId) as HTMLElement | null;
      if (popover && !popover.matches(":popover-open")) {
        popover.showPopover();
      }
      fetchData(inputValue, 1, false);
    },
    [disabled, slotProps?.input, popoverId, fetchData, inputValue],
  );

  const handleSelect = useCallback(
    (option: string) => {
      if (controlledValue === undefined) setInternalValue(option);
      const fakeEvent = {
        target: { value: option },
        currentTarget: { value: option },
      } as ComboboxChangeEvent;
      onChange?.(fakeEvent);
      onSelect?.(option);
      const popover = document.getElementById(popoverId) as HTMLElement | null;
      popover?.hidePopover();
      inputRef.current?.focus();
    },
    [controlledValue, onChange, onSelect, popoverId],
  );

  const handleClear = () => {
    if (controlledValue === undefined) setInternalValue("");
    const fakeEvent = {
      target: { value: "" },
      currentTarget: { value: "" },
    } as ComboboxChangeEvent;
    onChange?.(fakeEvent);
    setSuggestions([]);
    setPage(1);
    setHasMore(true);
    const popover = document.getElementById(popoverId) as HTMLElement | null;
    popover?.hidePopover();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const popover = document.getElementById(popoverId) as HTMLElement | null;
    const isPopoverOpen = popover?.matches(":popover-open") ?? false;

    if (!isPopoverOpen || suggestions.length === 0) {
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
        popover?.hidePopover();
        break;
    }
  };

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const el = e.currentTarget;
      setScrollTop(el.scrollTop);

      const { scrollHeight, scrollTop: st, clientHeight } = el;
      const isReachBottom = st + clientHeight >= scrollHeight - 20;
      if (isReachBottom && hasMore && !isFetchingRef.current) {
        fetchData(inputValue, page + 1, true);
      }
    },
    [hasMore, page, fetchData, inputValue],
  );

  useEffect(() => {
    const popover = document.getElementById(popoverId);
    if (!popover) return;

    const handleToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      if (toggleEvent.newState === "closed") {
        setHighlightIndex(-1);
        setScrollTop(0);
      }
    };

    popover.addEventListener("toggle", handleToggle);
    return () => popover.removeEventListener("toggle", handleToggle);
  }, [popoverId]);

  useEffect(() => {
    if (!listRef.current) return;
    const updateHeight = () => {
      if (listRef.current) {
        setContainerHeight(listRef.current.clientHeight);
      }
    };
    updateHeight();
    resizeObserverRef.current = new ResizeObserver(updateHeight);
    resizeObserverRef.current.observe(listRef.current);
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!listRef.current || highlightIndex < 0 || loading) return;
    const container = listRef.current;
    const itemTop = highlightIndex * optionHeight;
    const itemBottom = itemTop + optionHeight;
    const scrollTopNow = container.scrollTop;
    const containerHeightNow = container.clientHeight;

    if (itemTop < scrollTopNow) {
      container.scrollTop = itemTop;
    } else if (itemBottom > scrollTopNow + containerHeightNow) {
      container.scrollTop = itemBottom - containerHeightNow;
    }
  }, [highlightIndex, loading, optionHeight]);

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

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const showClear = clearable && inputValue.length > 0;
  const shouldShowList = suggestions.length > 0 || loading;
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
          data-active={i === highlightIndex || undefined}
          data-index={i}
          onClick={() => handleSelect(option)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSelect(option);
            }
          }}
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

  return (
    <div
      {...slotProps?.container}
      ref={containerRef}
      style={{ anchorName }}
      className={cn("relative w-3xs", slotProps?.container?.className)}
    >
      <div
        data-invalid={invalid || undefined}
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
          aria-controls={popoverId}
          popoverTarget={popoverId}
          popoverTargetAction="show"
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
        <ChevronDown className="size-4 transition-transform duration-200" />
      </div>

      <ul
        id={popoverId}
        ref={listRef}
        popover="manual"
        onScroll={handleScroll}
        className={cn(
          "w-3xs max-h-64 rounded-md border border-input bg-background shadow-lg overflow-auto m-0 p-0 ",
          slotProps?.list?.className,
        )}
        style={{
          positionAnchor: anchorName,
          positionArea: "bottom start",
        }}
      >
        {shouldShowList ? (
          loading ? (
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
          )
        ) : null}
      </ul>
    </div>
  );
}
