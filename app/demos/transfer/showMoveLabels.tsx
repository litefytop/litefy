"use client";

import * as React from "react";
import { type TransferItemConfig } from "@/ui";
import { Transfer } from "@/ui/skins";

const dataSource: TransferItemConfig[] = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Rust", value: "rust" },
  { label: "Go", value: "go" },
];

export default function Demo() {
  const [value, setValue] = React.useState<string[]>(["ts"]);

  return (
    <Transfer
      dataSource={dataSource}
      value={value}
      onChange={setValue}
      titles={["Available", "Selected"]}
      showMoveLabels
    />
  );
}