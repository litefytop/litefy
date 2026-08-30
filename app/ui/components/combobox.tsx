import * as React from "react";
import { cn, type ClassNameValue } from "@/lib";

export interface ComboboxRootProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function ComboboxRoot({ className, ...props }: ComboboxRootProps) {
  return <div className={cn(className)} {...props} />;
}

export interface ComboboxInputProps extends Omit<
  React.ComponentProps<"input">,
  "className" | "value" | "defaultValue" | "onSelect"
> {
  className?: ClassNameValue;
  value?: string;
  defaultValue?: string;
}
export function ComboboxInput({
  className,
  placeholder = "typing to search...",
  ...props
}: ComboboxInputProps) {
  return (
    <input
      {...props}
      placeholder={placeholder}
      className={cn("h-9 w-full px-3 py-2 border rounded-md bg-input", className)}
    />
  );
}

export interface ComboboxContentProps extends Omit<React.ComponentProps<"div">, "className"> {
  className?: ClassNameValue;
}
export function ComboboxContent({ className, ...props }: ComboboxContentProps) {
  return (
    <div
      popover="manual"
      className={cn("border shadow-lg overflow-hidden rounded-md", className)}
      {...props}
    />
  );
}

export interface ComboboxListProps extends Omit<React.ComponentProps<"ul">, "className"> {
  className?: ClassNameValue;
  onScrollBottom?: () => void;
  empty?: React.ReactNode;
}
export function ComboboxList({
  className,
  onScrollBottom,
  onScroll,
  children,
  ...props
}: ComboboxListProps) {
  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceToBottom < 120) onScrollBottom?.();
    onScroll?.(e);
  };

  return (
    <ul
      role="listbox"
      className={cn(
        "max-h-64 overflow-auto p-1 overscroll-contain border border-border rounded-md",
        className,
      )}
      onScroll={handleScroll}
      {...props}
    >
      {children}
    </ul>
  );
}

export interface ComboboxOptionProps extends Omit<React.ComponentProps<"li">, "className"> {
  className?: ClassNameValue;
  id?: string;
}
export function ComboboxOption({ className, ...props }: ComboboxOptionProps) {
  return (
    <li
      role="option"
      className={cn(
        "px-3 py-2 text-sm cursor-pointer hover:bg-hover rounded-sm aria-selected:bg-hover",
        className,
      )}
      {...props}
    />
  );
}

export interface ComboboxRemoteApi {
  data: string[];
  loading: boolean;
  isSearching: boolean;
  hasMore: boolean;
  search: (keyword: string) => void;
  loadMore: () => void;
}

export type ComboboxProps = Omit<ComboboxInputProps, "onChange" | "className" | "style"> & {
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  empty?: React.ReactNode;
  classNames?: {
    root?: ClassNameValue;
    popover?: ClassNameValue;
    list?: ClassNameValue;
    option?: ClassNameValue;
  };
  styles?: {
    root?: React.CSSProperties;
    popover?: React.CSSProperties;
    list?: React.CSSProperties;
    option?: React.CSSProperties;
  };
} & ({ options?: string[]; remote?: never } | { options?: never; remote?: ComboboxRemoteApi });

export function Combobox({
  value,
  defaultValue = "",
  onValueChange,
  onSelect,
  options,
  remote,
  empty,
  classNames,
  styles,
  ...props
}: ComboboxProps) {
  const id = React.useId();
  const listboxId = `listbox-${id}`;
  const anchorName = `--combobox-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const popoverRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const [_value, setValue] = React.useState(defaultValue);
  const [highlightValue, setHighlightValue] = React.useState<string | null>(null);
  const isControlled = value !== undefined;
  const value$ = isControlled ? value : _value;
  React.useEffect(() => {
    if (remote) {
      remote.search("");
    }
  }, []);

  const suggestions$ = React.useMemo(() => {
    if (remote) return remote.data;
    if (!value$.trim()) return options ?? [];
    return (options ?? []).filter((opt) => opt.toLowerCase().includes(value$.toLowerCase()));
  }, [options, value$, remote]);

  const closePopover = React.useCallback(() => {
    popoverRef.current?.hidePopover();
    setHighlightValue(null);
  }, []);

  const openPopover = React.useCallback(() => {
    popoverRef.current?.showPopover();
  }, []);

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
      if (popoverRef.current?.contains(target)) return;
      closePopover();
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [closePopover]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!isControlled) {
      setValue(v);
    }
    onValueChange?.(v);
    setHighlightValue(null);
    if (remote) remote.search(v);
  };

  const handleSelectItem = (opt: string) => {
    onSelect?.(opt);
    onValueChange?.(opt);
    if (!isControlled) {
      setValue(opt);
    }
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
  };
  const handleClick = () => {
    openPopover();
  };

  return (
    <>
      <ComboboxRoot style={{ anchorName, ...styles?.root }} className={classNames?.root}>
        <ComboboxInput
          {...props}
          value={value$}
          onClick={handleClick}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-activedescendant={highlightValue ? `option-${id}-${highlightValue}` : undefined}
          aria-controls={listboxId}
        />
      </ComboboxRoot>

      <ComboboxContent
        ref={popoverRef}
        style={{
          margin: "4px 0 0",
          positionAnchor: anchorName,
          positionArea: "bottom span-right",
          justifySelf: "start",
          width: "anchor-size(width)",
          positionTryFallbacks: "flip-block",
          ...styles?.popover,
        }}
        className={classNames?.popover}
      >
        <ComboboxList
          ref={listRef}
          id={listboxId}
          onScrollBottom={handleScrollBottom}
          style={{ ...styles?.list }}
          className={classNames?.list}
          empty={empty}
        >
          {suggestions$.length == 0
            ? (empty ?? (
                <ComboboxOption
                  className={"px-3 py-2 text-sm text-muted-foreground pointer-events-none"}
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
                  >
                    {opt}
                  </ComboboxOption>
                );
              })}
        </ComboboxList>
      </ComboboxContent>
    </>
  );
}
