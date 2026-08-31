"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePagination } from "@/ui";

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
      <div className="text-sm text-gray-600">
        {startRecord} - {endRecord} / 共 {Math.ceil(totalRecords / pageSize)} 页
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(0)}
          disabled={isFirst}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="size-4" />
        </button>

        <button
          type="button"
          onClick={previous}
          disabled={isFirst}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="size-4" />
        </button>

        <select
          value={currentPage}
          onChange={(e) => goTo(Number(e.target.value) - 1)}
          className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {pageOptions.map((page) => (
            <option key={page} value={page}>
              第 {page} 页
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={next}
          disabled={isEnd}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => goTo(totalPages - 1)}
          disabled={isEnd}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
