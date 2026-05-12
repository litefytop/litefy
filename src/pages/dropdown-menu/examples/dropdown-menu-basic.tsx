import { DropdownMenu, Button } from "@/component";

export default function DropdownMenuBasic() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className={Button.class.variant.ghost}>
        Open Menu
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>My Account</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Profile</DropdownMenu.Item>
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Logout</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
