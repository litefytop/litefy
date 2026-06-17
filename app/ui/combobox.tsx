"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";
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
  const _id = React.useId();
  const id = slotProps?.list?.id ?? _id;
  const popoverId = `combobox-popover-${id}`;
  const anchorName = `--anchor-${id}`;

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [supportsAnchor, setSupportsAnchor] = React.useState(false);
  const [manualPosition, setManualPosition] = React.useState<{
    top: number;
    left: number;
  } | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = React.useRef(true);
  const isFetchingRef = React.useRef(false);
  const blurTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const skipFocusRef = React.useRef(false);

  const inputValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const preprocessedOptions = React.useMemo(() => {
    if (!options || !Array.isArray(options)) return null;
    return options.map((opt) => ({
      original: opt,
      lower: opt.toLowerCase(),
    }));
  }, [options]);

  const fetchData = React.useCallback(
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
            if (listRef.current) listRef.current.scrollTop = 0;
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
            setSuggestions((prev) => [...prev, ...list]);
            setHasMore((prev) => {
              const newLen = (prev ? suggestions.length : 0) + list.length;
              return newLen < total;
            });
          } else {
            setSuggestions(list);
            if (listRef.current) listRef.current.scrollTop = 0;
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
    [options, preprocessedOptions, pageSize, suggestions.length],
  );

  const calculatePosition = React.useCallback(() => {
    const input = inputRef.current;
    const list = listRef.current;
    if (!input || !list) return;

    const inputRect = input.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = inputRect.bottom + 4;
    let left = inputRect.left;

    if (top + listRect.height > viewportHeight) {
      top = inputRect.top - listRect.height - 4;
    }

    if (left + listRect.width > viewportWidth) {
      left = viewportWidth - listRect.width - 8;
    }
    if (left < 8) left = 8;

    setManualPosition({ top, left });
  }, []);

  const handleChange = (e: ComboboxChangeEvent) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) setInternalValue(newValue);
    onChange?.(e);

    const popover = listRef.current;
    if (popover && !popover.matches(":popover-open")) {
      popover.showPopover();
      if (!supportsAnchor) {
        calculatePosition();
      }
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchData(newValue, 1, false);
    }, debounceMs);
  };

  const handleFocus = React.useCallback(
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
        if (!supportsAnchor) {
          calculatePosition();
        }
        fetchData(inputValue, 1, false);
      }
    },
    [
      disabled,
      slotProps?.input,
      fetchData,
      inputValue,
      supportsAnchor,
      calculatePosition,
    ],
  );

  const handleBlur = React.useCallback(
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

  const handleSelect = React.useCallback(
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

  const handleKeyDown = React.useCallback(
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
          setHighlightIndex((prev) => {
            const next = prev + 1;
            return next < suggestions.length ? next : prev;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((prev) => {
            const next = prev - 1;
            return next >= 0 ? next : prev;
          });
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

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const { scrollHeight, scrollTop, clientHeight } = el;
      const isReachBottom = scrollTop + clientHeight >= scrollHeight - 50;
      if (isReachBottom && hasMore && !isFetchingRef.current) {
        fetchData(inputValue, page + 1, true);
      }
    },
    [hasMore, page, fetchData, inputValue],
  );

  React.useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports("anchor-name", "--test")) {
      setSupportsAnchor(true);
    } else {
      console.warn(
        "Combobox: CSS anchor positioning is not supported. Falling back to manual positioning.",
      );
    }
  }, []);

  React.useEffect(() => {
    if (!supportsAnchor) {
      const handleUpdate = () => {
        const popover = listRef.current;
        if (popover?.matches(":popover-open")) {
          calculatePosition();
        }
      };
      window.addEventListener("resize", handleUpdate);
      window.addEventListener("scroll", handleUpdate);
      return () => {
        window.removeEventListener("resize", handleUpdate);
        window.removeEventListener("scroll", handleUpdate);
      };
    }
  }, [supportsAnchor, calculatePosition]);

  React.useEffect(() => {
    const popover = listRef.current;
    if (!popover) return;
    const handleToggle = (e: Event) => {
      const toggleEvent = e as ToggleEvent;
      if (toggleEvent.newState === "closed") {
        setHighlightIndex(-1);
        setManualPosition(null);
      } else if (toggleEvent.newState === "open") {
        if (listRef.current) {
          listRef.current.scrollTop = 0;
        }
        if (!supportsAnchor) {
          calculatePosition();
        }
      }
    };
    popover.addEventListener("toggle", handleToggle);
    return () => popover.removeEventListener("toggle", handleToggle);
  }, [supportsAnchor, calculatePosition]);

  React.useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll(
        '[role="option"][data-active="true"]',
      );
      const activeItem = items[0];
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightIndex]);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const getListStyle = (): React.CSSProperties => {
    if (supportsAnchor) {
      return {
        positionAnchor: anchorName,
        positionArea: "end center",
      };
    }
    if (manualPosition) {
      return {
        position: "fixed",
        top: manualPosition.top,
        left: manualPosition.left,
        margin: 0,
      };
    }
    return {};
  };

  return (
    <div
      {...slotProps?.container}
      ref={containerRef}
      data-invalid={invalid || undefined}
      className={cn(
        "relative flex items-center h-9 w-3xs rounded-md border border-input bg-background  shadow-xs",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        "data-invalid:border-destructive data-invalid:ring-destructive/20",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-text",
      )}
    >
      <input
        {...slotProps?.input}
        style={
          supportsAnchor
            ? { anchorName, ...slotProps?.input?.style }
            : slotProps?.input?.style
        }
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
          "w-full bg-transparent py-1 text-sm outline-none pl-3 pr-8 placeholder:text-muted-foreground disabled:cursor-not-allowed peer",
          slotProps?.input?.className,
        )}
        aria-autocomplete="list"
        aria-controls={popoverId}
      />
      <ChevronDown className="size-4 transition-transform duration-200 cursor-pointer  pointer-events-none absolute right-2.5 top-2.5 peer-focus:rotate-180" />
      <div
        id={popoverId}
        ref={listRef}
        popover="manual"
        role="listbox"
        onScroll={handleScroll}
        className={cn(
          "w-full max-h-64 rounded-md border border-input bg-background shadow-lg overflow-auto p-0 m-1",
          slotProps?.list?.className,
        )}
        style={getListStyle()}
      >
        {suggestions.length > 0 ? (
          suggestions.map((option, idx) => (
            <div
              key={option}
              tabIndex={-1}
              role="option"
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
            </div>
          ))
        ) : loading ? (
          <div className="py-3 text-center text-sm text-muted-foreground">
            {skeleton ?? "Loading..."}
          </div>
        ) : (
          <div className="py-3 text-center text-sm text-muted-foreground">
            No data
          </div>
        )}
      </div>
    </div>
  );
}
