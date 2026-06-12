"use client";

import { useState } from "react";
import { Combobox } from "@/components/ui/combobox";

const tags = ["React", "TypeScript", "JavaScript", "Vue", "Angular", "Svelte"];

export default function ComboboxControlledDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="w-72">
      <Combobox 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        options={tags} 
        placeholder="Select a tag"
        clearable={true}
      />
      {value && (
        <div className="mt-2 text-sm text-muted-foreground">
          Selected: <span className="font-medium">{value}</span>
        </div>
      )}
    </div>
  );
}