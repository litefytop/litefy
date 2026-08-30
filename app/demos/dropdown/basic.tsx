"use client";
import { Dropdown } from "@/ui";
import { Button } from "@/ui";

export default function DropdownBasicDemo() {
  return (
    <Dropdown
      classNames={{ trigger: [Button.class.base, Button.class.variant.primary] }}
      items={[
        {
          group: "Account",
          items: [
            { label: "Profile" },
            {
              label: "Preferences",
              children: [{ label: "Theme" }, { label: "Language" }],
            },
          ],
        },
        {
          group: "System",
          items: [
            { label: "Notifications" },
            { label: "Settings" },
            { label: "Logout", className: "text-destructive" },
          ],
        },
      ]}
    >
      Open Menu
    </Dropdown>
  );
}
