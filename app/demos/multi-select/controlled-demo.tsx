import { useState } from "react";
import { MultiSelect } from "@/ui";

const options = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "python" },
  { label: "Rust", value: "rust" },
];

export default function MultiSelectControlledDemo() {
  const [selected, setSelected] = useState<string[]>(["js"]);

  return (
    <div className="space-y-4">
      <MultiSelect
        options={options}
        value={selected}
        onValueChange={setSelected}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {selected.join(", ") || "none"}
      </p>
    </div>
  );
}
