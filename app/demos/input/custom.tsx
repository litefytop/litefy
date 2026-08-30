"use client";

import { useState } from "react";
import { Search, TriangleAlert } from "lucide-react";
import { InputGroup, InputLeading, InputTrailing } from "@/ui";

export default function Demo() {
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && !value.includes("@");

  return (
    <InputGroup data-invalid={invalid || undefined}>
      <InputLeading>
        <Search />
      </InputLeading>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search mail..."
        aria-invalid={invalid}
        className="min-w-0 flex-1 border-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground ring-0"
      />
      <InputTrailing>
        {invalid ? (
          <TriangleAlert className="text-destructive" />
        ) : (
          <kbd className="font-mono text-xs">⌘+K</kbd>
        )}
      </InputTrailing>
    </InputGroup>
  );
}
