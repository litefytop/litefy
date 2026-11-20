"use client";

import * as React from "react";
import { useRemotePagination } from "@/ui";
import { Input } from "@/ui/skins";

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
    <div className="flex flex-col items-center">
      <Input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          remote.search(e.target.value);
        }}
        placeholder="Search…"
      />
      {remote.isSearching ? (
        <p>Searching…</p>
      ) : (
        <div
          onScroll={handleScroll}
        >
          <ul>
            {remote.data.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
            {remote.data.length === 0 && (
              <li>
                No data
              </li>
            )}
            {remote.loading && (
              <li>
                Loading…
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
