import { DropdownMenu, Button } from "@/component";

export default function DropdownMenuAlign() {
  return (
    <div className="flex gap-4">
      <DropdownMenu>
        <DropdownMenu.Trigger className={Button.class.variant.ghost}>
          Left Align
        </DropdownMenu.Trigger>
        <DropdownMenu.Content x_axis="start">
          <DropdownMenu.Item>Left Aligned Content</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className={Button.class.variant.ghost}>
          Center
        </DropdownMenu.Trigger>
        <DropdownMenu.Content x_axis="center">
          <DropdownMenu.Item>Centered Content</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger className={Button.class.variant.ghost}>
          Right Align
        </DropdownMenu.Trigger>
        <DropdownMenu.Content x_axis="end">
          <DropdownMenu.Item>Right Aligned Content</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}
