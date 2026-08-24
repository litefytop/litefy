import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";

export interface ComboboxTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
}

export function ComboboxTrigger({ className, ...props }: ComboboxTriggerProps) {
  return <button type="button" className={cn(className)} {...props} />;
}

export interface ComboboxPopoverProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}

export function ComboboxPopover({ className, ...props }: ComboboxPopoverProps) {
  return <div popover="auto" className={cn(className)} {...props} />;
}

export interface ComboboxInputProps extends Omit<React.ComponentProps<"input">, "className"> {
  className?: ClassNameValue;
}

export function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return <input className={cn(className)} {...props} />;
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
  };

  return (
    <ul
      role="listbox"
      className={cn(className)}
      onScroll={(e) => {
        props.onScroll?.(e);
        handleScroll(e);
      }}
      {...props}
    />
  );
}

export interface ComboboxOptionProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
  active?: boolean;
  "data-value"?: string;
  id?: string;
}

export function ComboboxOption({ className, active, ...props }: ComboboxOptionProps) {
  return (
    <li role="option" data-active={active || undefined} className={cn(className)} {...props} />
  );
}

type HTMLAttrs<T> = Omit<T, "className" | "children"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};

export interface ComboboxRemoteApi {
  data: string[];
  loading: boolean;
  isSearching: boolean;
  hasMore: boolean;
  search: (keyword: string) => void;
  loadMore: () => void;
}

export type ComboboxProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  options?: string[];
  remote?: ComboboxRemoteApi;
  placeholder?: string;
  empty?: React.ReactNode;
  slotProps?: {
    trigger?: HTMLAttrs<React.ComponentProps<"button">>;
    popover?: HTMLAttrs<React.ComponentProps<"div">>;
    input?: HTMLAttrs<React.ComponentProps<"input">>;
    list?: HTMLAttrs<React.ComponentProps<"ul">>;
    option?: HTMLAttrs<React.ComponentProps<"li">>;
  };
};

export function Combobox({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSelect,
  options,
  remote,
  empty,
  placeholder = "Search...",
  slotProps = {},
}: ComboboxProps) {
  const id = React.useId();
  const popoverId = `popover-${id}`;
  const listboxId = `listbox-${id}`;

  const popoverRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const [_value, setValue] = React.useState(defaultValue);
  const [searchText, setSearchText] = React.useState("");
  const [highlightValue, setHighlightValue] = React.useState<string | null>(null);

  const value$ = controlledValue !== undefined ? controlledValue : _value;

  const suggestions$ = React.useMemo(() => {
    if (remote) return remote.data;
    if (!searchText.trim()) return options ?? [];
    return (options ?? []).filter((opt) => opt.toLowerCase().includes(searchText.toLowerCase()));
  }, [options, searchText, remote]);

  const closePopover = React.useCallback(() => {
    popoverRef.current?.hidePopover();
    setHighlightValue(null);
  }, []);

  React.useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;
    const handler = (e: ToggleEvent) => {
      const isOpen = e.newState === "open";

      if (isOpen) {
        inputRef.current?.focus();
      } else {
        setHighlightValue(null);
      }
    };
    el.addEventListener("toggle", handler);
    return () => el.removeEventListener("toggle", handler);
  }, []);

  React.useLayoutEffect(() => {
    if (!highlightValue || !listRef.current) return;
    const listEl = listRef.current;
    const activeItem = listEl.querySelector<HTMLElement>(`[data-value="${highlightValue}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [highlightValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchText(v);
    onChange?.(v);
    setHighlightValue(null);
    if (remote) remote.search(v);
  };

  const handleSelectItem = (opt: string) => {
    if (controlledValue === undefined) setValue(opt);
    onSelect?.(opt);
    setSearchText("");
    closePopover();
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
        setHighlightValue(suggestions$[Math.min(currentIdx + 1, suggestions$.length - 1)] ?? null);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (currentIdx <= 0) {
          setHighlightValue(null);
        } else {
          setHighlightValue(suggestions$[currentIdx - 1] ?? null);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (highlightValue) handleSelectItem(highlightValue);
        break;
    }
  };

  const handlePopoverClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <ComboboxTrigger
        popoverTarget={popoverId}
        className={cn(
          "h-9 px-3 rounded-md border flex items-center justify-between gap-2",
          slotProps.trigger?.className,
        )}
        {...slotProps.trigger}
      >
        {value$ || placeholder}
      </ComboboxTrigger>
      <ComboboxPopover
        ref={popoverRef}
        id={popoverId}
        className={cn(
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-md rounded-lg border bg-background shadow-lg overflow-hidden p-2",
          slotProps.popover?.className,
        )}
        onClick={handlePopoverClick}
        {...slotProps.popover}
      >
        <ComboboxInput
          ref={inputRef}
          value={searchText}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full px-3 py-2 text-sm outline-none border-b bg-transparent",
            slotProps.input?.className,
          )}
          {...slotProps.input}
        />

        <ComboboxList
          ref={listRef}
          id={listboxId}
          onScrollBottom={handleScrollBottom}
          className={cn("min-h-64 max-h-64 overflow-auto p-1", slotProps.list?.className)}
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
            : suggestions$.map((opt) => (
                <ComboboxOption
                  key={opt}
                  data-value={opt}
                  active={opt === highlightValue}
                  onClick={() => handleSelectItem(opt)}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer hover:bg-muted data-[active=true]:bg-muted rounded-sm",
                    slotProps.option?.className,
                  )}
                  {...slotProps.option}
                >
                  {opt}
                </ComboboxOption>
              ))}
        </ComboboxList>
      </ComboboxPopover>
    </>
  );
}
