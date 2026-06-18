"use client";

import { Tab, Tabs } from "@/ui";

export default function TabsBasicDemo() {
  return (
    <Tabs defaultValue="account">
      <Tab value="account" label="Account">
        Manage your account settings and preferences.
      </Tab>
      <Tab value="password" label="Password">
        Change your password and security settings.
      </Tab>
      <Tab value="notifications" label="Notifications">
        Configure your notification preferences.
      </Tab>
    </Tabs>
  );
}
