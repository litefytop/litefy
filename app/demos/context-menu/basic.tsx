"use client";

import { useContextMenuTrigger, ContextMenuHost, type MenuConfig } from "@/ui/skins";
import { Card } from "@/ui/skins";

const items: MenuConfig[] = [
  {
    group: "Canvas",
    items: [{ label: "Copy" }, { label: "Paste" }, { label: "Duplicate" }],
  },
  {
    group: "View",
    items: [{ label: "Zoom In" }, { label: "Zoom Out" }, { label: "Reset View" }],
  },
];

export default function ContextMenuBasicDemo() {
  const trigger = useContextMenuTrigger({ items });
  return (
    <div className="flex h-full w-full flex-col">
      <ContextMenuHost />
      <Card
        {...trigger}
        className="flex flex-col items-center justify-center text-foreground"
        style={{ ...trigger.style, height: "75%" }}
      >
        Right-click or long-press anywhere in this area
      </Card>
    </div>
  );
}
