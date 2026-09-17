"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button, usePagination } from "@/ui";

export default function PaginationDemo() {
  const totalRecords = 128;
  const pageSize = 10;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const { index, goTo, next, previous, isFirst, isEnd } = usePagination({
    base: 0,
    total: totalPages,
    loop: false,
  });

  const currentPage = index + 1;
  const startRecord = index * pageSize + 1;
  const endRecord = Math.min((index + 1) * pageSize, totalRecords);
  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 border rounded-md w-full">
      <div className="text-sm text-muted-foreground">
        {startRecord} - {endRecord} of {Math.ceil(totalRecords / pageSize)} pages
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => goTo(0)}
          disabled={isFirst}
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </Button>

        <Button variant="outline" onClick={previous} disabled={isFirst} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Button>

        <select
          value={currentPage}
          onChange={(e) => goTo(Number(e.target.value) - 1)}
          className="px-2 py-1 text-sm border rounded"
        >
          {pageOptions.map((page) => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>

        <Button variant="outline" onClick={next} disabled={isEnd} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Button>

        <Button
          variant="outline"
          onClick={() => goTo(totalPages - 1)}
          disabled={isEnd}
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
