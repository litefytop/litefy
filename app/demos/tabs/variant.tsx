"use client";

import { Tabs } from "@/ui";

export default function TabsVariantDemo() {
  return (
    <div className="flex flex-col gap-8 w-md">
      <div>
        <h3 className="text-sm font-medium mb-3">Line Variant (Default)</h3>
        <Tabs
          defaultValue="tab1"
          variant="line"
          options={[
            {
              value: "tab1",
              label: "Tab One",
              content: "Content for tab one with line variant.",
            },
            {
              value: "tab2",
              label: "Tab Two",
              content: "Content for tab two with line variant.",
            },
            {
              value: "tab3",
              label: "Tab Three",
              content: "Content for tab three with line variant.",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Button Variant</h3>
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
      </div>
    </div>
  );
}
