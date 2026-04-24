"use client";

import { useMemo, useState } from "react";
import { Checkbox, Input } from "@/components";
import { cn, ClassNameValue } from "@/lib";

const transferClass = {
  base: "flex items-start gap-4",
  panel: "w-64 rounded-lg border bg-card text-card-foreground shadow-sm",
  body: "max-h-80 overflow-y-auto",
  actions: "flex flex-col justify-center gap-2 py-4",
  header: "px-4 py-3 border-b flex flex-col items-center justify-center gap-2",
  headerTitle: "font-semibold text-sm",
  item: "flex items-center gap-2 py-1",
};

const buttonClass = {
  base: `cursor-pointer outline-none inline-flex items-center justify-center shrink-0 user-select-none h-8 px-3 rounded-md
    focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
    disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0`,
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
  },
};

export type TransferKey = React.Key;

export type TransferItem = {
  key: TransferKey;
  title: string;
};

export type TransferDirection = "left" | "right";

export type TransferProps = {
  dataSource: TransferItem[];
  targetKeys: TransferKey[];
  onChange: (
    targetKeys: TransferKey[],
    direction: TransferDirection,
    moveKeys: TransferKey[],
  ) => void;
  render?: (item: TransferItem) => React.ReactNode;
  titles?: [string, string];
  showSearch?: boolean;
  filterOption?: (inputValue: string, option: TransferItem) => boolean;
  className?: ClassNameValue;
};

export function Transfer({
  dataSource,
  targetKeys,
  onChange,
  titles = ["源列表", "目标列表"],
  showSearch = false,
  filterOption = (input, option) =>
    option.title.toLowerCase().includes(input.toLowerCase()),
  className,
}: TransferProps) {
  const rightList = useMemo(
    () => dataSource.filter((item) => targetKeys.includes(item.key)),
    [dataSource, targetKeys],
  );

  const leftList = useMemo(
    () => dataSource.filter((item) => !targetKeys.includes(item.key)),
    [dataSource, targetKeys],
  );

  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");

  const [leftChecked, setLeftChecked] = useState<Set<TransferKey>>(new Set());
  const [rightChecked, setRightChecked] = useState<Set<TransferKey>>(new Set());

  const filteredLeft = useMemo(() => {
    if (!showSearch) return leftList;
    return leftList.filter((item) => filterOption(leftSearch, item));
  }, [leftList, leftSearch, showSearch, filterOption]);

  const filteredRight = useMemo(() => {
    if (!showSearch) return rightList;
    return rightList.filter((item) => filterOption(rightSearch, item));
  }, [rightList, rightSearch, showSearch, filterOption]);

  const handleMoveRight = () => {
    const moveKeys = Array.from(leftChecked);
    if (moveKeys.length === 0) return;

    const nextTargetKeys = [...targetKeys, ...moveKeys];
    onChange(nextTargetKeys, "right", moveKeys);

    setLeftChecked(new Set());
  };

  const handleMoveLeft = () => {
    const moveKeys = Array.from(rightChecked);
    if (moveKeys.length === 0) return;

    const nextTargetKeys = targetKeys.filter((key) => !moveKeys.includes(key));
    onChange(nextTargetKeys, "left", moveKeys);

    setRightChecked(new Set());
  };

  return (
    <div className={cn(transferClass.base, className)}>
      <div className={transferClass.panel}>
        <div className={transferClass.header}>
          <span className={transferClass.headerTitle}>{titles[0]}</span>
          {showSearch && (
            <Input
              variant="plain"
              placeholder="搜索..."
              value={leftSearch}
              onChange={(e) => setLeftSearch(e.target.value)}
            />
          )}
        </div>
        <div className={cn(transferClass.body, "p-4")}>
          {filteredLeft.length === 0 ? (
            <p className="text-sm text-muted-foreground">无数据</p>
          ) : (
          <Checkbox.Group
              value={Array.from(leftChecked).map((key) => String(key))}
              onValueChange={(values: string[]) => setLeftChecked(new Set(values))}
            >
              {filteredLeft.map((item) => (
                <div key={item.key} className={transferClass.item}>
                  <Checkbox id={`left-${String(item.key)}`} value={String(item.key)}>
                    {item.title}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          )}
        </div>
      </div>

      <div className={transferClass.actions}>
        <button
          type="button"
          onClick={handleMoveRight}
          disabled={leftChecked.size === 0}
          className={cn(buttonClass.base, buttonClass.variant.default)}
        >
          &gt;
        </button>
        <button
          type="button"
          onClick={handleMoveLeft}
          disabled={rightChecked.size === 0}
          className={cn(buttonClass.base, buttonClass.variant.default)}
        >
          &lt;
        </button>
      </div>

      <div className={transferClass.panel}>
        <div className={transferClass.header}>
          <span className={transferClass.headerTitle}>{titles[1]}</span>
          {showSearch && (
            <Input
              variant="plain"
              placeholder="搜索..."
              value={rightSearch}
              onChange={(e) => setRightSearch(e.target.value)}
            />
          )}
        </div>
        <div className={cn(transferClass.body, "p-4")}>
          {filteredRight.length === 0 ? (
            <p className="text-sm text-muted-foreground">无数据</p>
          ) : (
          <Checkbox.Group
              value={Array.from(rightChecked).map((key) => String(key))}
              onValueChange={(values: string[]) => setRightChecked(new Set(values))}
            >
              {filteredRight.map((item) => (
                <div key={item.key} className={transferClass.item}>
                  <Checkbox id={`right-${String(item.key)}`} value={String(item.key)}>
                    {item.title}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          )}
        </div>
      </div>
    </div>
  );
}
