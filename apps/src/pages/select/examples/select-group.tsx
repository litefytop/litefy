import { useState } from "react";
import { Select } from "@/component";

const groupedOptions = [
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

export default function SelectGroup() {
  const [value, setValue] = useState("");

  return (
    <div className="w-64 space-y-4">
      <Select
        options={groupedOptions}
        placeholder="Select from group"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="text-sm text-muted-foreground">Selected: {value || "none"}</div>
    </div>
  );
}
