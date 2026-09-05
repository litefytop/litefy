"use client";

import { Tabs } from "@/ui";

export default function TabsBasicDemo() {
  return (
    <Tabs
      defaultValue="account"
      options={[
        {
          value: "account",
          label: "Account",
          content: "Manage your account settings and preferences.",
        },
        {
          value: "password",
          label: "Password",
          content: "Change your password and security settings.",
        },
        {
          value: "notifications",
          label: "Notifications",
          content: "Configure your notification preferences.",
        },
      ]}
    />
  );
}
