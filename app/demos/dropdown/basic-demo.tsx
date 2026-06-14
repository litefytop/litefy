"use client";

import { Bell, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";

export default function DropdownBasicDemo() {
  return (
    <Dropdown>
      <Dropdown.Trigger
        className={[Button.class.base, Button.class.variant.primary]}
      >
        Open Menu
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Dropdown.Item>
        <Dropdown.Item>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}
