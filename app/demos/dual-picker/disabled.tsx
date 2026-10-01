"use client";

import { DualPicker } from "@/ui";

const options = [
  { value: "react", option: "React" },
  { value: "vue", option: "Vue" },
  { value: "angular", option: "Angular" },
  { value: "svelte", option: "Svelte" },
];

export default function DualPickerDisabledDemo() {
  return (
    <DualPicker
      className="w-full max-w-xl"
      options={options}
      defaultValue={["react"]}
      disabled
    />
  );
}
