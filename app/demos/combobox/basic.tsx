"use client";

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
  return (
      <Combobox options={countries} placeholder="Select a country" />
  );
}
