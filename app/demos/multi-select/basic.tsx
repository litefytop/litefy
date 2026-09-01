"use client";

import { useState } from "react";
import { Button, CheckboxGroup, Popover, type CheckboxOptionConfig } from "@/ui";

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
      <Popover
        trigger={`Categories (${values.length})`}
        classNames={{
          trigger: [Button.class.base, Button.class.variant.primary, "w-56"],
          content: "w-56",
        }}
      >
        <CheckboxGroup options={options} value={values} onChange={setValues} />
      </Popover>
      <p className="text-sm text-muted-foreground">
        Selected: {values.length > 0 ? values.join(", ") : "-"}
      </p>
    </div>
  );
}
