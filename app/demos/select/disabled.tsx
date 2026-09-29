"use client";

import { Select } from "@/ui";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
];

export default function SelectDisabledDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Select options={options} placeholder="Select a framework..." disabled />
      <Select options={options} defaultValue="react" disabled />
    </div>
  );
}
