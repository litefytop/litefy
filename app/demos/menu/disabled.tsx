import { type MenuConfig } from "@/ui";
import { Menu } from "@/ui/skins";

const items: MenuConfig[] = [
  {
    group: "Account",
    items: [
      { label: "Profile", disabled: true },
      {
        label: "Preferences",
        disabled: true,
        children: [
          { label: "Theme", disabled: true },
          { label: "Language", disabled: true },
        ],
      },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Notifications", disabled: true },
      { label: "Settings", disabled: true },
      { label: "Logout", disabled: true },
    ],
  },
];

export default function Demo() {
  return <Menu items={items} inert />;
}
