"use client";

import { useState } from "react";
import { Toggle } from "@/ui";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Solid", value: "solid", disabled: true },
];

export default function Demo() {
  const [value, setValue] = useState(["react"]);
  return (
    <div className="flex flex-col gap-3">
      <Toggle.Group value={value} onChange={setValue} options={options} />
      <p className="text-sm text-muted-foreground">
        Selected: {value.join(", ") || "-"}
      </p>
    </div>
  );
}
