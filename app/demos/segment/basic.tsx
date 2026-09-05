"use client";

import { useState } from "react";
import { SegmentGroup } from "@/ui";

export default function Demo() {
  const [value, setValue] = useState("list");
  return (
    <div className="flex flex-col gap-3">
      <SegmentGroup
        value={value}
        onValueChange={setValue}
        options={[
          { label: "List", value: "list" },
          { label: "Grid", value: "grid" },
          { label: "Table", value: "table" },
        ]}
      />
      <p className="text-sm text-muted-foreground">Selected: {value}</p>
    </div>
  );
}
