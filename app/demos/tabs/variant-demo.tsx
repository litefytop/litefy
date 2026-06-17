"use client";

import { Tab, Tabs } from "@/ui";

export default function TabsVariantDemo() {
  return (
    <div className="flex flex-col gap-8 w-md">
      <div>
        <h3 className="text-sm font-medium mb-3">Line Variant (Default)</h3>
        <Tabs defaultValue="tab1" variant="line">
          <Tab value="tab1" label="Tab One">
            Content for tab one with line variant.
          </Tab>
          <Tab value="tab2" label="Tab Two">
            Content for tab two with line variant.
          </Tab>
          <Tab value="tab3" label="Tab Three">
            Content for tab three with line variant.
          </Tab>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Button Variant</h3>
        <Tabs defaultValue="tab1" variant="button">
          <Tab value="tab1" label="Tab One">
            Content for tab one with button variant.
          </Tab>
          <Tab value="tab2" label="Tab Two">
            Content for tab two with button variant.
          </Tab>
          <Tab value="tab3" label="Tab Three">
            Content for tab three with button variant.
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
