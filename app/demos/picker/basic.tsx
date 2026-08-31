"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Picker } from "@/ui";

export default function Demo() {
  const [value, setValue] = useState("");

  return (
    <Picker
      value={value}
      onValueChange={setValue}
      placeholder="Click to open"
      trailing={<ChevronDown />}
    >
      <div className="w-64 p-3 text-sm text-muted-foreground">
        Any content can be rendered inside the popover panel.
      </div>
    </Picker>
  );
}
