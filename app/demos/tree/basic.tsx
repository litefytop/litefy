"use client";

import * as React from "react";
import { FileCode, Folder, FolderOpen, Hash } from "@/components/icons";
import { type TreeNodeConfig } from "@/ui";
import { Tree } from "@/ui/skins";

const items: TreeNodeConfig[] = [
  { type: "separator", label: "Sources" },
  {
    label: "src",
    value: "src",
    defaultOpen: true,
    icon: (open) => (open ? <FolderOpen /> : <Folder />),
    children: [
      {
        label: "components",
        value: "src/components",
        defaultOpen: true,
        icon: (open) => (open ? <FolderOpen /> : <Folder />),
        children: [
          { label: "Button.tsx", value: "src/components/button", icon: <FileCode />, href: "#src/components/button" },
          { label: "Input.tsx", value: "src/components/input", icon: <FileCode />, href: "#src/components/input" },
          { label: "Select.tsx", value: "src/components/select", icon: <FileCode />, href: "#src/components/select" },
        ],
      },
      {
        label: "hooks",
        value: "src/hooks",
        defaultOpen: true,
        icon: (open) => (open ? <FolderOpen /> : <Folder />),
        children: [{ label: "use-theme.ts", value: "src/hooks/use-theme", icon: <FileCode />, href: "#src/hooks/use-theme" }],
      },
      { label: "index.ts", value: "src/index", icon: <FileCode /> },
    ],
  },
  { type: "separator", label: "Assets" },
  {
    label: "public",
    value: "public",
    icon: (open) => (open ? <FolderOpen /> : <Folder />),
    children: [{ label: "favicon.svg", value: "public/favicon", icon: <Hash />, href: "#public/favicon" }],
  },
  { label: "package.json", value: "package", icon: <Hash />, href: "#package" },
];

export default function TreeBasicDemo() {
  const [current, setCurrent] = React.useState("src/components/button");
  return (
    <div className="p-2 w-full items-center">
      <Tree
        items={items}
        value={current}
        onValueChange={setCurrent}
        navigate={(href) => setCurrent(href.replace(/^#/u, ""))}
      />
    </div>
  );
}
