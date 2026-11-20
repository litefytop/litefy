"use client";

import { type MenuConfig } from "@/ui";
import { Menu } from "@/ui/skins";

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
  return (
    <div className="flex flex-col items-center gap-3">
      <Menu items={items} />
    </div>
  );
}
