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

  return (
    <Combobox
      value={value}
      onValueChange={setValue}
      options={countries}
      placeholder="Select a country"
    />
  );
}
