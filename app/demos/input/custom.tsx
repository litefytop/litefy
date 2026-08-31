"use client";

import { useState } from "react";
import { Search, TriangleAlert } from "lucide-react";
import { InputGroup, InputLeading, InputRoot, InputTrailing } from "@/ui";

export default function Demo() {
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && !value.includes("@");

  return (
    <InputGroup data-invalid={invalid || undefined}>
      <InputLeading>
        <Search />
      </InputLeading>
      <InputRoot
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search mail..."
        aria-invalid={invalid}
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
