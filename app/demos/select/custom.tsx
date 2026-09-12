"use client";

import { useState } from "react";
import { Select } from "@/ui";

const options = [
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Blue", value: "blue" },
];

export default function Demo() {
  const [, setValue] = useState("");

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Select options={options} placeholder="Pick a color..." onValueChange={setValue} />
      <p className="text-sm text-muted-foreground">
        The panel is plain DOM — it follows theme colors, unlike a native select dropdown.
      </p>
    </div>
  );
}
