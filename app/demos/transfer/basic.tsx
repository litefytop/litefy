"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Checkbox } from "@/ui/components";
import { cn } from "@/ui";

export type TransferItemConfig = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
};

export interface TransferProps {
  dataSource: TransferItemConfig[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  titles?: [React.ReactNode, React.ReactNode];
  renderItem?: (item: TransferItemConfig) => React.ReactNode;
  className?: string;
  classNames?: {
    root?: string;
    panel?: string;
    header?: string;
    body?: string;
    item?: string;
    actions?: string;
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
      >
        {renderItemContent(item)}
      </Checkbox>
    ));
  };

  return (
    <div className={cn("flex items-center gap-3", className, classNames?.root)}>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col rounded-md border bg-background",
          classNames?.panel,
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 border-b px-3 py-2 text-sm font-medium",
            classNames?.header,
          )}
        >
          <span className="truncate">{titles?.[0] ?? "Source"}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {sourceChecked.size}/{sourceItems.length}
          </span>
        </div>
        <div className={cn("flex max-h-64 flex-col overflow-auto p-1", classNames?.body)}>
          {renderItems(sourceItems, sourceChecked, setSourceChecked)}
        </div>
      </div>
      <div className={cn("flex flex-col items-center gap-2", classNames?.actions)}>
        <button
          type="button"
          aria-label="Move right"
          disabled={sourceChecked.size === 0}
          onClick={moveRight}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <ArrowRight className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Move left"
          disabled={targetChecked.size === 0}
          onClick={moveLeft}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <ArrowLeft className="size-4" />
        </button>
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col rounded-md border bg-background",
          classNames?.panel,
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2 border-b px-3 py-2 text-sm font-medium",
            classNames?.header,
          )}
        >
          <span className="truncate">{titles?.[1] ?? "Target"}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {targetChecked.size}/{targetItems.length}
          </span>
        </div>
        <div className={cn("flex max-h-64 flex-col overflow-auto p-1", classNames?.body)}>
          {renderItems(targetItems, targetChecked, setTargetChecked)}
        </div>
      </div>
    </div>
  );
}

const dataSource: TransferItemConfig[] = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "Python", value: "python", disabled: true },
  { label: "Java", value: "java" },
];

export default function TransferBasicDemo() {
  const [value, setValue] = React.useState<string[]>(["ts", "go"]);

  return (
    <div className="w-full space-y-3">
      <Transfer
        dataSource={dataSource}
        value={value}
        onChange={setValue}
        titles={["Available", "Selected"]}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {value.length === 0 ? "-" : value.join(", ")}
      </p>
    </div>
  );
}
