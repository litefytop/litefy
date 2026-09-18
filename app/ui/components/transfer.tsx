"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { type ClassNameValue, cn } from "../utils/cn";
import { Checkbox } from "./checkbox";

export type TransferItemConfig = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
};

export interface TransferProps
  extends Omit<React.ComponentProps<"div">, "className" | "onChange"> {
  dataSource: TransferItemConfig[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  titles?: [React.ReactNode, React.ReactNode];
  renderItem?: (item: TransferItemConfig) => React.ReactNode;
  className?: ClassNameValue;
  classNames?: {
    panel?: ClassNameValue;
    header?: ClassNameValue;
    body?: ClassNameValue;
    item?: ClassNameValue;
    actions?: ClassNameValue;
  };
  styles?: {
    panel?: React.CSSProperties;
    header?: React.CSSProperties;
    body?: React.CSSProperties;
    item?: React.CSSProperties;
    actions?: React.CSSProperties;
  };
}

export function Transfer({
  dataSource,
  value: controlledValue,
  defaultValue,
  onChange,
  titles,
  renderItem,
  className,
  classNames,
  styles,
  ...props
}: TransferProps) {
  const [uncontrolledValue, setValue] = React.useState<string[]>(defaultValue ?? []);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const [sourceChecked, setSourceChecked] = React.useState<ReadonlySet<string>>(new Set());
  const [targetChecked, setTargetChecked] = React.useState<ReadonlySet<string>>(new Set());

  const valueSet = new Set(value);
  const sourceItems = dataSource.filter((item) => !valueSet.has(item.value));
  const targetItems = dataSource.filter((item) => valueSet.has(item.value));

  const toggle = (
    checked: ReadonlySet<string>,
    setChecked: (next: ReadonlySet<string>) => void,
    itemValue: string,
    nextChecked: boolean,
  ) => {
    const next = new Set(checked);
    if (nextChecked) {
      next.add(itemValue);
    } else {
      next.delete(itemValue);
    }
    setChecked(next);
  };

  const moveRight = () => {
    const next = dataSource
      .filter((item) => valueSet.has(item.value) || sourceChecked.has(item.value))
      .map((item) => item.value);
    if (!isControlled) setValue(next);
    onChange?.(next);
    setSourceChecked(new Set());
  };

  const moveLeft = () => {
    const next = value.filter((itemValue) => !targetChecked.has(itemValue));
    if (!isControlled) setValue(next);
    onChange?.(next);
    setTargetChecked(new Set());
  };

  const renderItemContent = (item: TransferItemConfig) =>
    renderItem ? renderItem(item) : item.label;

  const renderItems = (
    items: TransferItemConfig[],
    checked: ReadonlySet<string>,
    setChecked: (next: ReadonlySet<string>) => void,
  ) => {
    if (items.length === 0) {
      return <p className="px-3 py-2 text-sm text-muted-foreground">No data</p>;
    }
    return items.map((item) => (
      <Checkbox
        key={item.value}
        checked={checked.has(item.value)}
        disabled={item.disabled}
        onCheckedChange={(next) => toggle(checked, setChecked, item.value, next)}
        classNames={{
          label: cn(
            "w-full gap-2 rounded-sm px-3 py-2 text-sm font-normal cursor-pointer hover:bg-hover",
            classNames?.item,
          ),
        }}
        styles={{ label: styles?.item }}
      >
        {renderItemContent(item)}
      </Checkbox>
    ));
  };

  const renderPanel = (
    items: TransferItemConfig[],
    checked: ReadonlySet<string>,
    setChecked: (next: ReadonlySet<string>) => void,
    title: React.ReactNode,
  ) => (
    <div
      className={cn("flex min-w-0 flex-1 flex-col rounded-lg border", classNames?.panel)}
      style={styles?.panel}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-b px-3 py-2 text-sm font-medium",
          classNames?.header,
        )}
        style={styles?.header}
      >
        <span className="truncate">{title}</span>
        <span className="text-xs font-normal text-muted-foreground">
          {checked.size}/{items.length}
        </span>
      </div>
      <div
        className={cn("flex h-64 flex-col overflow-auto p-1", classNames?.body)}
        style={styles?.body}
      >
        {renderItems(items, checked, setChecked)}
      </div>
    </div>
  );

  return (
    <div {...props} className={cn("flex items-center gap-3", className)}>
      {renderPanel(sourceItems, sourceChecked, setSourceChecked, titles?.[0] ?? "Source")}
      <div className={cn("flex flex-col items-center gap-2", classNames?.actions)} style={styles?.actions}>
        <button
          type="button"
          aria-label="Move right"
          disabled={sourceChecked.size === 0}
          onClick={moveRight}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowRight className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Move left"
          disabled={targetChecked.size === 0}
          onClick={moveLeft}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </button>
      </div>
      {renderPanel(targetItems, targetChecked, setTargetChecked, titles?.[1] ?? "Target")}
    </div>
  );
}
