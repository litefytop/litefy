import { Dropdown, Button } from "@/component";

export default function DropdownSide() {
  return (
    <div className="flex gap-4">
      <Dropdown>
        <Dropdown.Trigger className={Button.class.variant.primary}>
          Top
        </Dropdown.Trigger>
        <Dropdown.Content alignY="start">
          <Dropdown.Item>Top Content</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger className={Button.class.variant.secondary}>
          Bottom
        </Dropdown.Trigger>
        <Dropdown.Content alignY="end">
          <Dropdown.Item>Bottom Content</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger className={Button.class.variant.outline}>
          Left
        </Dropdown.Trigger>
        <Dropdown.Content alignX="start" alignY="center">
          <Dropdown.Item>Left Content</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger className={Button.class.variant.ghost}>
          Right
        </Dropdown.Trigger>
        <Dropdown.Content alignX="end" alignY="center">
          <Dropdown.Item>Right Content</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
      <Dropdown>
        <Dropdown.Trigger className={Button.class.variant.text}>
          Custom Spacing
        </Dropdown.Trigger>
        <Dropdown.Content alignY="end" className="mt-2">
          <Dropdown.Item>Menu with custom spacing</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
}
