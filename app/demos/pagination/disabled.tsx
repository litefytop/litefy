"use client";

import { Pagination, usePagination } from "@/ui";

const TOTAL_PAGES = 24;

export default function Demo() {
  const pagination = usePagination({ base: 1, total: TOTAL_PAGES });

  return (
    <div className="flex w-full max-w-xl flex-col">
      <Pagination
        disabled
        page={pagination.index}
        totalPages={TOTAL_PAGES}
        onPageChange={pagination.goTo}
        summary={`Page ${pagination.index} of ${TOTAL_PAGES} (loading)`}
      />
    </div>
  );
}
