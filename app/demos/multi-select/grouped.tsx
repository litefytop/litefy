"use client";

import { useState } from "react";
import { MultiSelect, type CheckboxOptionGroup } from "@/ui";

const groups: CheckboxOptionGroup[] = [
  {
    group: "Fruits",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
    ],
  },
  {
    group: "Vegetables",
    options: [
      { label: "Carrot", value: "carrot" },
      { label: "Potato", value: "potato" },
      { label: "Tomato", value: "tomato" },
    ],
  },
];

export default function Demo() {
  const [values, setValues] = useState<string[]>([]);

  return (
    <div className="flex flex-col items-center gap-3">
      <MultiSelect
        options={groups}
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
