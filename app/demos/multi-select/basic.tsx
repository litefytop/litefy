"use client";

import { MultiSelect, type MultiSelectOption } from "@/ui/skins";

const options: MultiSelectOption[] = [
  { label: "Apple", value: "apple", group: "Fruits" },
  { label: "Banana", value: "banana", group: "Fruits" },
  { label: "Cherry", value: "cherry", group: "Fruits" },
  { label: "Carrot", value: "carrot", group: "Vegetables" },
  { label: "Potato", value: "potato", group: "Vegetables" },
  { label: "Tomato", value: "tomato", group: "Vegetables" },
];

export default function MultiSelectBasicDemo() {
  return (
    <MultiSelect
      options={options}
      placeholder="Categories"
    />
  );
}
