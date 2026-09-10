"use client";

import { useState } from "react";
import { MultiSelect, type CheckboxOptionConfig } from "@/ui";

const options: CheckboxOptionConfig[] = [
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Books", value: "books" },
  { label: "Sports", value: "sports" },
];

export default function Demo() {
  const [values, setValues] = useState<string[]>([]);

  return (
    <div className="flex flex-col items-center gap-3">
      <MultiSelect
        options={options}
        value={values}
        onChange={setValues}
        placeholder="Categories"
        className="w-56"
        classNames={{ content: "w-56" }}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {values.length > 0 ? values.join(", ") : "-"}
      </p>
    </div>
  );
}
