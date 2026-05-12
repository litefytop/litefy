import { DropdownMenu, Button } from "@/component";

export default function DropdownMenuSide() {
  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenu.Trigger className={Button.class.variant.ghost}>
          Top
        </DropdownMenu.Trigger>
        <DropdownMenu.Content y_axis="start">
          <DropdownMenu.Item>Top Content</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className={Button.class.variant.ghost}>
          Bottom
        </DropdownMenu.Trigger>
        <DropdownMenu.Content y_axis="end">
          <DropdownMenu.Item>Bottom Content</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className={Button.class.variant.ghost}>
          Left
        </DropdownMenu.Trigger>
        <DropdownMenu.Content x_axis="start" y_axis="center">
          <DropdownMenu.Item>Left Content</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className={Button.class.variant.ghost}>
          Right
        </DropdownMenu.Trigger>
        <DropdownMenu.Content x_axis="end" y_axis="center">
          <DropdownMenu.Item>Right Content</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className={Button.class.variant.ghost}>
          Custom Spacing
        </DropdownMenu.Trigger>
        <DropdownMenu.Content y_axis="end" className="mt-2">
          <DropdownMenu.Item>Menu with custom spacing</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}
