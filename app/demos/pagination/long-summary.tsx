"use client";

import * as React from "react";
import { Pagination, usePagination } from "@/ui";

const TOTAL_PAGES = 12;
const TOTAL_ITEMS = 1286;
const SELECTED = 3;

export default function PaginationLongSummaryDemo() {
  const pagination = usePagination({ base: 1, total: TOTAL_PAGES });
  const pageSize = 10;

  return (
    <div className="w-full max-w-md">
      <Pagination
        page={pagination.index}
        totalPages={TOTAL_PAGES}
        onPageChange={pagination.goTo}
        summary={`Showing ${(pagination.index - 1) * pageSize + 1}–${Math.min(
          pagination.index * pageSize,
          TOTAL_ITEMS,
        )} of ${TOTAL_ITEMS.toLocaleString()} items · ${SELECTED} selected`}
      />
    </div>
  );
}
