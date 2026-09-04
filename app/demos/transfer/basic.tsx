"use client";

import * as React from "react";
import { Transfer, type TransferItemConfig } from "@/ui";

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
    <div className="w-full space-y-3">
      <Transfer
        dataSource={dataSource}
        value={value}
        onChange={setValue}
        titles={["Available", "Selected"]}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {value.length === 0 ? "-" : value.join(", ")}
      </p>
    </div>
  );
}
