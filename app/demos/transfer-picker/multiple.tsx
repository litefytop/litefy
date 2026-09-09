"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Checkbox, Input, List, NumberField, useRemotePagination } from "@/ui";

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

export default function TransferPickerMultipleDemo() {
  const remote = useRemotePagination({
    fetcher: fetchAsyncOptions,
    debounceMs: 300,
    pageSize: 20,
  });
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

  const addToSelected = (value: string) => {
    setSelected((prev) => {
      if (prev.some((entry) => entry.value === value)) {
        return prev;
      }
      return [...prev, { value, label: value, count: 1 }];
    });
    setHighlightIndex(null);
  };

  const updateCount = (value: string, count: number) => {
    setSelected((prev) =>
      prev.map((entry) => (entry.value === value ? { ...entry, count } : entry)),
    );
  };

  const removeChecked = () => {
    setSelected((prev) => prev.filter((entry) => !checked.has(entry.value)));
    setChecked(new Set());
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-xl max-w-[90vw] gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setHighlightIndex(null);
              remote.search(e.target.value);
            }}
            onKeyDown={(e) => {
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
                {selectedValues.has(item) && <Check className="size-3.5 text-primary" />}
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
            Click or press Enter to move an item to the right — use the embedded number field to
            adjust its count.
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col rounded-md border">
          <div className="flex items-center gap-2 border-b px-2 py-2">
            <Checkbox
              checked={selected.length > 0 && selected.every((entry) => checked.has(entry.value))}
              disabled={selected.length === 0}
              onCheckedChange={(next) =>
                setChecked(next ? new Set(selected.map((entry) => entry.value)) : new Set())
              }
              classNames={{ label: "gap-2 text-sm font-medium cursor-pointer" }}
            >
              <span>Selected</span>
              <span className="text-xs font-normal text-muted-foreground">{totalCount}</span>
            </Checkbox>
            <button
              type="button"
              disabled={checked.size === 0}
              onClick={removeChecked}
              className="ml-auto cursor-pointer rounded-sm px-2 py-1 text-xs font-semibold text-danger transition-colors hover:bg-hover disabled:pointer-events-none disabled:opacity-50"
            >
              Remove
            </button>
          </div>
          <div className="flex max-h-56 min-h-24 flex-1 flex-col overflow-auto p-1">
            {selected.length === 0 ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">No data</p>
            ) : (
              selected.map((entry) => (
                <div
                  key={entry.value}
                  className="flex items-center gap-1 rounded-sm pr-1 hover:bg-hover"
                >
                  <Checkbox
                    checked={checked.has(entry.value)}
                    onCheckedChange={(next) => toggleChecked(entry.value, next)}
                    classNames={{
                      label: "min-w-0 flex-1 gap-2 px-3 py-2 text-sm font-normal cursor-pointer",
                    }}
                  >
                    <span className="truncate">{entry.label}</span>
                  </Checkbox>
                  <NumberField
                    positiveInteger
                    min={1}
                    max={99}
                    value={entry.count}
                    onValueChange={(value?: string | number) => updateCount(entry.value, Number(value ?? 1))}
                    className="shrink-0"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Selected:{" "}
        {selected.length > 0
          ? selected.map((entry) => `${entry.label} ×${entry.count}`).join(", ")
          : "-"}
      </p>
    </div>
  );
}
