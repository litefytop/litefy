"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button, Checkbox, Input, List, Popover, useRemotePagination } from "@/ui";

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
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    remote.search("");
  }, []);

  const selectedValues = new Set(selected);

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

  const toggleSelected = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        setChecked((prevChecked) => {
          if (!prevChecked.has(value)) return prevChecked;
          const nextChecked = new Set(prevChecked);
          nextChecked.delete(value);
          return nextChecked;
        });
        return prev.filter((v) => v !== value);
      }
      return [...prev, value];
    });
    setHighlightIndex(null);
  };

  const removeChecked = () => {
    setSelected((prev) => prev.filter((value) => !checked.has(value)));
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
        classNames={{
          trigger: [Button.className.base, Button.className.variant.primary],
          content: "w-xl max-w-[90vw]",
        }}
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
                  toggleSelected(remote.data[highlightIndex]);
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
              onSelect={(item) => toggleSelected(item)}
              onScrollBottom={() => {
                if (remote.hasMore && !remote.loading) remote.loadMore();
              }}
              className="max-h-56 rounded-md border"
            />
            <p className="px-1 text-xs text-muted-foreground">
              Click or press Enter to toggle an item — selected items are marked with a check.
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col rounded-md border">
            <div className="flex items-center gap-2 border-b px-2 py-2">
              <Checkbox
                checked={selected.length > 0 && selected.every((value) => checked.has(value))}
                disabled={selected.length === 0}
                onCheckedChange={(next) => setChecked(next ? new Set(selected) : new Set())}
                classNames={{ label: "gap-2 text-sm font-medium cursor-pointer" }}
              >
                <span>Selected</span>
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
                selected.map((value) => (
                  <Checkbox
                    key={value}
                    checked={checked.has(value)}
                    onCheckedChange={(next) => toggleChecked(value, next)}
                    classNames={{
                      label:
                        "w-full gap-2 rounded-sm px-3 py-2 text-sm font-normal cursor-pointer hover:bg-hover",
                    }}
                  >
                    <span className="truncate">{value}</span>
                  </Checkbox>
                ))
              )}
            </div>
            <div className="flex gap-2 border-t p-2">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Stash
              </Button>
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Popover>
      <p className="text-sm text-muted-foreground">
        Selected: {selected.length > 0 ? selected.join(", ") : "-"}
      </p>
    </div>
  );
}
