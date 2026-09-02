"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button, Popover, Menu, type MenuConfig } from "@/ui";

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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ReactNode | null>(null);
  const popoverRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <Popover
        ref={popoverRef}
        open={open}
        onOpenChange={setOpen}
        trigger="Open Menu"
        classNames={{ trigger: [Button.className.base, Button.className.variant.primary] }}
      >
        <Menu
          autoFocus={open}
          items={items}
          onSelect={(item) => {
            setSelected(item.label);
            setOpen(false);
            popoverRef.current?.focus();
          }}
        />
      </Popover>
      <p className="text-sm text-muted-foreground">Selected: {selected ?? "-"}</p>
    </div>
  );
}
