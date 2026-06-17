"use client";

import * as React from "react";
import { PaginatedViewer } from "@/ui";

interface BookPage {
  id: string;
  title: string;
  content: string;
  pageNum: number;
}

export default function PaginatedViewerWithJumpDemo() {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [jumpInput, setJumpInput] = React.useState("");

  const pages: BookPage[] = Array.from({ length: 100 }, (_, i) => ({
    id: `page-${i + 1}`,
    title: `Page ${i + 1}`,
    content: `This is the content of page ${i + 1}. In a real document, this would contain actual text, images, or other content. The PaginatedViewer component allows you to navigate through this content one page at a time, providing a reading experience similar to a physical book or document viewer.`,
    pageNum: i + 1,
  }));

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
    }
  };

  const handleJump = () => {
    const pageNum = parseInt(jumpInput, 10);
    if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= pages.length) {
      goToPage(pageNum - 1);
      setJumpInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJump();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PaginatedViewer activeIndex={currentPage}>
        {pages.map((page) => (
          <div key={page.id} className="bg-card p-8 rounded-lg border min-h-75">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{page.title}</h3>
              <span className="text-sm text-muted-foreground">
                p. {page.pageNum}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-base">
              {page.content}
            </p>
          </div>
        ))}
      </PaginatedViewer>

      <div className="flex items-center gap-2 justify-center">
        <span className="text-sm text-muted-foreground">Jump to page:</span>
        <input
          type="text"
          value={jumpInput}
          onChange={(e) => setJumpInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`1-${pages.length}`}
          className="w-24 px-2 py-1 border rounded text-sm text-center"
        />
        <button
          type="button"
          onClick={handleJump}
          className="px-3 py-1 rounded bg-muted hover:bg-muted/80 text-sm"
        >
          Go
        </button>
      </div>
      <p className="text-sm text-center text-muted-foreground">
        Page {currentPage + 1} of {pages.length}
      </p>
    </div>
  );
}
