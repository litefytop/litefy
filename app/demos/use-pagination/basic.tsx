"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "@/components/icons";
import { usePagination } from "@/ui";
import { Button, Select } from "@/ui/skins";

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
    <div className="flex flex-col gap-3 items-center">
      <div className="flex flex-wrap gap-3">
        {startRecord} - {endRecord} of {Math.ceil(totalRecords / pageSize)} pages
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          data-variant="outline"
          onClick={() => goTo(0)}
          disabled={isFirst}
          aria-label="First page"
        >
          <ChevronsLeft />
        </Button>

        <Button data-variant="outline" onClick={previous} disabled={isFirst} aria-label="Previous page">
          <ChevronLeft />
        </Button>

        <Select
          options={pageOptions.map((page) => ({
            label: `Page ${page}`,
            value: String(page),
          }))}
          value={String(currentPage)}
          onValueChange={(v) => goTo(Number(v) - 1)}
        />

        <Button data-variant="outline" onClick={next} disabled={isEnd} aria-label="Next page">
          <ChevronRight />
        </Button>

        <Button
          data-variant="outline"
          onClick={() => goTo(totalPages - 1)}
          disabled={isEnd}
          aria-label="Last page"
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
