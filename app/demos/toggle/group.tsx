"use client";

import * as React from "react";
import { ToggleGroup } from "@/ui/skins";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Solid", value: "solid" },
];

export default function Demo() {
  const [group, setGroup] = React.useState<string[]>(["react"]);

  return <ToggleGroup value={group} onChange={setGroup} options={options} />;
}
