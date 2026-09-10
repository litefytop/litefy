"use client";

import { Combobox, type ComboboxFetcher } from "@/ui";

const fetchAsyncOptions: ComboboxFetcher = async ({ page, size, keyword }) => {
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
  return <Combobox fetcher={fetchAsyncOptions} placeholder="Search items" />;
}
