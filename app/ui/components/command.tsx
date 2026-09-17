"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Dialog } from "./dialog";
import { Button } from "./button";
import { InputRoot } from "./input-group";
import { Kbd } from "./kbd";
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
      for (const item of entry.items) rows.push({ item, group: entry.group });
    } else {
      rows.push({ item: entry, group: null });
    }
  }
  return rows;
}

function itemText(item: CommandItemConfig) {
  const label = typeof item.label === "string" ? item.label : "";
  return [item.value ?? "", label, ...(item.keywords ?? [])].join(" ").toLowerCase();
}

const defaultFilter = (item: CommandItemConfig, keyword: string) =>
  itemText(item).includes(keyword);

type CommandRenderItemState = {
  highlighted: boolean;
  disabled: boolean;
};

export type CommandRenderItem = (
  item: CommandItemConfig,
  state: CommandRenderItemState,
) => React.ReactNode;

const defaultRenderItem: CommandRenderItem = (item, { disabled }) => (
  <>
    {item.icon && (
      <span className="shrink-0 text-muted-foreground [&>svg]:size-4" aria-hidden>
        {item.icon}
      </span>
    )}
    <span className={cn("min-w-0 flex-1 truncate", disabled && "opacity-50")}>{item.label}</span>
    {item.shortcut && (
      <Kbd className="h-5 min-w-5 px-1.5 py-0 text-[10px] font-medium shadow-none">
        {item.shortcut}
      </Kbd>
    )}
  </>
);

interface CommandContextValue {
  keyword: string;
  setKeyword: (keyword: string) => void;
  rows: CommandRow[];
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

export interface CommandRootProps
  extends Omit<React.ComponentProps<"div">, "className" | "onSelect"> {
  items: CommandConfig[];
  /** Synced by the dialog composite — when it turns true the keyword is cleared and the input focused. */
  open?: boolean;
  filter?: (item: CommandItemConfig, keyword: string) => boolean;
  onSelect?: (item: CommandItemConfig) => void;
  className?: ClassNameValue;
}

export function CommandRoot({
  items,
  open,
  filter,
  onSelect,
  className,
  children,
  ...props
}: CommandRootProps) {
  const [keyword, setKeyword] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const rows = React.useMemo(() => {
    const all = flattenItems(items);
    const kw = keyword.trim().toLowerCase();
    if (!kw) return all;
    const match = filter ?? defaultFilter;
    return all.filter((row) => !row.item.disabled && match(row.item, kw));
  }, [items, keyword, filter]);

  const selectRow = (row: CommandRow | undefined) => {
    if (!row || row.item.disabled) return;
    onSelect?.(row.item);
  };

  const { highlightIndex, setHighlightIndex, handleKeyDown } = useCombobox({
    open: true,
    items: rows,
    isItemDisabled: (row) => Boolean(row.item.disabled),
    onSelect: (row) => selectRow(row),
  });

  React.useEffect(() => {
    const first = rows.findIndex((row) => !row.item.disabled);
    setHighlightIndex(first >= 0 ? first : null);
  }, [rows, setHighlightIndex]);

  React.useEffect(() => {
    if (!open) return;
    setKeyword("");
    inputRef.current?.focus();
  }, [open]);

  return (
    <CommandContext.Provider
      value={{
        keyword,
        setKeyword,
        rows,
        inputRef,
        highlightIndex,
        setHighlightIndex,
        handleKeyDown,
        selectRow,
      }}
    >
      <div {...props} className={cn("flex flex-col", className)}>
        {children}
      </div>
    </CommandContext.Provider>
  );
}

export interface CommandInputProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  placeholder?: string;
  autoFocus?: boolean;
  className?: ClassNameValue;
}

