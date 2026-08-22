"use client";

import { useState } from "react";
import { Combobox, useRemotePagination } from "@/ui";

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
  const allItems = Array.from(
    { length: totalItems },
    (_, i) => `Item ${i + 1}`,
  );
  const filtered = keyword
    ? allItems.filter((item) =>
        item.toLowerCase().includes(keyword.toLowerCase()),
      )
    : allItems;
  const start = (page - 1) * size;
  const paged = filtered.slice(start, start + size);

  return { list: paged, total: totalItems };
};

export default function Demo() {
  const remote = useRemotePagination({
    fetcher: fetchAsyncOptions,
    debounceMs: 300,
    pageSize: 20,
  });

  const [selected, setSelected] = useState("");

  return (
 
      <Combobox
        remote={remote}
        value={selected}
        onSelect={(v) => setSelected(v)}
        placeholder="Search items..."
      />
    
  );
}
