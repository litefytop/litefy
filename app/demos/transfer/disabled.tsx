"use client";

import * as React from "react";
import { type TransferItemConfig } from "@/ui";
import { Transfer } from "@/ui/skins";

const dataSource: TransferItemConfig[] = [
  { label: "JavaScript", value: "js", disabled: true },
  { label: "TypeScript", value: "ts", disabled: true },
  { label: "Rust", value: "rust", disabled: true },
  { label: "Go", value: "go", disabled: true },
  { label: "Python", value: "python", disabled: true },
];

export default function Demo() {
  const [value, setValue] = React.useState<string[]>(["ts"]);

  return (
    <div inert className="flex flex-col items-center gap-3">
      <Transfer
        dataSource={dataSource}
        value={value}
        onChange={setValue}
        titles={["Available", "Selected"]}
      />
    </div>
  );
}
