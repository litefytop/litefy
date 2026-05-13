import { Dropdown, Button } from "@/component";

export default function DropdownAlign() {
  return (
    <div className="flex gap-4">
      <Dropdown>
        <Dropdown.Trigger className={Button.class.variant.primary}>
          Left Align
        </Dropdown.Trigger>
        <Dropdown.Content alignX="start">
          <Dropdown.Item>Left Aligned Content</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger className={Button.class.variant.secondary}>
          Center
        </Dropdown.Trigger>
        <Dropdown.Content alignX="center">
          <Dropdown.Item>Centered Content</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger className={Button.class.variant.outline}>
          Right Align
        </Dropdown.Trigger>
        <Dropdown.Content alignX="end">
          <Dropdown.Item>Right Aligned Content</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
