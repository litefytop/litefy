"use client";

import * as React from "react";
import { useRemotePagination } from "@/ui";

const fetcher = ({ page, size, keyword }: { page: number; size: number; keyword: string }) =>
  new Promise<{ list: string[]; total: number }>((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * size + 1;
      const list = Array.from(
        { length: Math.min(size, 40 - start + 1) },
        (_, i) => `${keyword || "item"} #${start + i}`,
      );
      resolve({ list, total: 40 });
    }, 600);
  });

export default function UseRemotePaginationBasicDemo() {
  const [keyword, setKeyword] = React.useState("");
  const remote = useRemotePagination({ fetcher });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!remote.hasMore || remote.loading) return;
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) {
      remote.loadMore();
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-3 py-4">
      <input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          remote.search(e.target.value);
        }}
        placeholder="Search…"
        className="h-9 rounded-md border px-3 text-sm outline-none focus:border-primary"
      />
      {remote.isSearching ? (
        <p className="py-4 text-center text-sm text-muted-foreground">Searching…</p>
      ) : (
        <div
          onScroll={handleScroll}
          className="h-64 overflow-y-auto rounded-md border"
        >
          <ul className="flex flex-col divide-y">
            {remote.data.map((item) => (
              <li key={item} className="px-3 py-2 text-sm">
                {item}
              </li>
            ))}
            {remote.data.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                No data
              </li>
            )}
            {remote.loading && (
              <li className="px-3 py-2 text-center text-sm text-muted-foreground">
                Loading…
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
