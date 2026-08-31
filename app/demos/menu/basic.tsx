"use client";

import { useState, type ReactNode } from "react";
import { Menu, type MenuConfig } from "@/ui";

const items: MenuConfig[] = [
  {
    group: "Account",
    items: [
      { label: "Profile" },
      { label: "Preferences", children: [{ label: "Theme" }, { label: "Language" }] },
    ],
  },
  {
    group: "System",
    items: [{ label: "Notifications" }, { label: "Settings" }, { label: "Logout" }],
  },
];

export default function Demo() {
  const [selected, setSelected] = useState<ReactNode | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <Menu
        items={items}
        className="w-48 rounded-md border bg-popover p-1 shadow-md"
        onSelect={(item) => setSelected(item.label)}
      />
      <p className="text-sm text-muted-foreground">Selected: {selected ?? "-"}</p>
    </div>
  );
}
