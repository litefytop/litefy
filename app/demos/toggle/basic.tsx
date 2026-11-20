"use client";

import * as React from "react";
import { Toggle, ToggleGroup } from "@/ui/skins";
import { Bold, Italic } from "@/components/icons";

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
  { label: "Solid", value: "solid" },
];

export default function Demo() {
  const [italic, setItalic] = React.useState(true);
  const [group, setGroup] = React.useState<string[]>(["react"]);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap gap-3">
        <Toggle defaultChecked disabled>
          <Bold />
          Bold
        </Toggle>
        <Toggle checked={italic} onCheckedChange={setItalic}>
          <Italic />
          Italic
        </Toggle>
      </div>
      <ToggleGroup value={group} onChange={setGroup} options={options} />
    </div>
  );
}
