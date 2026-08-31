"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { List, Picker, useRemotePagination } from "@/ui";

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

export default function Demo() {
  const remote = useRemotePagination({
    fetcher: fetchAsyncOptions,
    debounceMs: 300,
    pageSize: 20,
  });
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  useEffect(() => {
    remote.search("");
  }, []);

  const handleSelect = (item: string) => {
    setText(item);
    setHighlightIndex(null);
    setOpen(false);
  };

  return (
    <Picker
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setHighlightIndex(null);
      }}
      value={text}
      onValueChange={(text) => {
        setText(text);
        setHighlightIndex(null);
        remote.search(text);
      }}
      placeholder="Search items"
      trailing={<ChevronDown />}
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
          handleSelect(remote.data[highlightIndex]);
        }
      }}
    >
      <List
        highlightIndex={highlightIndex}
        onHighlightChange={setHighlightIndex}
        items={remote.data}
        renderItem={(item) => item}
        getKey={(item, index) => `${item}-${index}`}
        empty={
          <div className="pointer-events-none px-3 py-2 text-sm text-muted-foreground">
            {remote.loading ? "Loading..." : "No data"}
          </div>
        }
        onSelect={handleSelect}
        onScrollBottom={() => {
          if (remote.hasMore && !remote.loading) remote.loadMore();
        }}
        className="max-h-64"
      />
    </Picker>
  );
}
