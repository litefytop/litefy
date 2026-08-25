import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";

export interface ComboboxRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function ComboboxRoot({ className, ...props }: ComboboxRootProps) {
  return <div className={cn("relative", className)} {...props} />;
}

export interface ComboboxInputProps extends Omit<
  React.ComponentProps<"input">,
  "className" | "value" | "defaultValue" | "onSelect"
> {
  className?: ClassNameValue;
  value?: string;
  defaultValue?: string;
}
export function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return <input className={cn(className)} {...props} />;
}

export interface ComboboxPopoverProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function ComboboxPopover({ className, ...props }: ComboboxPopoverProps) {
  return <div popover="manual" className={cn(className)} {...props} />;
}

export interface ComboboxListProps extends Omit<React.ComponentProps<"ul">, "className"> {
  className?: ClassNameValue;
  onScrollBottom?: () => void;
}
export function ComboboxList({ className, onScrollBottom, ...props }: ComboboxListProps) {
  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceToBottom < 120) onScrollBottom?.();
    props.onScroll?.(e);
  };

  return <ul role="listbox" className={cn(className)} onScroll={handleScroll} {...props} />;
}

export interface ComboboxOptionProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
  id?: string;
}
export function ComboboxOption({ className, ...props }: ComboboxOptionProps) {
  return <li role="option" className={cn(className)} {...props} />;
}

export interface ComboboxRemoteApi {
  data: string[];
  loading: boolean;
  isSearching: boolean;
  hasMore: boolean;
  search: (keyword: string) => void;
  loadMore: () => void;
}

export interface ComboboxProps extends Omit<ComboboxInputProps, "onChange"> {
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  options?: string[];
  remote?: ComboboxRemoteApi;
  placeholder?: string;
  empty?: React.ReactNode;
  slotProps?: {
    root?: Omit<ComboboxRootProps, "children">;
    popover?: Omit<ComboboxPopoverProps, "children">;
    list?: Omit<ComboboxListProps, "children">;
    option?: Omit<ComboboxOptionProps, "children">;
  };
}

