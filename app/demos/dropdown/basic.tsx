"use client";
import { Dropdown } from "@/ui";
import { Button } from "@/ui";

export default function DropdownBasicDemo() {
  return (
    <Dropdown
      slots={{
        trigger: {
          className: [Button.class.base, Button.class.variant.primary],
          children: "Open Menu",
        },
      }}
      items={[
        { itemType: "label", label: "Account" },
        { itemType: "action", label: "Profile" },
        { itemType: "action", label: "Preferences" },
        { itemType: "label", label: "System" },
        { itemType: "action", label: "Notifications" },
        { itemType: "action", label: "Settings" },
        { itemType: "action", label: "Logout", className: "text-destructive" },
      ]}
    />
  );
}
