"use client";

import { Tab, Tabs } from "@/ui";

export default function TabsOrientationDemo() {
  return (
    <div className="flex flex-col gap-8 w-md">
      <div>
        <h3 className="text-sm font-medium mb-3">Horizontal (Default)</h3>
        <Tabs defaultValue="horizontal1" orientation="horizontal">
          <Tab value="horizontal1" label="First">
            Horizontal tab content - first tab.
          </Tab>
          <Tab value="horizontal2" label="Second">
            Horizontal tab content - second tab.
          </Tab>
          <Tab value="horizontal3" label="Third">
            Horizontal tab content - third tab.
          </Tab>
        </Tabs>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Vertical</h3>
        <Tabs defaultValue="vertical1" orientation="vertical">
          <Tab value="vertical1" label="First">
            Vertical tab content - first tab.
          </Tab>
          <Tab value="vertical2" label="Second">
            Vertical tab content - second tab.
          </Tab>
          <Tab value="vertical3" label="Third">
            Vertical tab content - third tab.
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
