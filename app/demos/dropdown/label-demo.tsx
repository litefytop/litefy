"use client";

import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";

export default function DropdownLabelDemo() {
  return (
    <Dropdown>
      <Dropdown.Trigger
        className={[Button.class.base, Button.class.variant.primary]}
      >
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
