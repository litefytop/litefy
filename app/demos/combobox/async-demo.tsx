"use client";

import { Combobox } from "@/components/ui/combobox";

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

export default function ComboboxAsyncDemo() {
  return (
    <div className="w-72">
      <Combobox
        options={fetchAsyncOptions}
        placeholder="Search items..."
        pageSize={10}
      />
    </div>
  );
}
