"use client";

import { Bell, LogOut, Settings } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";

export default function DropdownBasicDemo() {
  return (
    <Dropdown>
      <Dropdown.Trigger className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
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
