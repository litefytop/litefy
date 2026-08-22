import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";


export interface ComboboxTriggerProps extends Omit<React.ComponentProps<"button">, "className"> {
  className?: ClassNameValue;
  popovertarget?: string;
}


function ComboboxTrigger({ className, ...props }: ComboboxTriggerProps) {
  return (
    <button
      type="button"
      className={cn("h-9 px-3 rounded-md border flex items-center justify-between gap-2", className)}
      {...props}
    />
  );
}


export interface ComboboxPopoverProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}


function ComboboxPopover({ className, ...props }: ComboboxPopoverProps) {
  return (
    <div
      popover="auto"
      className={cn("fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-md rounded-md border bg-background shadow-lg overflow-hidden", className)}
      {...props}
    />
  );
}


export interface ComboboxInputProps extends Omit<React.ComponentProps<"input">, "className"> {
  className?: ClassNameValue;
}


function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <input
      className={cn("w-full px-3 py-2 text-sm outline-none border-b bg-transparent", className)}
      {...props}
    />
  );
}


export interface ComboboxListProps extends Omit<React.ComponentProps<"ul">, "className"> {
  className?: ClassNameValue;
  loading?: boolean;
  emptyText?: React.ReactNode;
  onScrollBottom?: () => void;
}


function ComboboxList({ className, loading, emptyText, children, onScrollBottom, ...props }: ComboboxListProps) {
  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 10) {
      onScrollBottom?.();
    }
  };
  return (
    <ul
      role="listbox"
      className={cn("max-h-64 overflow-auto", className)}
      onScroll={handleScroll}
      {...props}
    >
      {loading ? (
        <li className="py-3 text-center text-sm text-muted-foreground">Loading...</li>
      ) : children ?? (
        <li className="py-3 text-center text-sm text-muted-foreground">{emptyText ?? "No data"}</li>
      )}
    </ul>
  );
}


export interface ComboboxOptionProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
  active?: boolean;
}


function ComboboxOption({ className, active, ...props }: ComboboxOptionProps) {
  return (
    <li
      role="option"
      data-active={active || undefined}
      className={cn(
        "px-3 py-2 text-sm cursor-pointer hover:bg-muted data-[active=true]:bg-muted",
        className
      )}
      {...props}
    />
  );
}


type HTMLAttrs<T> = Omit<T, "className"> & {
  [key: `data-${string}`]: string | number | null | undefined | true;
  className?: ClassNameValue;
};


export interface ComboboxRemoteApi {
  data: string[];
  loading: boolean;
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
    placeholder = "Search...",
    slotProps = {},

  }: ComboboxProps) {

  const popoverId = React.useId();
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [innerValue, setInnerValue] = React.useState(defaultValue);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);

  const currentValue = controlledValue !== undefined ? controlledValue : innerValue;

  const suggestions = React.useMemo(() => {
    if (remote) return remote.data;
    if (!currentValue.trim()) return options ?? [];
    return (options ?? []).filter((opt) =>
      opt.toLowerCase().includes(currentValue.toLowerCase())
    );
  }, [options, currentValue, remote]);

  const closePopover = React.useCallback(() => {
    popoverRef.current?.hidePopover();
    setHighlightIndex(-1);
  }, []);

  React.useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;
    const handler = (e: ToggleEvent) => {
      if (e.newState === "open") {
        inputRef.current?.focus();
      } else {
        setHighlightIndex(-1);
      }
    };
    el.addEventListener("toggle", handler);
    return () => el.removeEventListener("toggle", handler);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInnerValue(v);
    onChange?.(v);
    setHighlightIndex(-1);
    if (remote) {
      remote.search(v);
    }
  };

  const handleSelectItem = (opt: string) => {
    onSelect?.(opt);
    closePopover();
  };

  const handleScrollBottom = () => {
    if (remote && remote.hasMore) {
      remote.loadMore();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && suggestions[highlightIndex]) {
          handleSelectItem(suggestions[highlightIndex]);
        }
        break;
      case "Escape":
        break;
    }
  };

  return (
    <>
      <ComboboxTrigger
        popovertarget={popoverId}
        {...slotProps.trigger}
      >
        <span>{currentValue || placeholder}</span>
      </ComboboxTrigger>

      <ComboboxPopover
        ref={popoverRef}
        id={popoverId}
        {...slotProps.popover}
      >
        <ComboboxInput
          ref={inputRef}
          value={currentValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          {...slotProps.input}
        />
        <ComboboxList
          loading={remote?.loading}
          emptyText="No data"
          onScrollBottom={handleScrollBottom}
          {...slotProps.list}
        >
          {suggestions.map((opt, idx) => (
            <ComboboxOption
              key={opt}
              active={idx === highlightIndex}
              onClick={() => handleSelectItem(opt)}
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


Combobox.Trigger = ComboboxTrigger;
Combobox.Popover = ComboboxPopover;
Combobox.Input = ComboboxInput;
Combobox.List = ComboboxList;
Combobox.Option = ComboboxOption;
