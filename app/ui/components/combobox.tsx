"use client";
import * as React from "react";
import { List, type ListClassNames } from "./list";
import { Picker } from "./picker";
import { Search } from "./icons";
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
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    className?: string;
    classNames?: {
        panel?: string;
        item?: string;
        input?: string;
        leading?: string;
        trailing?: string;
        list?: ListClassNames;
    };
    styles?: {
        panel?: React.CSSProperties;
        item?: React.CSSProperties;
        leading?: React.CSSProperties;
    };
}
export function Combobox({ options, fetcher, value: controlledValue, defaultValue = "", onValueChange, onCommit, invalid, empty, pageSize = 20, debounceMs = 300, leading, trailing, onCompositionStart: onCompositionStartProp, onCompositionEnd: onCompositionEndProp, onKeyDown: onKeyDownProp, className, classNames, styles, ...props }: ComboboxProps) {
    const defaultLeading = leading === undefined ? <Search aria-hidden="true" /> : leading;
    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setValue] = React.useState(defaultValue);
    const [open, setOpen] = React.useState(false);
    const value = isControlled ? controlledValue : uncontrolledValue;
    const noopFetcher = React.useCallback<ComboboxFetcher>(() => Promise.resolve({ list: [], total: 0 }), []);
    const remote = useRemotePagination({
        fetcher: fetcher ?? noopFetcher,
        debounceMs,
        pageSize,
    });
    const fetcherRef = React.useRef(fetcher);
    React.useEffect(() => {
        fetcherRef.current = fetcher;
    });
    const composingRef = React.useRef(false);
    const latestRef = React.useRef(defaultValue);
    const initialSearch = remote.search;
    React.useEffect(() => {
        if (fetcherRef.current)
            initialSearch("");
    }, [initialSearch]);
    const normalizedOptions = React.useMemo(() => {
        if (!options)
            return [];
        return options.map((option) => [option, option.replaceAll(/\s+/gu, "").toLowerCase()]);
    }, [options]);
    const localItems = React.useMemo(() => {
        if (!options)
            return [];
        const keyword = value.replaceAll(/\s+/gu, "").toLowerCase();
        if (!keyword)
            return options;
        return normalizedOptions
            .filter(([, normalized]) => normalized.includes(keyword))
            .map(([option]) => option);
    }, [normalizedOptions, options, value]);
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
        }} aria-invalid={invalid || undefined} leading={defaultLeading} trailing={trailing} onKeyDown={(e) => {
            onKeyDownProp?.(e);
            if (!e.defaultPrevented)
                handleKeyDown(e);
        }} className={className} classNames={{ leading: classNames?.leading, input: classNames?.input, trailing: classNames?.trailing, popover: classNames?.panel }} styles={{ leading: styles?.leading, popover: styles?.panel }}>
      <List highlightIndex={highlightIndex} onHighlightChange={setHighlightIndex} items={items} renderItem={(item) => item} getKey={(item, index) => `${item}-${index}`} empty={emptyNode} onSelect={commit} onScrollBottom={fetcher
            ? () => {
                if (remote.hasMore && !remote.loading)
                    remote.loadMore();
            }
            : undefined} className={classNames?.list?.viewport} classNames={{ ...classNames?.list, item: classNames?.item ?? classNames?.list?.item }} styles={{ item: styles?.item }}/>
    </Picker>);
}
