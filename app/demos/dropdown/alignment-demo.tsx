"use client";

import { Button } from "@/ui/button";
import { Dropdown } from "@/ui/dropdown";

export default function DropdownAlignmentDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium mb-4">
          Horizontal Alignment (alignX)
        </h3>
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
      </div>

      <div>
        <h3 className="text-sm font-medium mb-4">
          Vertical Alignment (alignY)
        </h3>
        <div className="flex gap-4">
          <Dropdown>
            <Dropdown.Trigger
              className={[Button.class.base, Button.class.variant.primary]}
            >
              Top Align
            </Dropdown.Trigger>
            <Dropdown.Content alignY="start">
              <Dropdown.Item>Item 1</Dropdown.Item>
              <Dropdown.Item>Item 2</Dropdown.Item>
              <Dropdown.Item>Item 3</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger
              className={[Button.class.base, Button.class.variant.primary]}
            >
              Middle Align
            </Dropdown.Trigger>
            <Dropdown.Content alignY="center">
              <Dropdown.Item>Item 1</Dropdown.Item>
              <Dropdown.Item>Item 2</Dropdown.Item>
              <Dropdown.Item>Item 3</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger
              className={[Button.class.base, Button.class.variant.primary]}
            >
              Bottom Align
            </Dropdown.Trigger>
            <Dropdown.Content alignY="end">
              <Dropdown.Item>Item 1</Dropdown.Item>
              <Dropdown.Item>Item 2</Dropdown.Item>
              <Dropdown.Item>Item 3</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
