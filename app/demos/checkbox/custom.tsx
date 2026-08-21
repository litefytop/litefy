"use client";

import { useState } from "react";
import { CheckboxIndicator } from "@/ui";
import { cn } from "@/lib";

export default function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <CheckboxIndicator
        checked={checked}
        onCheckedChange={setChecked}
      >
        {(checked) => (
          <span
            className={cn(
              "size-5 rounded border-2 flex items-center justify-center transition-colors",
              checked ? "bg-blue-500 border-blue-500" : "border-gray-300"
            )}
          >
            {checked && "✓"}
          </span>
        )}
      </CheckboxIndicator>
      <span>Hand‑crafted checkbox</span>
    </div>
  );
}
