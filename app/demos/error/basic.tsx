"use client";

import { useState } from "react";
import { Error, Select } from "@/ui";

const options = [
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Canada", value: "ca" },
];

export default function ErrorBasicDemo() {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <div className="w-80 max-w-full space-y-2">
      <Select
        options={options}
        placeholder="Select your country..."
        value={value}
        onValueChange={setValue}
      />
      {!value && <Error>Please select your country.</Error>}
    </div>
  );
}
