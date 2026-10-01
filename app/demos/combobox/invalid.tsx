"use client";

import { useState } from "react";
import { Combobox } from "@/ui";

const countries = [
  "China",
  "United States",
  "Japan",
  "Germany",
  "France",
  "United Kingdom",
  "Canada",
  "Australia",
  "Italy",
  "Brazil",
];

export default function Demo() {
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && !countries.includes(value);

  return (
    <div className="flex flex-col gap-4 w-72">
      <Combobox
        options={countries}
        placeholder="Choose a country"
        value={value}
        onValueChange={setValue}
        invalid={invalid}
      />
      {invalid && (
        <span className="text-danger text-sm">
          Pick a country from the list — free text is not allowed
        </span>
      )}
    </div>
  );
}
