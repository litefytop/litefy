"use client";
import * as React from "react";
import { Search } from "./icons";
import { ButtonRoot } from "./button";
import { Dialog, type DialogProps } from "./dialog";
import { Input } from "./input";
import { List } from "./list";
import { useCombobox } from "../utils/use-combobox";
export type CommandItemConfig = {
    label: React.ReactNode;
    value?: string;
    icon?: React.ReactNode;
    shortcut?: React.ReactNode;
    keywords?: string[];
    disabled?: boolean;
};
export type CommandGroupConfig = {
    group: string;
    items: CommandItemConfig[];
};
export type CommandConfig = CommandGroupConfig | CommandItemConfig;
type CommandRow = {
    item: CommandItemConfig;
    group: string | null;
};
function flattenItems(items: CommandConfig[]): CommandRow[] {
    const rows: CommandRow[] = [];
    for (const entry of items) {
        if ("items" in entry) {
            for (const item of entry.items)
                rows.push({ item, group: entry.group });
        }
        else {
            rows.push({ item: entry, group: null });
        }
    }
    return rows;
}
function itemText(item: CommandItemConfig) {
    const label = typeof item.label === "string" ? item.label : "";
    return [item.value ?? "", label, ...(item.keywords ?? [])].join(" ").toLowerCase();
}
const defaultFilter = (item: CommandItemConfig, keyword: string) => itemText(item).includes(keyword);
type CommandRenderItemState = {
    highlighted: boolean;
    disabled: boolean;
};
export type CommandRenderItem = (item: CommandItemConfig, state: CommandRenderItemState) => React.ReactNode;
function defaultRenderItem(item: CommandItemConfig, { disabled }: CommandRenderItemState, classNames?: Pick<CommandListClassNames, "itemIcon" | "itemLabel" | "shortcut">) {
    return (<>
    {item.icon && (<span className={classNames?.itemIcon} aria-hidden>
        {item.icon}
      </span>)}
    <span className={classNames?.itemLabel} data-disabled={disabled || undefined}>{item.label}</span>
    {item.shortcut && (<kbd className={classNames?.shortcut}>
        {item.shortcut}
      </kbd>)}
  </>);
}
interface CommandContextValue {
    keyword: string;
    setKeyword: (keyword: string) => void;
    rows: CommandRow[];
    listId: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    highlightIndex: number | null;
    setHighlightIndex: React.Dispatch<React.SetStateAction<number | null>>;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    selectRow: (row: CommandRow | undefined) => void;
}
const CommandContext = React.createContext<CommandContextValue | null>(null);
function useCommandContext() {
    const context = React.useContext(CommandContext);
    if (!context) {
        throw new Error("Command parts must be used inside <CommandRoot>.");
    }
    return context;
}
export interface CommandRootProps extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
    items: CommandConfig[];
    open?: boolean;
    filter?: (item: CommandItemConfig, keyword: string) => boolean;
    onKeywordChange?: (keyword: string) => void;
    onSelect?: (item: CommandItemConfig) => void;
    className?: string;
}
export function CommandRoot({ items, open, filter, onKeywordChange, onSelect, className, children, ...props }: CommandRootProps) {
    const [keyword, setKeywordState] = React.useState("");
    const onKeywordChangeRef = React.useRef(onKeywordChange);
    const onSelectRef = React.useRef(onSelect);
    const emitKeyword = React.useCallback((next: string) => {
        setKeywordState(next);
        onKeywordChangeRef.current?.(next);
    }, []);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listId = React.useId();
    const rows = React.useMemo(() => {
        const all = flattenItems(items);
        const kw = keyword.trim().toLowerCase();
        if (!kw)
            return all;
        const match = filter ?? defaultFilter;
        return all.filter((row) => !row.item.disabled && match(row.item, kw));
    }, [items, keyword, filter]);
    const selectRow = React.useCallback((row: CommandRow | undefined) => {
        if (!row || row.item.disabled)
            return;
        onSelectRef.current?.(row.item);
    }, []);
    const combobox = useCombobox({
        open: true,
        items: rows,
        isItemDisabled: (row) => Boolean(row.item.disabled),
        onSelect: (row) => selectRow(row),
    });
    const { highlightIndex, setHighlightIndex } = combobox;
    const keyDownRef = React.useRef(combobox.handleKeyDown);
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        keyDownRef.current(e);
    }, []);
    React.useLayoutEffect(() => {
        onKeywordChangeRef.current = onKeywordChange;
        onSelectRef.current = onSelect;
        keyDownRef.current = combobox.handleKeyDown;
    });
    const [prevOpen, setPrevOpen] = React.useState(open);
    if (open !== prevOpen) {
        setPrevOpen(open);
        if (open) {
            setKeywordState("");
        }
    }
    React.useEffect(() => {
        const first = rows.findIndex((row) => !row.item.disabled);
        setHighlightIndex(first >= 0 ? first : null);
    }, [rows, setHighlightIndex]);
    React.useEffect(() => {
        if (!open)
            return;
        inputRef.current?.focus();
    }, [open]);
    const contextValue = React.useMemo(() => ({
        keyword,
        setKeyword: emitKeyword,
        rows,
        listId,
        inputRef,
        highlightIndex,
        setHighlightIndex,
        handleKeyDown,
        selectRow,
    }), [keyword, emitKeyword, rows, listId, inputRef, highlightIndex, setHighlightIndex, handleKeyDown, selectRow]);
    return (<CommandContext.Provider value={contextValue}>
      <div {...props} className={className}>
        {children}
      </div>
    </CommandContext.Provider>);
}
export interface CommandInputProps extends Omit<React.ComponentProps<"div">, "className"> {
    placeholder?: string;
    autoFocus?: boolean;
    trailing?: React.ReactNode;
    className?: string;
    inputClassNames?: React.ComponentProps<typeof Input>["classNames"];
    classNames?: {
        icon?: string;
    };
}
export function CommandInput({ placeholder, autoFocus, trailing, className, inputClassNames, classNames, ...props }: CommandInputProps) {
    const { keyword, setKeyword, rows, listId, inputRef, highlightIndex, handleKeyDown } = useCommandContext();
    const activeDescendant = highlightIndex === null ? undefined : `${listId}-${highlightIndex}`;
    return (<div {...props} className={className}>
      <Input ref={inputRef} role="combobox" aria-autocomplete="list" aria-expanded={rows.length > 0} aria-controls={listId} aria-activedescendant={activeDescendant} autoFocus={autoFocus} leading={<Search aria-hidden className={classNames?.icon}/>} trailing={trailing} value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} classNames={inputClassNames}/>
    </div>);
}
export interface CommandFooterProps extends React.ComponentProps<"div"> {
    navigate?: React.ReactNode;
    open?: React.ReactNode;
    close?: React.ReactNode;
    classNames?: {
        hint?: string;
        hintKey?: string;
    };
}
export function CommandFooter({ navigate = "Navigate", open = "Open", close = "Close", classNames, ...props }: CommandFooterProps) {
    return (<div {...props} data-command-footer="">
      <span data-command-hint="" className={classNames?.hint}>
        <kbd data-command-hint-key="" aria-hidden className={classNames?.hintKey}>↑</kbd>
        <kbd data-command-hint-key="" aria-hidden className={classNames?.hintKey}>↓</kbd>
        <span>{navigate}</span>
      </span>
      <span data-command-hint="" className={classNames?.hint}>
        <kbd data-command-hint-key="" aria-hidden className={classNames?.hintKey}>↵</kbd>
        <span>{open}</span>
      </span>
      <span data-command-hint="" className={classNames?.hint}>
        <kbd data-command-hint-key="" aria-hidden className={classNames?.hintKey}>esc</kbd>
        <span>{close}</span>
      </span>
    </div>);
}
export interface CommandListClassNames {
    rows?: string;
    item?: string;
    label?: string;
    itemIcon?: string;
    itemLabel?: string;
    shortcut?: string;
    empty?: string;
}
export interface CommandListProps extends Omit<React.ComponentProps<"div">, "children" | "className"> {
    empty?: React.ReactNode;
    renderItem?: CommandRenderItem;
    className?: string;
    classNames?: CommandListClassNames;
    styles?: {
        item?: React.CSSProperties;
        label?: React.CSSProperties;
    };
}
export function CommandList({ empty, renderItem, className, classNames, styles, ...props }: CommandListProps) {
    const { rows, listId, highlightIndex, setHighlightIndex, selectRow } = useCommandContext();
    if (rows.length === 0 && empty === null)
        return null;
    const hasGroups = rows.some((row) => row.group !== null);
    const render = renderItem ?? ((item, state) => defaultRenderItem(item, state, classNames));
    return (<div {...props}>
      <List id={listId} items={rows} getKey={(row, index) => row.item.value ?? index} getGroup={hasGroups ? (row) => row.group ?? "" : undefined} renderGroupHeader={hasGroups ? (group) => group : undefined} renderItem={(row, index) => render(row.item, {
            highlighted: highlightIndex === index,
            disabled: Boolean(row.item.disabled),
        })} isItemDisabled={(row) => Boolean(row.item.disabled)} empty={empty ?? "No results"} highlightIndex={highlightIndex} onHighlightChange={setHighlightIndex} onSelect={selectRow} onItemMouseMove={(_, index) => {
            if (highlightIndex !== index)
                setHighlightIndex(index);
        }} className={className} classNames={{ root: classNames?.rows, item: classNames?.item, groupHeader: classNames?.label, empty: classNames?.empty }} styles={{ item: styles?.item, groupHeader: styles?.label }}/>
    </div>);
}
export interface CommandProps extends Omit<React.ComponentProps<"button">, "children" | "className" | "style" | "type" | "onSelect" | "disabled"> {
    items: CommandConfig[];
    trigger?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSelect?: (item: CommandItemConfig) => void;
    filter?: (item: CommandItemConfig, keyword: string) => boolean;
    onKeywordChange?: (keyword: string) => void;
    renderItem?: CommandRenderItem;
    placeholder?: string;
    empty?: React.ReactNode;
    hints?: {
        navigate?: React.ReactNode;
        open?: React.ReactNode;
        close?: React.ReactNode;
    } | null;
    trailing?: React.ReactNode;
    className?: string;
    classNames?: {
        trigger?: string;
        content?: string;
        input?: string;
        field?: React.ComponentProps<typeof Input>["classNames"];
        searchIcon?: string;
        list?: string;
        root?: string;
        footer?: string;
        hint?: string;
        hintKey?: string;
        rows?: string;
        item?: string;
        label?: string;
        itemIcon?: string;
        itemLabel?: string;
        shortcut?: string;
        empty?: string;
    };
    styles?: {
        content?: React.CSSProperties;
        list?: React.CSSProperties;
        item?: React.CSSProperties;
        label?: React.CSSProperties;
    };
    dialogClassNames?: DialogProps["classNames"];
    dialogStyles?: DialogProps["styles"];
}
export function Command({ items, trigger, open: controlledOpen, defaultOpen = false, onOpenChange, onSelect, filter, onKeywordChange, renderItem, placeholder, empty, hints, trailing, className, classNames, styles, dialogClassNames, dialogStyles, "aria-haspopup": ariaHasPopup, ...props }: CommandProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;
    const setOpen = (next: boolean) => {
        if (!isControlled)
            setUncontrolledOpen(next);
        onOpenChange?.(next);
    };
    return (<>
      {trigger && (<ButtonRoot {...props} type="button" aria-haspopup={ariaHasPopup ?? "dialog"} aria-expanded={open} onClick={() => setOpen(true)} className={classNames?.trigger}>
          {trigger}
        </ButtonRoot>)}
      <Dialog open={open} onOpenChange={setOpen} aria-label={placeholder} className={className} classNames={{
            ...dialogClassNames,
            content: [dialogClassNames?.content, classNames?.content].filter(Boolean).join(" ") || undefined,
        }} styles={{ ...dialogStyles, content: styles?.content }}>
        <CommandRoot items={items} open={open} filter={filter} onKeywordChange={onKeywordChange} onSelect={(item) => {
            onSelect?.(item);
            setOpen(false);
        }} className={classNames?.root}>
          <CommandInput placeholder={placeholder} className={classNames?.input} inputClassNames={classNames?.field} classNames={{ icon: classNames?.searchIcon }} trailing={trailing}/>

          <CommandList empty={empty} renderItem={renderItem} className={classNames?.list} classNames={{ rows: classNames?.rows, item: classNames?.item, label: classNames?.label, itemIcon: classNames?.itemIcon, itemLabel: classNames?.itemLabel, shortcut: classNames?.shortcut, empty: classNames?.empty }} styles={{ item: styles?.item, label: styles?.label }}/>
          {hints !== null && <CommandFooter navigate={hints?.navigate} open={hints?.open} close={hints?.close} className={classNames?.footer} classNames={{ hint: classNames?.hint, hintKey: classNames?.hintKey }}/>}
        </CommandRoot>
      </Dialog>
    </>);
}