export function Combobox({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  onSelect,
  onClick,
  onKeyDown,
  options,
  remote,
  placeholder = "typing to search...",
  empty,
  className,
  slotProps = {},
  ref,
  ...props
}: ComboboxProps) {
  const id = React.useId();
  const listboxId = `listbox-${id}`;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const _ref = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const [_selectedValue, setSelectedValue] = React.useState(defaultValue);
  const [searchText, setSearchText] = React.useState("");
  const [highlightValue, setHighlightValue] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValue(controlledValue);
      setSearchText(controlledValue);
    }
  }, [controlledValue]);

  React.useEffect(() => {
    if (remote) {
      remote.search("");
    }
  }, []);

  const suggestions$ = React.useMemo(() => {
    if (remote) return remote.data;
    if (!searchText.trim()) return options ?? [];
    return (options ?? []).filter((opt) => opt.toLowerCase().includes(searchText.toLowerCase()));
  }, [options, searchText, remote]);

  const updatePopoverPosition = React.useCallback(() => {
    if (!rootRef.current || !popoverRef.current) return;
    if (!popoverRef.current.matches(":popover-open")) return;

    const triggerRect = rootRef.current.getBoundingClientRect();
    popoverRef.current.style.inset = "unset";
    popoverRef.current.style.top = `${triggerRect.bottom + 4}px`;
    popoverRef.current.style.left = `${triggerRect.left}px`;
    popoverRef.current.style.width = `${triggerRect.width}px`;
  }, []);

  const closePopover = React.useCallback(() => {
    popoverRef.current?.hidePopover();
    setHighlightValue(null);
  }, []);

  const openPopover = React.useCallback(() => {
    popoverRef.current?.showPopover();
  }, []);

  React.useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;
    const handler = (e: ToggleEvent) => {
      const isOpen = e.newState === "open";
      if (isOpen) {
        updatePopoverPosition();
      } else {
        setHighlightValue(null);
      }
    };
    el.addEventListener("toggle", handler);
    return () => el.removeEventListener("toggle", handler);
  }, [updatePopoverPosition]);

  React.useEffect(() => {
    const onResize = () => updatePopoverPosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [updatePopoverPosition]);

  React.useLayoutEffect(() => {
    if (!highlightValue || !listRef.current) return;
    const listEl = listRef.current;
    const activeItem = listEl.querySelector<HTMLElement>(`[data-value="${highlightValue}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [highlightValue]);

  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!popoverRef.current?.matches(":popover-open")) return;
      const target = e.target as HTMLElement;
      if (rootRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      closePopover();
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [closePopover]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchText(v);
    onValueChange?.(v);
    setHighlightValue(null);
    openPopover();
    if (remote) remote.search(v);
  };

  const handleSelectItem = (opt: string) => {
    if (controlledValue === undefined) {
      setSelectedValue(opt);
    }
    onSelect?.(opt);
    setSearchText(opt);
    closePopover();
    _ref.current?.focus();
  };

  const handleScrollBottom = () => {
    if (remote && remote.hasMore && !remote.loading) {
      remote.loadMore();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentIdx = suggestions$.findIndex((s) => s === highlightValue);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        openPopover();
        {
          const nextIdx = Math.min(currentIdx + 1, suggestions$.length - 1);
          setHighlightValue(suggestions$[nextIdx] ?? null);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        openPopover();
        {
          const prevIdx = currentIdx - 1;
          setHighlightValue(prevIdx >= 0 ? suggestions$[prevIdx] : null);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (highlightValue) handleSelectItem(highlightValue);
        break;
      case "Escape":
        e.preventDefault();
        closePopover();
        break;
    }
    onKeyDown?.(e);
  };
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    openPopover();
    onClick?.(e);
  };
  const setRefs = (element: HTMLInputElement | null) => {
    _ref.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };
  return (
    <>
      <ComboboxRoot ref={rootRef} {...slotProps.root}>
        <ComboboxInput
          {...props}
          ref={setRefs}
          value={searchText}
          placeholder={placeholder}
          onClick={handleClick}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-activedescendant={highlightValue ? `option-${id}-${highlightValue}` : undefined}
          aria-controls={listboxId}
          className={cn("h-9 w-full px-3 py-2 border rounded-md outline-none", className)}
        />
      </ComboboxRoot>

      <ComboboxPopover
        ref={popoverRef}
        className={cn(
          "rounded-lg border bg-background shadow-lg overflow-hidden -top-full",
          slotProps.popover?.className,
        )}
        {...slotProps.popover}
      >
        <ComboboxList
          ref={listRef}
          id={listboxId}
          onScrollBottom={handleScrollBottom}
          className={cn("max-h-64 overflow-auto p-1 overscroll-contain", slotProps.list?.className)}
          {...slotProps.list}
        >
          {suggestions$.length === 0
            ? (empty ?? (
                <ComboboxOption
                  className={cn("px-3 py-2 text-sm text-muted-foreground pointer-events-none")}
                >
                  No data
                </ComboboxOption>
              ))
            : suggestions$.map((opt) => {
                const optionId = `option-${id}-${opt}`;
                return (
                  <ComboboxOption
                    key={optionId}
                    id={optionId}
                    aria-selected={opt === highlightValue}
                    data-value={opt}
                    onClick={() => handleSelectItem(opt)}
                    className={cn(
                      "px-3 py-2 text-sm cursor-pointer hover:bg-muted aria-selected:bg-muted rounded-sm",
                      slotProps.option?.className,
                    )}
                    {...slotProps.option}
                  >
                    {opt}
                  </ComboboxOption>
                );
              })}
        </ComboboxList>
      </ComboboxPopover>
    </>
  );
}
