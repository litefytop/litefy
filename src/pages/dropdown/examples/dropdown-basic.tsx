import { Dropdown, Button } from "@/component";

export default function DropdownBasic() {
  return (
    <Dropdown>
      <Dropdown.Trigger className={Button.class.variant.ghost}>
        Open Menu
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Label>My Account</Dropdown.Label>
        <Dropdown.Separator />
        <Dropdown.Item>Profile</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item>Logout</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}
