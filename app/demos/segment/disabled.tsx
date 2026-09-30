"use client";

import { SegmentGroup } from "@/ui";

export default function SegmentDisabledDemo() {
  return (
    <SegmentGroup
      disabled
      defaultValue="table"
      options={[
        { label: "List", value: "list" },
        { label: "Grid", value: "grid" },
        { label: "Table", value: "table" },
      ]}
    />
  );
}
