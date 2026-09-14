"use client";

import * as React from "react";
import { Pagination, usePagination } from "@/ui";

const TOTAL_PAGES = 24;

export default function Demo() {
  const pagination = usePagination({ base: 1, total: TOTAL_PAGES });

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        Page {pagination.index} of {TOTAL_PAGES}
      </p>
      <Pagination
        page={pagination.index}
        totalPages={TOTAL_PAGES}
        onPageChange={pagination.goTo}
      />
    </div>
  );
}
