"use client";

import { Select } from "@/ui/skins";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
];

export default function Demo() {
  return (
    <Select
      data-variant="cell"
      label="Framework"
      placeholder="Pick one"
      defaultValue="react"
      options={options}
    />
  );
}
