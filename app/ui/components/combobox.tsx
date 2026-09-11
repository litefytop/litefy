"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { List } from "./list";
import { Picker } from "./picker";
import { useCombobox } from "../utils/use-combobox";
import { useRemotePagination } from "../utils/use-remote-pagination";

export type ComboboxFetcher = (params: {
  page: number;
  size: number;
  keyword: string;
}) => Promise<{ list: string[]; total: number }>;

export interface ComboboxProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "className" | "list"
  > {
  options?: string[];
  fetcher?: ComboboxFetcher;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  invalid?: boolean;
  empty?: React.ReactNode;
  pageSize?: number;
  debounceMs?: number;
  className?: ClassNameValue;
  classNames?: {
    panel?: ClassNameValue;
    item?: ClassNameValue;
  };
}

export function Combobox({
  options,
  fetcher,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  invalid,
  empty,
  pageSize = 20,
  debounceMs = 300,
  className,
  classNames,
  ...props
}: ComboboxProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const value = isControlled ? controlledValue : uncontrolledValue;

  const noopFetcher = React.useCallback<ComboboxFetcher>(
    async () => ({ list: [], total: 0 }),
    [],
  );
  const remote = useRemotePagination({
    fetcher: fetcher ?? noopFetcher,
    debounceMs,
    pageSize,
  });

  React.useEffect(() => {
    if (fetcher) remote.search("");
  }, [fetcher, remote.search]);

  const localItems = React.useMemo(() => {
    if (!options) return [];
    const keyword = value.trim().toLowerCase();
    if (!keyword) return options;
    return options.filter((option) => option.toLowerCase().includes(keyword));
  }, [options, value]);

  const items = fetcher ? remote.data : localItems;

  const { highlightIndex, setHighlightIndex, handleKeyDown, reset } = useCombobox({
    open,
    items,
    onSelect: (item) => commit(item),
  });

  function commit(item: string) {
    if (!isControlled) setValue(item);
    onValueChange?.(item);
    setOpen(false);
    reset();
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  const emptyNode = empty ?? (fetcher && remote.loading ? "Loading..." : "No data");

  return (
    <Picker
      {...props}
      open={open}
      onOpenChange={handleOpenChange}
      value={value}
      onValueChange={(next) => {
        if (!isControlled) setValue(next);
        onValueChange?.(next);
        reset();
        if (fetcher) remote.search(next);
      }}
      aria-invalid={invalid || undefined}
      trailing={<ChevronDown aria-hidden />}
      onKeyDown={handleKeyDown}
      className={className}
      classNames={{ popover: cn("p-1", classNames?.panel) }}
    >
      <List
        highlightIndex={highlightIndex}
        onHighlightChange={setHighlightIndex}
        items={items}
        renderItem={(item) => item}
        getKey={(item, index) => `${item}-${index}`}
        empty={emptyNode}
        onSelect={commit}
        onScrollBottom={
          fetcher
            ? () => {
                if (remote.hasMore && !remote.loading) remote.loadMore();
              }
            : undefined
        }
        className="max-h-64"
        classNames={{ item: classNames?.item }}
      />
    </Picker>
  );
}
