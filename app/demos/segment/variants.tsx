"use client";

import { SegmentGroup } from "@/ui";

const options = [
  { label: "List", value: "list" },
  { label: "Grid", value: "grid" },
  { label: "Table", value: "table" },
];

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <SegmentGroup variant="text" defaultValue="grid" options={options} />
      <p className="text-xs text-muted-foreground">text</p>
    </div>
  );
}
