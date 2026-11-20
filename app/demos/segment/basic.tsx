"use client";

import { useState } from "react";
import { SegmentGroup } from "@/ui/skins";

export default function Demo() {
  const [value, setValue] = useState("list");
  return (
    <div className="flex flex-col items-center gap-3">
      <SegmentGroup
        value={value}
        onValueChange={setValue}
        options={[
          { label: "List", value: "list" },
          { label: "Grid", value: "grid" },
          { label: "Table", value: "table" },
        ]}
      />
    </div>
  );
}
