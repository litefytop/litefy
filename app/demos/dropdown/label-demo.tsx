"use client";

import { Dropdown } from "@/components/ui/dropdown";

export default function DropdownLabelDemo() {
  return (
    <Dropdown>
      <Dropdown.Trigger className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors">
        Options
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Label>Actions</Dropdown.Label>
        <Dropdown.Item>New File</Dropdown.Item>
        <Dropdown.Item>Open File</Dropdown.Item>
        <Dropdown.Item>Save</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Label>Edit</Dropdown.Label>
        <Dropdown.Item>Cut</Dropdown.Item>
        <Dropdown.Item>Copy</Dropdown.Item>
        <Dropdown.Item>Paste</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}