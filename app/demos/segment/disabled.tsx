"use client";

import { useState } from "react";
import { SegmentGroup } from "@/ui";

export default function SegmentDisabledDemo() {
  const [value, setValue] = useState("list");

  return (
    <div className="flex flex-col gap-3">
      <SegmentGroup
        value={value}
        onValueChange={setValue}
        options={[
          { label: "List", value: "list" },
          { label: "Grid", value: "grid" },
          { label: "Table", value: "table", disabled: true },
        ]}
      />
      <SegmentGroup
        disabled
        defaultValue="table"
        options={[
          { label: "List", value: "list" },
          { label: "Grid", value: "grid" },
          { label: "Table", value: "table" },
        ]}
      />
    </div>
  );
}
