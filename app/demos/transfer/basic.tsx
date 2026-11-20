"use client";

import * as React from "react";
import { type TransferItemConfig } from "@/ui";
import { Transfer } from "@/ui/skins";

const dataSource: TransferItemConfig[] = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
  { label: "Python", value: "python", disabled: true },
  { label: "Java", value: "java" },
];

export default function TransferBasicDemo() {
  const [value, setValue] = React.useState<string[]>(["ts", "go"]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Transfer
        dataSource={dataSource}
        value={value}
        onChange={setValue}
        titles={["Available", "Selected"]}
      />
    </div>
  );
}
