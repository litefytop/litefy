import { useState } from "react";
import { Select } from "@/component";

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
  { label: "Option 4", value: "4" },
  { label: "Option 5", value: "5" },
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
