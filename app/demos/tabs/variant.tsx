"use client";

import { Tabs } from "@/ui";

export default function TabsVariantDemo() {
  return (
    <Tabs
      defaultValue="tab1"
      variant="button"
      options={[
        {
          value: "tab1",
          label: "Tab One",
          content: "Content for tab one with button variant.",
        },
        {
          value: "tab2",
          label: "Tab Two",
          content: "Content for tab two with button variant.",
        },
        {
          value: "tab3",
          label: "Tab Three",
          content: "Content for tab three with button variant.",
        },
      ]}
    />
  );
}
