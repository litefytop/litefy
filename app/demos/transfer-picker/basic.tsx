"use client";

import { useEffect, useState } from "react";
import { Button, Checkbox, Input, List, Popover, useRemotePagination } from "@/ui";

type SelectedEntry = {
  value: string;
  label: string;
  count: number;
};

const fetchAsyncOptions = async ({
  page,
  size,
  keyword,
}: {
  page: number;
  size: number;
  keyword: string;
}) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const totalItems = 1000;
  const allItems = Array.from({ length: totalItems }, (_, i) => `Item ${i + 1}`);
  const filtered = keyword
    ? allItems.filter((item) => item.toLowerCase().includes(keyword.toLowerCase()))
    : allItems;
  const start = (page - 1) * size;
  const paged = filtered.slice(start, start + size);

  return { list: paged, total: filtered.length };
};

export default function TransferPickerBasicDemo() {
  const remote = useRemotePagination({
    fetcher: fetchAsyncOptions,
    debounceMs: 300,
    pageSize: 20,
  });
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<SelectedEntry[]>([]);
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    remote.search("");
  }, []);

  const totalCount = selected.reduce((sum, entry) => sum + entry.count, 0);
  const selectedValues = new Set(selected.map((entry) => entry.value));

  const toggleChecked = (value: string, next: boolean) => {
    setChecked((prev) => {
      const nextSet = new Set(prev);
      if (next) {
        nextSet.add(value);
      } else {
        nextSet.delete(value);
      }
      return nextSet;
    });
  };

  const addToSelected = (label: string) => {
    setSelected((prev) => {
      const existing = prev.find((entry) => entry.value === label);
      if (existing) {
        return prev.map((entry) =>
          entry.value === label ? { ...entry, count: entry.count + 1 } : entry,
        );
      }
      return [...prev, { value: label, label, count: 1 }];
    });
    setHighlightIndex(null);
  };

  const removeChecked = () => {
    setSelected((prev) => prev.filter((entry) => !checked.has(entry.value)));
    setChecked(new Set());
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setHighlightIndex(null);
        }}
        trigger={`Options (${selected.length})`}
        classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
        className="w-[36rem] max-w-[90vw]"
      >
        <div className="flex gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setHighlightIndex(null);
                remote.search(e.target.value);
              }}
              onKeyDown={(e) => {
                if (!open) return;
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightIndex(
                    highlightIndex === null || highlightIndex >= remote.data.length - 1
                      ? 0
                      : highlightIndex + 1,
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightIndex(
                    highlightIndex === null || highlightIndex <= 0
                      ? remote.data.length - 1
                      : highlightIndex - 1,
                  );
                } else if (e.key === "Enter" && highlightIndex !== null) {
                  e.preventDefault();
                  addToSelected(remote.data[highlightIndex]);
                }
              }}
              placeholder="Type to search remotely"
            />
            <List
              highlightIndex={highlightIndex}
              onHighlightChange={setHighlightIndex}
              items={remote.data}
              renderItem={(item) => (
                <span className="flex items-center justify-between gap-2">
                  <span>{item}</span>
                  {selectedValues.has(item) && (
                    <span className="text-xs text-muted-foreground">
                      ×{selected.find((entry) => entry.value === item)?.count}
                    </span>
                  )}
                </span>
              )}
              getKey={(item) => item}
              empty={
                <div className="pointer-events-none px-3 py-2 text-sm text-muted-foreground">
                  {remote.loading ? "Loading..." : "No data"}
                </div>
              }
              onSelect={(item) => addToSelected(item)}
              onScrollBottom={() => {
                if (remote.hasMore && !remote.loading) remote.loadMore();
              }}
              className="max-h-56 rounded-md border"
            />
            <p className="px-1 text-xs text-muted-foreground">
              Click or press Enter to move an item to the right — selecting it again increments its count.
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col rounded-md border">
            <div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-sm font-medium">
              <span>Selected</span>
              <span className="text-xs font-normal text-muted-foreground">{totalCount}</span>
            </div>
            <div className="flex min-h-24 flex-1 flex-col overflow-auto p-1">
              {selected.length === 0 ? (
                <p className="px-3 py-2 text-sm text-muted-foreground">No data</p>
              ) : (
                selected.map((entry) => (
                  <Checkbox
                    key={entry.value}
                    checked={checked.has(entry.value)}
                    onCheckedChange={(next) => toggleChecked(entry.value, next)}
                    classNames={{
                      label: "w-full gap-2 rounded-sm px-3 py-2 text-sm font-normal cursor-pointer hover:bg-hover",
                    }}
                  >
                    <span className="flex min-w-0 items-center justify-between gap-2">
                      <span className="truncate">{entry.label}</span>
                      <span className="text-xs text-muted-foreground">×{entry.count}</span>
                    </span>
                  </Checkbox>
                ))
              )}
            </div>
            <div className="border-t p-1">
              <button
                type="button"
                disabled={checked.size === 0}
                onClick={removeChecked}
                className="w-full cursor-pointer rounded-sm px-2 py-1.5 text-left text-sm font-semibold text-destructive transition-colors hover:bg-hover disabled:pointer-events-none disabled:opacity-50"
              >
                Remove ({checked.size})
              </button>
            </div>
          </div>
        </div>
      </Popover>
      <p className="text-sm text-muted-foreground">
        Selected:{" "}
        {selected.length > 0
          ? selected.map((entry) => `${entry.label} ×${entry.count}`).join(", ")
          : "-"}
      </p>
    </div>
  );
}
