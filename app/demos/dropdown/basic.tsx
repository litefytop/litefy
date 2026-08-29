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
        {
          type: "group",
          label: <span className="text-muted-foreground">Account</span>,
          children: [
            { label: "Profile" },
            {
              label: "Preferences",
              children: [{ label: "Theme" }, { label: "Language" }],
            },
          ],
        },
        {
          type: "group",
          label: <span className="text-muted-foreground">System</span>,
          children: [
            { label: "Notifications" },
            { label: "Settings" },
            { label: "Logout", className: "text-destructive" },
          ],
        },
      ]}
    />
  );
}
