"use client";

import { useState } from "react";
import { SelectGroup, SelectIcon, SelectRoot } from "@/ui";

export default function Demo() {
  const [value, setValue] = useState("");
  return (
    <SelectGroup className="max-w-xs">
      <SelectRoot
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded-full bg-muted"
      >
        <option value="" disabled hidden>
          Pick a color...
        </option>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
      </SelectRoot>
      <SelectIcon className="right-3 text-primary" />
    </SelectGroup>
  );
}
