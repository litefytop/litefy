import { useState } from "react";
import { Select } from "@/component";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

export default function SelectControlled() {
  const [value, setValue] = useState("");

  return (
    <div className="w-64 space-y-4">
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        options={options}
        placeholder="Select an option"
      />
      <div className="text-sm text-muted-foreground">Selected: {value || "none"}</div>
    </div>
  );
}
