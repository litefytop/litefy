"use client";

import * as React from "react";
import { FileCode, Folder, FolderOpen } from "@/components/icons";
import { type TreeNodeConfig } from "@/ui";
import { Tree } from "@/ui/skins";

const items: TreeNodeConfig[] = [
  {
    label: "src",
    value: "src",
    defaultOpen: true,
    disabled: true,
    icon: (open) => (open ? <FolderOpen /> : <Folder />),
    children: [
      { label: "Button.tsx", value: "src/button", icon: <FileCode />, disabled: true },
      { label: "legacy.tsx", value: "src/legacy", icon: <FileCode />, disabled: true },
      { label: "index.ts", value: "src/index", icon: <FileCode />, disabled: true },
    ],
  },
  { label: "package.json", value: "package", icon: <FileCode />, disabled: true },
];

export default function Demo() {
  const [current, setCurrent] = React.useState("src/button");

  return (
    <div className="flex flex-col items-center">
      <div className="p-2 w-full items-center">
        <Tree items={items} value={current} onValueChange={setCurrent} />
      </div>
    </div>
  );
}
