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
}) => Promise<{
    list: string[];
    total: number;
}>;
export interface ComboboxProps extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "className" | "list"> {
    options?: string[];
    fetcher?: ComboboxFetcher;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onCommit?: (value: string) => void;
    invalid?: boolean;
    empty?: React.ReactNode;
    pageSize?: number;
    debounceMs?: number;
    trailing?: React.ReactNode;
    className?: ClassNameValue;
    classNames?: {
        panel?: ClassNameValue;
        item?: ClassNameValue;
        input?: ClassNameValue;
    };
    styles?: {
        panel?: React.CSSProperties;
        item?: React.CSSProperties;
    };
}
export function Combobox({ options, fetcher, value: controlledValue, defaultValue = "", onValueChange, onCommit, invalid, empty, pageSize = 20, debounceMs = 300, trailing, onCompositionStart: onCompositionStartProp, onCompositionEnd: onCompositionEndProp, className, classNames, styles, ...props }: ComboboxProps) {
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setValue] = React.useState(defaultValue);
    const [open, setOpen] = React.useState(false);
    const value = isControlled ? controlledValue : uncontrolledValue;
    const noopFetcher = React.useCallback<ComboboxFetcher>(async () => ({ list: [], total: 0 }), []);
    const remote = useRemotePagination({
        fetcher: fetcher ?? noopFetcher,
        debounceMs,
        pageSize,
    });
    const fetcherRef = React.useRef(fetcher);
    fetcherRef.current = fetcher;
    const composingRef = React.useRef(false);
    const latestRef = React.useRef(defaultValue);
    React.useEffect(() => {
        if (fetcherRef.current)
            remote.search("");
    }, [remote.search]);
    const localItems = React.useMemo(() => {
        if (!options)
            return [];
        const keyword = value.trim().toLowerCase();
        if (!keyword)
            return options;
        return options.filter((option) => option.toLowerCase().includes(keyword));
    }, [options, value]);
    const items = fetcher ? remote.data : localItems;
    const { highlightIndex, setHighlightIndex, handleKeyDown, reset } = useCombobox({
        open,
        items,
        onSelect: (item) => commit(item),
    });
    function commit(item: string) {
        if (!isControlled)
            setValue(item);
        latestRef.current = item;
        onValueChange?.(item);
        onCommit?.(item);
        setOpen(false);
        reset();
    }
    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next)
            reset();
    };
    const emptyNode = empty ?? (fetcher && remote.loading ? "Loading..." : "No data");
    return (<Picker {...props} open={open} onOpenChange={handleOpenChange} value={value} onValueChange={(next) => {
            latestRef.current = next;
            if (!isControlled)
                setValue(next);
            if (composingRef.current)
                return;
            onValueChange?.(next);
            reset();
            if (fetcher)
                remote.search(next);
        }} onCompositionStart={(e) => {
            composingRef.current = true;
            onCompositionStartProp?.(e);
        }} onCompositionEnd={(e) => {
            if (composingRef.current) {
                composingRef.current = false;
                const finalText = latestRef.current;
                if (!isControlled)
                    setValue(finalText);
                reset();
                if (fetcher)
                    remote.search(finalText);
                onValueChange?.(finalText);
            }
            onCompositionEndProp?.(e);
        }} aria-invalid={invalid || undefined} trailing={trailing === undefined ? <ChevronDown aria-hidden/> : trailing} onKeyDown={handleKeyDown} className={className} classNames={{ input: classNames?.input, popover: cn("p-1", classNames?.panel) }} styles={{ popover: styles?.panel }}>
      <List highlightIndex={highlightIndex} onHighlightChange={setHighlightIndex} items={items} renderItem={(item) => item} getKey={(item, index) => `${item}-${index}`} empty={emptyNode} onSelect={commit} onScrollBottom={fetcher
            ? () => {
                if (remote.hasMore && !remote.loading)
                    remote.loadMore();
            }
            : undefined} className="max-h-64" classNames={{ item: classNames?.item }} styles={{ item: styles?.item }}/>
    </Picker>);
}
