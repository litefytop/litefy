"use client";

import { Combobox } from "@/components/ui/combobox";

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

export default function ComboboxBasicDemo() {
  return (
    <div className="w-72">
      <Combobox 
        options={countries} 
        placeholder="Select a country"
      />
    </div>
  );
}