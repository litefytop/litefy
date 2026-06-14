"use client";

import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";

export default function DropdownAlignmentDemo() {
  return (
    <div className="flex gap-4">
      <Dropdown>
        <Dropdown.Trigger
          className={[Button.class.base, Button.class.variant.primary]}
        >
          Start Align
        </Dropdown.Trigger>
        <Dropdown.Content alignX="start">
          <Dropdown.Item>Item 1</Dropdown.Item>
          <Dropdown.Item>Item 2</Dropdown.Item>
          <Dropdown.Item>Item 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>

      <Dropdown>
        <Dropdown.Trigger
          className={[Button.class.base, Button.class.variant.primary]}
        >
          Center Align
        </Dropdown.Trigger>
        <Dropdown.Content alignX="center">
          <Dropdown.Item>Item 1</Dropdown.Item>
          <Dropdown.Item>Item 2</Dropdown.Item>
          <Dropdown.Item>Item 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>

      <Dropdown>
        <Dropdown.Trigger
          className={[Button.class.base, Button.class.variant.primary]}
        >
          End Align
        </Dropdown.Trigger>
        <Dropdown.Content alignX="end">
          <Dropdown.Item>Item 1</Dropdown.Item>
          <Dropdown.Item>Item 2</Dropdown.Item>
          <Dropdown.Item>Item 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
