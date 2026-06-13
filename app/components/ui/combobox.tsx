"use client";

import { ChevronDown } from "lucide-react";
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

export type ComboboxOptionsFn = (params: {
  page: number;
  size: number;
  keyword: string;
}) => Promise<{
  list: string[];
  total: number;
}>;

export type ComboboxProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (e: ComboboxChangeEvent) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onSelect?: (option: string) => void;
  options?: string[] | ComboboxOptionsFn;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  debounceMs?: number;
  skeleton?: React.ReactNode;
  pageSize?: number;
  slotProps?: {
    container?: HTMLAttrs<Omit<React.ComponentProps<"div">, "ref">>;
    input?: HTMLAttrs<
      Omit<
        React.ComponentProps<"input">,
        "disabled" | "placeholder" | "ref" | "value" | "defaultValue"
      >
    >;
    list?: HTMLAttrs<Omit<React.ComponentProps<"ul">, "ref">>;
    option?: HTMLAttrs<React.ComponentProps<"li">>;
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
  debounceMs = 300,
  skeleton,
  pageSize = 20,
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipFocusRef = useRef(false);

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
          const start = (nextPage - 1) * pageSize;
          const paged = filtered.slice(start, start + pageSize);
          if (isAppend) {
            setSuggestions((prev) => [...prev, ...paged]);
          } else {
            setSuggestions(paged);
          }
          setHasMore(start + pageSize < filtered.length);
          return;
        }

        if (typeof options === "function") {
          const res = await options({
            page: nextPage,
            size: pageSize,
            keyword,
          });
          const { list, total } = res;

          if (isAppend) {
            setSuggestions((prev) => {
              const newSuggestions = [...prev, ...list];
              setHasMore(newSuggestions.length < total);
              return newSuggestions;
            });
          } else {
            setSuggestions(list);
            setHasMore(list.length < total);
          }
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

    const popover = listRef.current;
    if (popover && !popover.matches(":popover-open")) {
      popover.showPopover();
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
      if (skipFocusRef.current) {
        skipFocusRef.current = false;
        return;
      }
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      const popover = listRef.current;
      if (popover && !popover.matches(":popover-open")) {
        popover.showPopover();
        fetchData(inputValue, 1, false);
      }
    },
    [disabled, slotProps?.input, fetchData, inputValue],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      if (disabled) return;
      blurTimeoutRef.current = setTimeout(() => {
        const popover = listRef.current;
        if (popover?.matches(":popover-open")) {
          popover.hidePopover();
          setSuggestions([]);
        }
      }, 150);
    },
    [disabled, onBlur],
  );

  const handleSelect = useCallback(
    (option: string) => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      const popover = listRef.current;
      popover?.hidePopover();

      if (controlledValue === undefined) {
        setInternalValue(option);
      }
      const fakeEvent = {
        target: { value: option },
        currentTarget: { value: option },
      } as ComboboxChangeEvent;
      onChange?.(fakeEvent);
      onSelect?.(option);

      skipFocusRef.current = true;
      inputRef.current?.focus();
    },
    [controlledValue, onChange, onSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const popover = listRef.current;
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
    },
    [suggestions, highlightIndex, handleSelect, inputValue],
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const el = e.currentTarget;
      const { scrollHeight, scrollTop, clientHeight } = el;
      const isReachBottom = scrollTop + clientHeight >= scrollHeight - 50;
      if (isReachBottom && hasMore && !isFetchingRef.current) {
        fetchData(inputValue, page + 1, true);
      }
    },
    [hasMore, page, fetchData, inputValue],
  );

  useEffect(() => {
    const popover = listRef.current;
    if (!popover) return;
    const handleToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      if (toggleEvent.newState === "closed") {
        setHighlightIndex(-1);
      } else if (toggleEvent.newState === "open") {
        if (listRef.current) {
          listRef.current.scrollTop = 0;
        }
      }
    };
    popover.addEventListener("toggle", handleToggle);
    return () => popover.removeEventListener("toggle", handleToggle);
  }, []);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('li[data-active="true"]');
      const activeItem = items[0];
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const loadingNode = skeleton ?? (
    <li className="py-3 text-center text-sm text-muted-foreground">
      Loading...
    </li>
  );

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
          onBlur={handleBlur}
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
        />
        <ChevronDown className="size-4 transition-transform duration-200" />
      </div>

      <ul
        id={popoverId}
        ref={listRef}
        popover="manual"
        onScroll={handleScroll}
        className={cn(
          "w-3xs max-h-64 rounded-md border border-input bg-background shadow-lg overflow-auto m-0 p-0",
          slotProps?.list?.className,
        )}
        style={{
          positionAnchor: anchorName,
          positionArea: "end center",
        }}
      >
        {suggestions.length > 0 ? (
          suggestions.map((option, idx) => (
            <li
              key={`${option}_${_id}`}
              data-active={idx === highlightIndex || undefined}
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
            >
              {option}
            </li>
          ))
        ) : loading ? (
          loadingNode
        ) : (
          <li className="py-3 text-center text-sm text-muted-foreground">
            No data
          </li>
        )}
      </ul>
    </div>
  );
}
