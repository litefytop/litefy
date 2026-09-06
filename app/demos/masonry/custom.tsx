"use client";

import * as React from "react";
import { Button, Masonry, useLoadMore } from "@/ui";

interface Photo {
  id: number;
  title: string;
  height: number;
  tone: string;
}

const tones = ["bg-primary/10", "bg-accent/15", "bg-primary/20", "bg-accent/10"];

const allPhotos: Photo[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Photo ${String(i + 1).padStart(2, "0")}`,
  height: 72 + ((i * 37) % 96),
  tone: tones[i % tones.length],
}));

export default function MasonryCustomDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { visibleCount, hasMore, loadMore, sentinelRef } = useLoadMore({
    total: allPhotos.length,
    pageSize: 8,
    root: containerRef,
    rootMargin: "120px",
  });
  const visible = allPhotos.slice(0, visibleCount);

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <div
        ref={containerRef}
        className="h-72 overflow-y-auto rounded-lg border p-2"
        data-testid="scroll-root"
      >
        <Masonry
          items={visible}
          columns={2}
          gap={8}
          getKey={(photo) => photo.id}
          renderItem={(photo) => (
            <div
              className={`flex items-end rounded-md border p-2 ${photo.tone}`}
              style={{ height: photo.height }}
            >
              <span className="text-xs font-medium">{photo.title}</span>
            </div>
          )}
        />
        {hasMore && <div ref={sentinelRef} aria-hidden className="h-px" />}
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {visibleCount} of {allPhotos.length} loaded
        </p>
        {hasMore && (
          <Button variant="outline" onClick={loadMore}>
            Load more
          </Button>
        )}
      </div>
    </div>
  );
}
