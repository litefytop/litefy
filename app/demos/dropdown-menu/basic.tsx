"use client";

import { DropdownMenu, type MenuConfig } from "@/ui/skins";

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
      <DropdownMenu trigger="Open Menu" items={items} />
    </div>
  );
}
