import { useState } from "react";
import { Select } from "@/component";

const options = [
  {
    group: "Group A",
    options: [
      { label: "Option A1", value: "a1" },
      { label: "Option A2", value: "a2" },
    ],
  },
  {
    group: "Group B",
    options: [
      { label: "Option B1", value: "b1" },
      { label: "Option B2", value: "b2" },
    ],
  },
  {
    group: "Group C",
    options: [
      { label: "Option C1", value: "c1" },
      { label: "Option C2", value: "c2" },
    ],
  },
];

export default function SelectMultiple() {
  const [value, setValue] = useState<string[]>([]);

  return (
    <div className="w-64 space-y-4">
      <Select
        options={options}
        multiple
        value={value}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, (option) => option.value);
          setValue(selected);
        }}
      />
      <div className="text-sm text-muted-foreground">
        Selected: {value.length > 0 ? value.join(", ") : "none"}
      </div>
    </div>
  );
}
