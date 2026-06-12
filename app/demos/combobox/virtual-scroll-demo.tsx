"use client";

import { Combobox } from "@/components/ui/combobox";

type PaginationParams = {
  page: number;
  size: number;
  keyword: string;
};

const totalItems = 10000;

const fetchLargeDataset = async ({
  page,
  size,
  keyword,
}: PaginationParams): Promise<{ list: string[]; hasMore: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  let items: string[] = [];

  if (page === 1) {
    items = Array.from({ length: size }, (_, i) => `Item ${i + 1}`);
  } else {
    const start = (page - 1) * size;
    items = Array.from({ length: size }, (_, i) => `Item ${start + i + 1}`);
  }

  if (keyword) {
    items = items.filter((item) =>
      item.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  const hasMore = page * size < totalItems;

  return { list: items, hasMore };
};

export default function ComboboxVirtualScrollDemo() {
  return (
    <div className="w-72">
      <Combobox
        options={fetchLargeDataset}
        placeholder="Search 10,000 items..."
        pageSize={100}
      />
    </div>
  );
}