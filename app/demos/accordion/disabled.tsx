"use client";

import { Accordion } from "@/ui/skins";

const items = [
  {
    itemKey: "account",
    label: "Account",
    panel: <p>Manage your account settings and preferences.</p>,
  },
  {
    itemKey: "password",
    label: "Password",
    panel: <p>Change your password and security settings.</p>,
  },
  {
    itemKey: "notifications",
    label: "Notifications",
    panel: <p>Configure your notification preferences.</p>,
  },
];

export default function Demo() {
  return (
    <Accordion
      disabled
      defaultActiveKeys="account"
      items={items}
      className="mx-auto w-full"
    />
  );
}
