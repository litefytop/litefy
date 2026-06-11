---
title: Paginated Viewer
description: A paginated content viewer component
---

# Paginated Viewer

A paginated content viewer component.

## Usage

### Basic Usage

```tsx
<PaginatedViewer activeIndex={0}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</PaginatedViewer>
```

### With Pagination Controls

```tsx
import { useState } from "react";
import { PaginatedViewer, Pagination, usePagination, Button } from "@/component";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PaginationControls() {
  const { current, totalPages, goPrev, goNext } = usePagination();
  
  return (
    <div className="flex items-center gap-1">
      <Pagination.Controls variant="prev" aria-label="Previous page">
        <ChevronLeft className="size-4" />
      </Pagination.Controls>
      <Pagination.Jumper format={(page) => `Page ${page}`} />
      <Pagination.Controls variant="next" aria-label="Next page">
        <ChevronRight className="size-4" />
      </Pagination.Controls>
    </div>
  );
}

export default function Example() {
  const [current, setCurrent] = useState(1);
  
  return (
    <Pagination
      current={current}
      pageSize={1}
      total={100}
      onPageChange={setCurrent}
    >
      <Pagination.Description />
      <PaginationControls />
    </Pagination>
  );
}
```

## API Reference

### PaginatedViewer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| activeIndex | number | - | Current active slide index (0-based) |
| className | ClassNameValue | - | Custom className |
| slotProps | PaginatedViewerSlotProps | - | Internal element props pass-through |

### slotProps Config

| Prop | Type | Description |
|------|------|-------------|
| slide | React.ComponentProps<"div"> | Slide container `<div>` props |
