"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { InputGroup, InputRoot, InputLeading } from "./input-group";

export interface DualPickerOption<T> {
  
  value: string;
  
  option: T;
}

export interface DualPickerProps<T> {
  options: DualPickerOption<T>[];
  
  mode?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  
  renderOption?: (option: T, state: { selected: boolean }) => React.ReactNode;
  
  renderSelected?: (
    option: T,
    state: { selected: boolean; onRemove: () => void },
  ) => React.ReactNode;
  
  getLabel?: (option: T) => string;
  searchPlaceholder?: string;
  sourceTitle?: React.ReactNode;
  targetTitle?: React.ReactNode;
  disabled?: boolean;
  className?: ClassNameValue;
  classNames?: {
    panel?: ClassNameValue;
    header?: ClassNameValue;
    body?: ClassNameValue;
    item?: ClassNameValue;
    selected?: ClassNameValue;
  };
  styles?: {
    panel?: React.CSSProperties;
    body?: React.CSSProperties;
  };
}

export function DualPicker<T>({
  options,
  mode = "multiple",
  value: controlledValue,
  defaultValue = [],
  onValueChange,
  renderOption,
  renderSelected,
  getLabel = (option: T) => String(option),
  searchPlaceholder = "Search...",
  sourceTitle = "Options",
  targetTitle = "Selected",
  disabled,
  className,
  classNames,
  styles,
}: DualPickerProps<T>) {
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const [keyword, setKeyword] = React.useState("");

  const setValue = (next: string[]) => {
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const selectedSet = React.useMemo(() => new Set(value), [value]);

  const select = (optionValue: string) => {
    if (disabled) return;
    if (mode === "single") {
      setValue(selectedSet.has(optionValue) ? [] : [optionValue]);
      return;
    }
    setValue(
      selectedSet.has(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    );
  };

  const deselect = (optionValue: string) => {
    if (disabled) return;
    setValue(value.filter((v) => v !== optionValue));
  };

  const kw = keyword.trim().toLowerCase();
  const filtered = kw
    ? options.filter((o) => {
        const haystack = `${o.value} ${getLabel(o.option)}`.toLowerCase();
        return haystack.includes(kw);
      })
    : options;
  const selectedOptions = value
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is DualPickerOption<T> => Boolean(o));

  const defaultOption = (option: T) => getLabel(option);
  const panelClass = "flex min-w-0 flex-1 flex-col rounded-lg border";
  const bodyClass = "flex max-h-64 flex-col overflow-auto p-1";

  return (
    <div className={cn("flex items-stretch gap-3", className)}>
      <div className={cn(panelClass, classNames?.panel)} style={styles?.panel}>
        <div className={cn("border-b px-3 py-2 text-sm font-medium", classNames?.header)}>
          {sourceTitle}
        </div>
        <div className="border-b p-1">
          <InputGroup className="max-w-full border-0 shadow-none">
            <InputLeading>
              <Search className="size-4" />
            </InputLeading>
            <InputRoot
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </InputGroup>
        </div>
        <div
          className={cn(bodyClass, classNames?.body)}
          style={styles?.body}
          role="listbox"
          aria-label={typeof sourceTitle === "string" ? sourceTitle : undefined}
        >
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No options</div>
          )}
          {filtered.map(({ value: v, option }) => {
            const selected = selectedSet.has(v);
            return (
              <div
                key={v}
                role="option"
                aria-selected={selected}
                onClick={() => select(v)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors",
                  selected ? "bg-primary/10" : "hover:bg-hover",
                  disabled && "pointer-events-none opacity-50",
                  classNames?.item,
                )}
              >
                {renderOption ? renderOption(option, { selected }) : defaultOption(option)}
              </div>
            );
          })}
        </div>
      </div>

      <div className={cn(panelClass, classNames?.panel)}>
        <div className={cn("flex items-center justify-between border-b px-3 py-2 text-sm font-medium", classNames?.header)}>
          <span>{targetTitle}</span>
          <span className="text-xs font-normal text-muted-foreground">{value.length}</span>
        </div>
        <div className={cn(bodyClass, classNames?.body)} style={styles?.body}>
          {selectedOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">Nothing selected</div>
          )}
          {selectedOptions.map(({ value: v, option }) => {
            const onRemove = () => deselect(v);
            return (
              <div
                key={v}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-hover",
                  disabled && "pointer-events-none opacity-50",
                  classNames?.selected,
                )}
                onClick={onRemove}
              >
                {renderSelected ? (
                  renderSelected(option, { selected: true, onRemove })
                ) : (
                  <>
                    <span className="min-w-0 flex-1 truncate">{getLabel(option)}</span>
                    <X className="size-3.5 shrink-0 text-muted-foreground" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
