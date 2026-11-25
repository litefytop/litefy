"use client";

import { usePagination } from "@/ui";
import { Pagination } from "@/ui/skins";

const TOTAL_PAGES = 12;
const TOTAL_ITEMS = 1286;
const SELECTED = 3;

export default function Demo() {
  const pagination = usePagination({ base: 1, total: TOTAL_PAGES });
  const pageSize = 10;

  return (
    <Pagination
      page={pagination.index}
      totalPages={TOTAL_PAGES}
      onPageChange={pagination.goTo}
      summary={`Showing ${(pagination.index - 1) * pageSize + 1}–${Math.min(
        pagination.index * pageSize,
        TOTAL_ITEMS,
      )} of ${TOTAL_ITEMS.toLocaleString()} items · ${SELECTED} selected`}
    />
  );
}