export function CommandInput({
  placeholder,
  autoFocus,
  className,
  ...props
}: CommandInputProps) {
  const { keyword, setKeyword, inputRef, handleKeyDown } = useCommandContext();
  return (
    <div {...props} className={cn("flex items-center gap-2 border-b px-3", className)}>
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      <InputRoot
        ref={inputRef}
        role="combobox"
        aria-autocomplete="list"
        autoFocus={autoFocus}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-11 px-0"
      />
    </div>
  );
}

export interface CommandListProps {
  empty?: React.ReactNode;
  renderItem?: CommandRenderItem;
  className?: ClassNameValue;
  classNames?: {
    item?: ClassNameValue;
    label?: ClassNameValue;
  };
  styles?: {
    item?: React.CSSProperties;
    label?: React.CSSProperties;
  };
}

export function CommandList({
  empty,
  renderItem,
  className,
  classNames,
  styles,
}: CommandListProps) {
  const { rows, highlightIndex, setHighlightIndex, selectRow } = useCommandContext();
  const hasGroups = rows.some((row) => row.group !== null);
  const render = renderItem ?? defaultRenderItem;

  return (
    <List
      items={rows}
      getKey={(row, index) => row.item.value ?? index}
      getGroup={hasGroups ? (row) => row.group ?? "" : undefined}
      renderGroupHeader={hasGroups ? (group) => group : undefined}
      renderItem={(row, index) =>
        render(row.item, {
          highlighted: highlightIndex === index,
          disabled: Boolean(row.item.disabled),
        })
      }
      empty={empty ?? "No results"}
      highlightIndex={highlightIndex}
      onHighlightChange={setHighlightIndex}
      onSelect={selectRow}
      onItemMouseMove={(row, index) => {
        if (!row.item.disabled && highlightIndex !== index) setHighlightIndex(index);
      }}
      className={cn(
        "max-h-72 overflow-y-auto p-1 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1",
        className,
      )}
      classNames={{
        item: cn("flex items-center gap-2 rounded-sm hover:bg-transparent", classNames?.item),
        groupHeader: classNames?.label,
      }}
      styles={{ item: styles?.item, groupHeader: styles?.label }}
    />
  );
}

export interface CommandProps {
  items: CommandConfig[];
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: CommandItemConfig) => void;
  filter?: (item: CommandItemConfig, keyword: string) => boolean;
  renderItem?: CommandRenderItem;
  placeholder?: string;
  empty?: React.ReactNode;
  className?: ClassNameValue;
  classNames?: {
    trigger?: ClassNameValue;
    content?: ClassNameValue;
    input?: ClassNameValue;
    list?: ClassNameValue;
    item?: ClassNameValue;
    label?: ClassNameValue;
  };
  styles?: {
    content?: React.CSSProperties;
    list?: React.CSSProperties;
    item?: React.CSSProperties;
    label?: React.CSSProperties;
  };
}

export function Command({
  items,
  trigger,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  filter,
  renderItem,
  placeholder,
  empty,
  className,
  classNames,
  styles,
}: CommandProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <>
      {trigger && (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={cn(Button.className.primary, classNames?.trigger)}
        >
          {trigger}
        </button>
      )}
      <Dialog
        open={open}
        onOpenChange={setOpen}
        onBackdropClick={() => setOpen(false)}
        className={className}
        classNames={{
          content: cn("top-[12%] translate-y-0 w-full max-w-lg p-0", classNames?.content),
          close: "hidden",
        }}
        styles={{ content: styles?.content }}
      >
        <CommandRoot
          items={items}
          open={open}
          filter={filter}
          onSelect={(item) => {
            onSelect?.(item);
            setOpen(false);
          }}
        >
          <CommandInput placeholder={placeholder} className={classNames?.input} />
          <CommandList
            empty={empty}
            renderItem={renderItem}
            className={classNames?.list}
            classNames={{ item: classNames?.item, label: classNames?.label }}
            styles={{ item: styles?.item, label: styles?.label }}
          />
        </CommandRoot>
      </Dialog>
    </>
  );
}
